import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
        marginBottom: 12,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
    },
    label: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: spacing.md,
        letterSpacing: 0.3,
        textAlign: 'center',
    },
    option: {
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
        gap: 8,
    },
    optionIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    optionImage: {
        width: 44,
        height: 44,
    },
    optionText: {
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
        maxWidth: 70,
    },
});
