import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md + spacing.xs,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md + spacing.xs,
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
        gap: spacing.sm,
    },
    headerContent: {
        flex: 1,
        justifyContent: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: typography.sizes['3xl'] - 2,
        fontWeight: typography.fontWeights.bold,
        marginBottom: spacing.xs,
    },
    headerSubtitle: {
        fontSize: typography.sizes.sm + 1,
        lineHeight: typography.sizes.sm + 6,
    },
    progressBarWrapper: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
    },
    stepIndicator: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        alignItems: 'center',
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
    },
    stepTitle: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.fontWeights.bold,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    stepSubtitle: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
        lineHeight: 20,
    },
    cardWrapper: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'flex-start',
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        maxHeight: '100%',
    },
    stepContent: {
        // El contenido se ajusta automáticamente
    },
    navigationWrapper: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
    },
});
