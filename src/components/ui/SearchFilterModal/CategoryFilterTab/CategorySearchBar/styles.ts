import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
        gap: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        padding: 0,
    },
    clearButton: {
        padding: 4,
    },
});
