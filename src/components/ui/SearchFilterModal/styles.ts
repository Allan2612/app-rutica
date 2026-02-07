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
        minHeight: '60%',
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
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.bold,
    },
    closeButton: {
        padding: spacing.xs,
    },
    body: {
        flex: 1,
    },
});
