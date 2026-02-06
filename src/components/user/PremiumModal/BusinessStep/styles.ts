import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    businessCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        marginBottom: 12,
    },
    businessCardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    businessName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
    },
    selectedPlansInfo: {
        marginBottom: 20,
        padding: 12,
        borderRadius: 8,
    },
    selectedPlansTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    selectedPlansText: {
        fontSize: 13,
    },
});
