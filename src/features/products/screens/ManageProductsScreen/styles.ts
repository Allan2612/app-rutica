import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        gap: 16,
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
    },
    loadingText: {
        fontSize: 14,
        marginTop: 16,
    },
});
