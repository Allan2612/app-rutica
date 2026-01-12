import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.background,
    },
    contentContainer: {
        paddingBottom: spacing.xl,
    },
    headerSection: {
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.xl,
        backgroundColor: colors.primary[500],
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: spacing.lg,
    },
    emoji: {
        fontSize: 56,
        marginBottom: spacing.md,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.inverse,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text.inverse,
        textAlign: 'center',
        opacity: 0.9,
    },
    benefitsSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    benefitsTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.light.text,
        marginBottom: spacing.lg,
    },
    benefitCard: {
        flexDirection: 'row',
        backgroundColor: colors.background.primary,
        borderRadius: 12,
        padding: spacing.lg,
        marginBottom: spacing.md,
        alignItems: 'flex-start',
        borderLeftWidth: 4,
        borderLeftColor: colors.primary[500],
        shadowColor: colors.dark.background,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    benefitIcon: {
        fontSize: 32,
        marginRight: spacing.md,
    },
    benefitContent: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.light.text,
        marginBottom: spacing.xs,
    },
    benefitDescription: {
        fontSize: 14,
        color: colors.text.secondary,
        lineHeight: 20,
    },
    ctaSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    primaryButton: {
        backgroundColor: colors.primary[500],
        paddingVertical: spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: spacing.md,
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        fontSize: 16,
        color: colors.text.inverse,
        fontWeight: '600',
    },
    ctaSubtext: {
        fontSize: 13,
        color: colors.text.secondary,
        textAlign: 'center',
    },
    infoSection: {
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 16,
        color: colors.text.secondary,
        textAlign: 'center',
    },
    loginLink: {
        color: colors.primary[500],
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
