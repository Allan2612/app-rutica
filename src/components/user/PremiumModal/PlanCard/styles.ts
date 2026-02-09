import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  planCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  planCardWithBadge: {
    paddingTop: 38,
  },
  planCardSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendedText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  planHeaderLeft: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '800',
    flexShrink: 0,
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 21,
  },
  planFeatures: {
    borderTopWidth: 1,
    paddingTop: 16,
    gap: 10,
  },
  planFeatureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  planFeatureText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  selectionIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
