import { memo, useEffect } from 'react';
import { Circle } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withRepeat,
    withTiming,
    withDelay,
    withSequence,
    Easing,
    interpolate,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PulsingNodeProps {
    cx: number;
    cy: number;
    r: number;
    delay: number;
    color: string;
    width: number;
    height: number;
}

/**
 * Nodo SVG con animación de pulso
 */
export const PulsingNode = memo(function PulsingNode({
    cx,
    cy,
    r,
    delay,
    color,
    width,
    height,
}: PulsingNodeProps) {
    const pulse = useSharedValue(0);

    useEffect(() => {
        pulse.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                false
            )
        );
    }, [delay, pulse]);

    const animatedProps = useAnimatedProps(() => {
        const scale = interpolate(pulse.value, [0, 1], [0.7, 1.4]);
        const opacity = interpolate(pulse.value, [0, 0.5, 1], [0.3, 0.85, 0.3]);

        return {
            r: r * scale,
            opacity,
        };
    });

    return (
        <AnimatedCircle
            cx={(cx / 100) * width}
            cy={(cy / 100) * height}
            fill={color}
            animatedProps={animatedProps}
        />
    );
});
