import { StyleSheet } from 'react-native';
import { spacing } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing['2xl'],
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: spacing.md,
    },
    retryButton: {
        marginTop: spacing.lg,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm + 4,
        borderRadius: 24,
    },
    retryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    divider: {
        height: 8,
    },
});
