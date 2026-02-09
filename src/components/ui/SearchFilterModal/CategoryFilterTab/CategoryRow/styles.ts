import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  scrollWrapper: {
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 8,
    gap: 8,
  },
});
