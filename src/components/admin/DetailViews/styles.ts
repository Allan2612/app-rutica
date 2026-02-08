// ============================================
// Admin DetailViews - Shared Styles
// ============================================

import { StyleSheet } from 'react-native';

export const detailViewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  entityName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  activeIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
  },
  toggleWrapper: {
    borderRadius: 12,
    marginBottom: 16,
  },

  // Event specific
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  freeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  freeBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Promotion specific - Discount
  discountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  discountValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  discountType: {
    fontSize: 14,
  },

  // Promotion specific - Combo
  comboCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  comboHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  comboTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  comboBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  comboBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  comboList: {
    gap: 12,
  },
  comboItem: {
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  comboItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  comboItemName: {
    fontSize: 15,
    fontWeight: '600',
  },
  comboItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comboItemQuantity: {
    fontSize: 13,
  },
  comboItemPrice: {
    fontSize: 15,
    fontWeight: '600',
  },
});
