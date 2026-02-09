import { StyleSheet, Platform } from 'react-native';
import { spacing, typography } from '@/styles/theme';

const isWeb = Platform.OS === 'web';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        minHeight: '75%',
        ...(isWeb && {
            maxWidth: 600,
            alignSelf: 'center',
            width: '100%',
            borderRadius: 24,
            marginBottom: 40,
        }),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    closeButton: {
        padding: spacing.xs,
        marginRight: spacing.md,
    },
    title: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.fontWeights.semibold,
        flex: 1,
    },
    confirmButton: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: 8,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
    },
    content: {
        flex: 1,
    },
});
