import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 24,
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
    },
    tab: {
        paddingVertical: 12,
        position: 'relative',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        letterSpacing: 0.2,
    },
    tabTextActive: {
        color: '#000',
        fontWeight: '700',
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#000',
    },
});
