import { memo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';

interface ProgressBarProps {
  used: number;
  max: number;
  color: string;
  bgColor: string;
}

export const ProgressBar = memo(function ProgressBar({
  used,
  max,
  color,
  bgColor,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((used / max) * 100, 100) : 0;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            width: `${percentage}%`,
          },
        ]}
      />
    </View>
  );
});
