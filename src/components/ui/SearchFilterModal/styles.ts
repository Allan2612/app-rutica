import { StyleSheet, Platform } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

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
        minHeight: '50%',
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
    searchSection: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
    },
    searchInput: {
        flex: 1,
        paddingVertical: spacing.sm + 2,
        fontSize: typography.sizes.base,
    },
    categoriesSection: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    categoriesScroll: {
        flex: 1,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        paddingBottom: spacing.md,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        borderWidth: 1,
    },
    categoryText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    categoryCheckIcon: {
        marginRight: spacing.xs,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        borderTopWidth: 1,
    },
    clearButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clearButtonText: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
    },
    applyButton: {
        flex: 2,
        paddingVertical: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyButtonText: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.bold,
        color: colors.text.inverse,
    },
});

// Estilos específicos para web que no son compatibles con TextStyle de React Native
export const webStyles = {
    searchInputWeb: isWeb ? { outlineStyle: 'none', outlineWidth: 0 } : {},
};
