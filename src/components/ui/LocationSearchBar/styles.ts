import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme/colors';
import { getShadowStyle } from '../../../utils/shadowHelper';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },

  dropdown: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border.medium,
    maxHeight: 450,
    overflow: 'hidden',
    ...getShadowStyle({
      color: '#000',
      offsetY: 8,
      opacity: 0.15,
      radius: 24,
      elevation: 8,
    }),
  },
});
