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
    inputGroup: {
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
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    error: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
    },
});
