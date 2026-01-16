import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    required: {
        color: '#ef4444',
    },
    currencyOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    currencyOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        gap: 8,
    },
    currencyText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
