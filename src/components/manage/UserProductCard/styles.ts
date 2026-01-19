import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 16,
    },
    cardContent: {
        flexDirection: 'row',
        padding: 12,
        gap: 12,
    },
    info: {
        flex: 1,
        gap: 6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
    },
    titleContainer: {
        flex: 1,
        gap: 6,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 20,
    },
    description: {
        fontSize: 13,
        lineHeight: 18,
    },
});
