import { StyleSheet, Platform } from 'react-native';
import { spacing, typography } from '@/styles/theme';

const isWeb = Platform.OS === 'web';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.lg,
    },
    label: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
    },
    input: {
        flex: 1,
        paddingVertical: spacing.sm + 2,
        fontSize: typography.sizes.base,
    },
    clearButton: {
        padding: spacing.xs,
    },
    hint: {
        fontSize: typography.sizes.sm,
        marginTop: spacing.md,
        fontStyle: 'italic',
    },
});

// Estilos específicos para web
export const webStyles = {
    inputWeb: isWeb ? { outlineStyle: 'none', outlineWidth: 0 } : {},
};
