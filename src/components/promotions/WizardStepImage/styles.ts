import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        // Se ajusta al contenido
    },
    content: {
        padding: spacing.md,
        gap: spacing.md,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: spacing.xs,
    },
    errorText: {
        fontSize: typography.sizes.xs,
    },
});
