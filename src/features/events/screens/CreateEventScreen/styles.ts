import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        gap: spacing.lg,
        paddingBottom: spacing['3xl'],
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
    },
    header: {
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: typography.sizes.sm,
        lineHeight: 20,
    },
    formCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: spacing.lg,
        gap: spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingCard: {
        padding: spacing.xl,
        borderRadius: 12,
        alignItems: 'center',
        gap: spacing.md,
    },
    loadingText: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.medium,
    },
});
