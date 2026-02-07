import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    card: {
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
    },
    count: {
        fontSize: 14,
        fontWeight: '600',
    },
    percentage: {
        fontSize: 11,
    },
});
