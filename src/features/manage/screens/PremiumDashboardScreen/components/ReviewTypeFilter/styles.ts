import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
        marginBottom: 16,
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
    buttons: {
        flexDirection: 'row',
        gap: spacing.sm,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    button: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 12,
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    buttonText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
        letterSpacing: 0.2,
    },
});
