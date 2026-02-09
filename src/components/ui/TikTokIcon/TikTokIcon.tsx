import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export interface TikTokIconProps {
  size?: number;
  color?: string;
}

export const TikTokIcon = memo(function TikTokIcon({
  size = 24,
  color = '#000000',
}: TikTokIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.88 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .55.04.81.1V9.4a6.33 6.33 0 00-.81-.05A6.35 6.35 0 003 15.7 6.35 6.35 0 009.49 22a6.35 6.35 0 006.37-6.35V9.15a8.16 8.16 0 004.73 1.52V7.22a4.85 4.85 0 01-1-.53z"
        fill={color}
      />
    </Svg>
  );
});
