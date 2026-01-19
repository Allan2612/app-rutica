import { memo } from 'react';
import { View } from 'react-native';
import { useThemedColors } from '@/hooks';

export interface ScreenProps {
  children: React.ReactNode;
}

export const Screen = memo(function Screen({ children }: ScreenProps) {
  const colors = useThemedColors();
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      {children}
    </View>
  );
});
