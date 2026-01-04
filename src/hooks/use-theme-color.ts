/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { colors } from '../styles/theme/colors';
import { useColorScheme } from './use-color-scheme';

type ThemeProps = { light?: string; dark?: string };
type ColorName = keyof typeof colors.light & keyof typeof colors.dark;

export function useThemeColor(
  props: ThemeProps,
  colorName: ColorName
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return colors[theme][colorName];
  }
}
