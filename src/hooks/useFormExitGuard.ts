import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, BackHandler } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

interface UseFormExitGuardOptions {
    /** Indica si hay cambios sin guardar en el formulario */
    hasChanges: boolean;
    /** Callback a ejecutar cuando se confirma la salida */
    onExit?: () => void;
}

interface UseFormExitGuardReturn {
    /** Indica si el diálogo de confirmación debe estar visible */
    showExitDialog: boolean;
    /** Función para mostrar el diálogo de confirmación */
    requestExit: () => void;
    /** Función para confirmar la salida */
    confirmExit: () => void;
    /** Función para cancelar la salida y cerrar el diálogo */
    cancelExit: () => void;
    /** Función para manejar el back button de forma segura */
    handleSafeBack: () => void;
}

/**
 * Hook para manejar la confirmación de salida en formularios con cambios sin guardar.
 * Intercepta la navegación atrás en Android y el historial del navegador en web.
 *
 * Usa refs sincrónicas en lugar de estado para las flags de navegación,
 * evitando race conditions entre event handlers y el ciclo de renderizado.
 *
 * @example
 * const { showExitDialog, handleSafeBack, confirmExit, cancelExit } = useFormExitGuard({
 *     hasChanges,
 *     onExit: () => router.push('/(app)/(tabs)/manage/businesses'),
 * });
 */
export function useFormExitGuard({
    hasChanges,
    onExit,
}: UseFormExitGuardOptions): UseFormExitGuardReturn {
    const router = useRouter();
    const pathname = usePathname();
    const [showExitDialog, setShowExitDialog] = useState(false);

    // === Refs sincrónicas para evitar race conditions ===
    // pendingRef: navegación en curso (temporal, se resetea tras transición)
    const pendingRef = useRef(false);
    // exitConfirmedRef: el usuario ya confirmó "Descartar". PERMANENTE.
    // Una vez true, el guard queda completamente deshabilitado hasta que
    // el componente se desmonte y se vuelva a montar.
    const exitConfirmedRef = useRef(false);
    const mountedRef = useRef(true);
    const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Mantener siempre el valor actual de hasChanges accesible desde cualquier closure
    const hasChangesRef = useRef(hasChanges);
    hasChangesRef.current = hasChanges;
    // Track si ya pusheamos un entry al history para interceptar popstate
    const historyGuardActiveRef = useRef(false);
    // Pathname donde se montó el guard
    const formPathnameRef = useRef(pathname);

    /** Helper: ¿El guard debe estar activo? */
    const isGuardActive = () =>
        hasChangesRef.current && !pendingRef.current && !exitConfirmedRef.current;

    // Cleanup al desmontar: cancelar timers y marcar como desmontado
    useEffect(() => {
        mountedRef.current = true;
        pendingRef.current = false;
        exitConfirmedRef.current = false;
        return () => {
            mountedRef.current = false;
            if (exitTimerRef.current) {
                clearTimeout(exitTimerRef.current);
                exitTimerRef.current = null;
            }
        };
    }, []);

    // Si el pathname cambia (se navegó a otra pantalla), resetear todo el estado
    useEffect(() => {
        if (pathname !== formPathnameRef.current) {
            setShowExitDialog(false);
            pendingRef.current = false;
            historyGuardActiveRef.current = false;
            formPathnameRef.current = pathname;
            // NO resetear exitConfirmedRef: si se confirmó salida, debe
            // permanecer deshabilitado aunque el pathname cambie (el componente
            // puede seguir montado en el stack).
        }
    }, [pathname]);

    // Si hasChanges pasa a false (ej: se guardó el formulario), cerrar diálogo
    // y resetear exitConfirmedRef para que el guard funcione de nuevo si
    // el usuario vuelve a editar.
    useEffect(() => {
        if (!hasChanges) {
            setShowExitDialog(false);
            exitConfirmedRef.current = false;
        }
    }, [hasChanges]);

    // Solicitar salida: muestra diálogo si hay cambios, si no navega directo
    const requestExit = useCallback(() => {
        if (pendingRef.current || exitConfirmedRef.current) return;

        if (hasChangesRef.current) {
            setShowExitDialog(true);
        } else {
            pendingRef.current = true;
            if (onExit) {
                onExit();
            } else {
                router.back();
            }
            setTimeout(() => {
                if (mountedRef.current) pendingRef.current = false;
            }, 500);
        }
    }, [onExit, router]);

    // Confirmar salida: cierra diálogo y navega
    const confirmExit = useCallback(() => {
        if (pendingRef.current || exitConfirmedRef.current) return;

        // Marcar PERMANENTEMENTE que el usuario ya descartó.
        // Esto previene que CUALQUIER evento futuro (popstate, BackHandler, tab change)
        // vuelva a mostrar el diálogo mientras el componente siga montado.
        exitConfirmedRef.current = true;
        pendingRef.current = true;
        setShowExitDialog(false);

        // Limpiar timer anterior si existe
        if (exitTimerRef.current) {
            clearTimeout(exitTimerRef.current);
        }

        // Pequeño delay para que la animación del modal cierre primero
        exitTimerRef.current = setTimeout(() => {
            if (onExit) {
                onExit();
            } else {
                router.back();
            }
            // Resetear solo pendingRef (exitConfirmedRef permanece true)
            exitTimerRef.current = setTimeout(() => {
                if (mountedRef.current) {
                    pendingRef.current = false;
                }
            }, 500);
        }, 50);
    }, [onExit, router]);

    // Cancelar salida: cierra diálogo, no navega
    const cancelExit = useCallback(() => {
        setShowExitDialog(false);
    }, []);

    const handleSafeBack = requestExit;

    // === Android: interceptar botón de atrás del hardware ===
    useEffect(() => {
        if (Platform.OS !== 'android') return;

        const onBackPress = () => {
            if (!isGuardActive()) return false; // Dejar pasar
            setShowExitDialog(true);
            return true; // Interceptar
        };

        const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => sub.remove();
    }, []); // Sin dependencias: usa refs

    // === Web: advertir antes de cerrar pestaña ===
    useEffect(() => {
        if (Platform.OS !== 'web') return;

        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isGuardActive()) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        window.addEventListener('beforeunload', onBeforeUnload);
        return () => window.removeEventListener('beforeunload', onBeforeUnload);
    }, []); // Sin dependencias: usa refs

    // === Web: pushear UNA entrada al history cuando hay cambios ===
    useEffect(() => {
        if (Platform.OS !== 'web') return;

        if (hasChanges && !exitConfirmedRef.current && !historyGuardActiveRef.current) {
            window.history.pushState({ __formGuard: true }, '', window.location.href);
            historyGuardActiveRef.current = true;
        }

        if (!hasChanges) {
            historyGuardActiveRef.current = false;
        }
    }, [hasChanges]);

    // === Web: interceptar navegación con popstate ===
    useEffect(() => {
        if (Platform.OS !== 'web') return;

        const onPopState = () => {
            if (!isGuardActive()) {
                historyGuardActiveRef.current = false;
                return;
            }

            // Re-pushear entrada guard y mostrar diálogo
            window.history.pushState({ __formGuard: true }, '', window.location.href);
            historyGuardActiveRef.current = true;
            setShowExitDialog(true);
        };

        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []); // Sin dependencias: usa refs

    return {
        showExitDialog,
        requestExit,
        confirmExit,
        cancelExit,
        handleSafeBack,
    };
}
