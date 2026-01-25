import { StyleSheet } from 'react-native';
import { spacing, typography, colors } from '@/styles/theme';

export const styles = StyleSheet.create({
    contactSection: {
        marginTop: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        marginBottom: spacing.lg,
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    contactGrid: {
        gap: spacing.md,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        elevation: 1,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
    },
    contactIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactTextContainer: {
        flex: 1,
        gap: 1,
    },
    contactLabel: {
        fontSize: 10,
        fontWeight: typography.fontWeights.semibold,
        textTransform: 'uppercase',
        letterSpacing: 0.9,
    },
    contactValue: {
        fontSize: 16,
        fontWeight: typography.fontWeights.semibold,
    },
    noContactText: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
        lineHeight: 20,
    },
});
