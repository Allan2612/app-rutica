import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    price: {
        fontSize: 14,
        fontWeight: '600',
    },
    metaDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
    },
    date: {
        fontSize: 12,
    },
});
