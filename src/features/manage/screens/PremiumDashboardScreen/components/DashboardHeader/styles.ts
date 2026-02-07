import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
    },
    headerContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.xs,
    },
    headerTitle: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
    },
    headerSubtitle: {
        fontSize: typography.sizes.sm,
        lineHeight: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginTop: spacing.md,
        borderRadius: 12,
        padding: 4,
        gap: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabActive: {},
    tabText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    tabTextActive: {
        fontWeight: typography.fontWeights.bold,
    },
});
