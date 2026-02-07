import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: '700',
        marginBottom: spacing.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    gridMobile: {
        gap: spacing.sm,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderRadius: spacing.md,
        borderWidth: 1,
    },
    actionCardMobile: {
        width: '48.5%',
        paddingHorizontal: spacing.sm + 4,
        paddingVertical: spacing.sm + 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: spacing.sm + 4,
    },
    actionTitle: {
        fontSize: typography.sizes.sm,
        fontWeight: '600',
    },
    actionSubtitle: {
        fontSize: typography.sizes.xs,
        marginTop: 2,
    },
});
