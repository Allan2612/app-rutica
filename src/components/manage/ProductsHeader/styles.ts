import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        gap: 12,
    },
    businessInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingTop: 8,
    },
    businessName: {
        fontSize: 15,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
    },
    headerSubtitle: {
        fontSize: 14,
        lineHeight: 20,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 8,
        marginTop: 8,
    },
    addButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
