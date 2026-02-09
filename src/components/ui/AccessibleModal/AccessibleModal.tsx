import { memo, useEffect, useRef, useCallback } from 'react';
import { Modal, ModalProps, View, Platform, NativeSyntheticEvent } from 'react-native';

interface AccessibleModalProps extends ModalProps {
  children: React.ReactNode;
}

/**
 * Modal accesible que maneja correctamente el foco para evitar
 * warnings de aria-hidden en React Native Web.
 *
 * Este componente:
 * 1. Mueve el foco al contenido del modal cuando se abre
 * 2. Restaura el foco al elemento anterior cuando se cierra
 * 3. Añade las props de accesibilidad correctas
 */
export const AccessibleModal = memo(function AccessibleModal({
  children,
  visible,
  onRequestClose,
  ...props
}: AccessibleModalProps) {
  const previousActiveElement = useRef<Element | null>(null);
  const modalContentRef = useRef<View>(null);

  // Manejar el foco cuando el modal se abre/cierra
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    if (visible) {
      // Guardar el elemento actualmente enfocado
      previousActiveElement.current = document.activeElement;

      // Mover el foco al contenido del modal después de un breve delay
      // para permitir que el modal se renderice
      const timeoutId = setTimeout(() => {
        // Buscar el primer elemento focusable dentro del modal
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const modalFocusables = Array.from(focusableElements).filter((el) => {
          // Verificar si el elemento está dentro de un modal visible
          const closestModal = el.closest('[role="dialog"], [aria-modal="true"]');
          return closestModal !== null;
        });

        if (modalFocusables.length > 0) {
          (modalFocusables[0] as HTMLElement).focus();
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    } else {
      // Restaurar el foco al elemento anterior cuando se cierra el modal
      if (previousActiveElement.current && 'focus' in previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus();
      }
    }
  }, [visible]);

  // Manejar tecla Escape
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && visible && onRequestClose) {
        // Crear un evento sintético vacío para satisfacer la firma
        onRequestClose({} as NativeSyntheticEvent<unknown>);
      }
    },
    [visible, onRequestClose],
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      {...props}
      // Props de accesibilidad
      accessibilityViewIsModal={true}
    >
      <View
        ref={modalContentRef}
        style={{ flex: 1 }}
        role="dialog"
        aria-modal={true}
        accessible={true}
      >
        {children}
      </View>
    </Modal>
  );
});

export default AccessibleModal;
