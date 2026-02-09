import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
  },
  scrollWrapper: {
    paddingHorizontal: 16,
  },
  scrollContent: {
    gap: 10,
    alignItems: 'center',
    paddingBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingLeft: 14,
    paddingRight: 8,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    userSelect: 'none',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    userSelect: 'none',
  },
  removeButton: {
    padding: 2,
    userSelect: 'none',
  },
});
