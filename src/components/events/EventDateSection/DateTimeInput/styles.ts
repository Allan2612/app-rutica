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
});
