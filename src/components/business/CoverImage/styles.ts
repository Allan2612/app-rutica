import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 340, // 280 (cover) + 60 (mitad inferior del logo que sobresale)
    marginBottom: 0,
  },
  coverImageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: colors.background.secondary,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border.medium,
  },
  logoContainer: {
    position: 'absolute',
    top: 220,
    left: '50%',
    marginLeft: -60,
    width: 120,
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderWidth: 4,
    borderColor: colors.background.primary,
    backgroundColor: colors.background.primary,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 240,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  ratingCount: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
  },
});
