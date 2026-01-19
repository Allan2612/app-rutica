import { useState, useEffect, useCallback } from 'react';
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
    const [pendingNavigation, setPendingNavigation] = useState(false);

    // Función para solicitar la salida (muestra el diálogo si hay cambios)
    const requestExit = useCallback(() => {
        if (hasChanges) {
            setShowExitDialog(true);
        } else {
            if (onExit) {
                onExit();
            } else {
                router.back();
            }
        }
    }, [hasChanges, onExit, router]);

    // Función para confirmar la salida
    const confirmExit = useCallback(() => {
        setShowExitDialog(false);
        setPendingNavigation(true);
        
        // Pequeño delay para que el modal se cierre primero
        setTimeout(() => {
            if (onExit) {
                onExit();
            } else {
                router.back();
            }
            setPendingNavigation(false);
        }, 100);
    }, [onExit, router]);

    // Función para cancelar la salida
    const cancelExit = useCallback(() => {
        setShowExitDialog(false);
    }, []);

    // Alias para manejar el back button de forma segura
    const handleSafeBack = requestExit;

    // Interceptar el botón de atrás en Android
    useEffect(() => {
        if (Platform.OS !== 'android') return;

        const handleBackPress = () => {
            if (pendingNavigation) {
                return false; // Permitir navegación
            }
            
            if (hasChanges && !showExitDialog) {
                setShowExitDialog(true);
                return true; // Prevenir navegación
            }
            
            return false; // Permitir navegación normal
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        
        return () => subscription.remove();
    }, [hasChanges, showExitDialog, pendingNavigation]);

    // Interceptar navegación en web usando beforeunload
    useEffect(() => {
        if (Platform.OS !== 'web') return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasChanges && !pendingNavigation) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasChanges, pendingNavigation]);

    // Interceptar navegación con popstate en web
    useEffect(() => {
        if (Platform.OS !== 'web') return;

        const handlePopState = (e: PopStateEvent) => {
            if (hasChanges && !pendingNavigation && !showExitDialog) {
                // Prevenir la navegación volviendo a la página actual
                window.history.pushState(null, '', window.location.href);
                setShowExitDialog(true);
            }
        };

        // Agregar un estado al historial para poder interceptar
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [hasChanges, pendingNavigation, showExitDialog, pathname]);

    return {
        showExitDialog,
        requestExit,
        confirmExit,
        cancelExit,
        handleSafeBack,
    };
}
