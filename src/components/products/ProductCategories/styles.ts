import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    categoriesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    categoryChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '500',
    },
});
