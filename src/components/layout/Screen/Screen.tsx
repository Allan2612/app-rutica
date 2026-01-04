import { memo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';

export interface ScreenProps {
  children: React.ReactNode;
}

export const Screen = memo(function Screen({ children }: ScreenProps) {
  return <View style={styles.container}>{children}</View>;
});
