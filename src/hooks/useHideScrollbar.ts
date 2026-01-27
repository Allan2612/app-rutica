import { useEffect } from 'react';
import { Platform } from 'react-native';

const STYLE_ID = 'rutica-hide-scrollbar-styles';

/**
 * Hook para ocultar el scrollbar en contenedores web
 * Inyecta CSS globalmente una sola vez
 */
export function useHideScrollbar(): void {
    useEffect(() => {
        if (Platform.OS === 'web' && typeof document !== 'undefined') {
            // Verificar si ya existe el estilo
            if (!document.getElementById(STYLE_ID)) {
                const style = document.createElement('style');
                style.id = STYLE_ID;
                style.textContent = `
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }, []);
}

/**
 * Obtiene los estilos para un contenedor de scroll en web
 * @param borderColor Color del borde
 * @returns Estilos CSS para aplicar en web
 */
export function getWebScrollContainerStyles(borderColor: string): React.CSSProperties {
    return {
        border: `1px solid ${borderColor}`,
        borderRadius: 12,
        padding: 8,
    };
}

export default useHideScrollbar;
