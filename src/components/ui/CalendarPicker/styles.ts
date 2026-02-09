import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

const DAY_SIZE = 40;

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },
  navButton: {
    padding: spacing.sm,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  monthYearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  monthYearText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  weekDayText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
    textTransform: 'uppercase',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButton: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: DAY_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.normal,
  },
  selectedDay: {},
  selectedDayText: {
    color: '#ffffff',
    fontWeight: typography.fontWeights.semibold,
  },
  todayDay: {
    borderWidth: 2,
  },
  disabledDay: {
    opacity: 0.3,
  },
  // Estilos para los modales de selección
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  pickerContainer: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    padding: spacing.lg,
    maxHeight: 400,
  },
  pickerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  pickerScroll: {
    maxHeight: 300,
  },
  pickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pickerItem: {
    width: 80,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickerItemSelected: {},
  pickerItemDisabled: {
    opacity: 0.3,
  },
  pickerItemText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.medium,
  },
  pickerItemTextSelected: {
    color: '#ffffff',
    fontWeight: typography.fontWeights.bold,
  },
});
