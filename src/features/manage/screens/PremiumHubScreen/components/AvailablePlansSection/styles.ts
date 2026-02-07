import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 600,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
        textAlign: 'center',
    },
    sectionTitleSpacing: {
        marginTop: 24,
    },
    sectionSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    planCard: {
        borderRadius: 12,
        padding: 12,
        width: '48%',
        position: 'relative',
        overflow: 'hidden',
    },
    centeredContainer: {
        marginTop: 12,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    featuredPlanCard: {
        borderRadius: 12,
        padding: 12,
        width: '48%',
        position: 'relative',
        overflow: 'hidden',
    },
    featuresListFeatured: {
        gap: 6,
        marginTop: 4,
    },
    featuredBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 8,
    },
    featuredBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '600',
    },
    planIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    planName: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 2,
    },
    planPrice: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 8,
    },
    featuresList: {
        gap: 4,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    featureText: {
        fontSize: 10,
        flex: 1,
    },
});
