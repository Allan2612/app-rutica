import { memo, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';

interface TravelingDotProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  delay: number;
  color: string;
}

/**
 * Punto animado que viaja a lo largo de una ruta
 */
export const TravelingDot = memo(function TravelingDot({
  startX,
  startY,
  endX,
  endY,
  duration,
  delay,
  color,
}: TravelingDotProps) {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 0 }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, duration, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const x = interpolate(progress.value, [0, 1], [startX, endX]);
    const y = interpolate(progress.value, [0, 1], [startY, endY]);
    const opacity = interpolate(progress.value, [0, 0.08, 0.92, 1], [0, 0.9, 0.9, 0]);

    return {
      position: 'absolute',
      left: (x / 100) * width - 4,
      top: (y / 100) * height - 4,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: color,
      opacity,
    };
  });

  return <Animated.View style={animatedStyle} />;
});
