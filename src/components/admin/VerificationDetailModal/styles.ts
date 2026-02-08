import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  entityName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCardValue: {
    fontSize: 15,
    lineHeight: 22,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
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
  dateRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  dateSeparator: {
    width: 1,
    height: 32,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  comboList: {
    gap: 12,
    marginTop: 4,
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
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageGallery: {
    marginTop: 8,
  },
  galleryImage: {
    width: 160,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
