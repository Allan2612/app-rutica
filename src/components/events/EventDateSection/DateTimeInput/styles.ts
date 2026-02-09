import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  dateText: {
    fontSize: typography.sizes.sm,
    flex: 1,
    flexShrink: 1,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
    width: 0,
    height: 0,
  } as any,

  // Estilos del modal para iOS
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
  },
  modalCancelText: {
    fontSize: typography.sizes.base,
    fontWeight: '500',
  },
  modalConfirmText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
  },
  iosPicker: {
    height: 200,
    width: '100%',
    alignSelf: 'center',
  },
});
