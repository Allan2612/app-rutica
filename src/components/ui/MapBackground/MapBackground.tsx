import { memo, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

// Animated SVG components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Configuración de rutas SVG (paths con curvas bezier)
interface PathConfig {
  id: string;
  d: string; // SVG path data (se escala dinámicamente)
  strokeWidth: number;
}

// Configuración de nodos (puntos)
interface NodeConfig {
  id: string;
  cx: number; // % del ancho
  cy: number; // % del alto
  r: number;
  delay: number;
}

// Paths predefinidos (coordenadas en % que se escalarán)
// Usamos paths relativos que simulan rutas de mapa
const createPaths = (w: number, h: number): PathConfig[] => [
  {
    id: 'p1',
    d: `M ${w * 0.05} ${h * 0.25} Q ${w * 0.2} ${h * 0.15} ${w * 0.35} ${h * 0.28} T ${w * 0.55} ${h * 0.22}`,
    strokeWidth: 2,
  },
  {
    id: 'p2',
    d: `M ${w * 0.4} ${h * 0.35} Q ${w * 0.55} ${h * 0.45} ${w * 0.7} ${h * 0.38} T ${w * 0.95} ${h * 0.42}`,
    strokeWidth: 1.5,
  },
  {
    id: 'p3',
    d: `M ${w * 0.1} ${h * 0.55} C ${w * 0.25} ${h * 0.5} ${w * 0.35} ${h * 0.65} ${w * 0.5} ${h * 0.58}`,
    strokeWidth: 2,
  },
  {
    id: 'p4',
    d: `M ${w * 0.5} ${h * 0.58} Q ${w * 0.65} ${h * 0.52} ${w * 0.75} ${h * 0.62} T ${w * 0.92} ${h * 0.55}`,
    strokeWidth: 1.5,
  },
  {
    id: 'p5',
    d: `M ${w * 0.15} ${h * 0.75} C ${w * 0.3} ${h * 0.7} ${w * 0.45} ${h * 0.82} ${w * 0.6} ${h * 0.78}`,
    strokeWidth: 2,
  },
  {
    id: 'p6',
    d: `M ${w * 0.6} ${h * 0.78} Q ${w * 0.75} ${h * 0.72} ${w * 0.85} ${h * 0.85} T ${w * 0.95} ${h * 0.8}`,
    strokeWidth: 1.5,
  },
  // Conexiones verticales/diagonales
  {
    id: 'p7',
    d: `M ${w * 0.25} ${h * 0.2} Q ${w * 0.28} ${h * 0.35} ${w * 0.22} ${h * 0.5} T ${w * 0.25} ${h * 0.7}`,
    strokeWidth: 1.5,
  },
  {
    id: 'p8',
    d: `M ${w * 0.7} ${h * 0.25} C ${w * 0.72} ${h * 0.4} ${w * 0.68} ${h * 0.55} ${w * 0.72} ${h * 0.72}`,
    strokeWidth: 1.5,
  },
  {
    id: 'p9',
    d: `M ${w * 0.48} ${h * 0.3} Q ${w * 0.5} ${h * 0.45} ${w * 0.52} ${h * 0.58}`,
    strokeWidth: 1,
  },
];

// Nodos predefinidos (puntos de interés en intersecciones)
const NODES: NodeConfig[] = [
  { id: 'n1', cx: 5, cy: 25, r: 5, delay: 0 },
  { id: 'n2', cx: 35, cy: 28, r: 4, delay: 600 },
  { id: 'n3', cx: 55, cy: 22, r: 6, delay: 300 },
  { id: 'n4', cx: 25, cy: 20, r: 4, delay: 900 },
  { id: 'n5', cx: 40, cy: 35, r: 5, delay: 1200 },
  { id: 'n6', cx: 70, cy: 38, r: 6, delay: 500 },
  { id: 'n7', cx: 95, cy: 42, r: 4, delay: 800 },
  { id: 'n8', cx: 10, cy: 55, r: 5, delay: 1100 },
  { id: 'n9', cx: 50, cy: 58, r: 7, delay: 200 },
  { id: 'n10', cx: 75, cy: 62, r: 5, delay: 1400 },
  { id: 'n11', cx: 92, cy: 55, r: 4, delay: 700 },
  { id: 'n12', cx: 15, cy: 75, r: 6, delay: 1000 },
  { id: 'n13', cx: 60, cy: 78, r: 5, delay: 400 },
  { id: 'n14', cx: 85, cy: 85, r: 6, delay: 1300 },
  { id: 'n15', cx: 25, cy: 70, r: 4, delay: 1600 },
  { id: 'n16', cx: 72, cy: 72, r: 5, delay: 1500 },
];

// Componente para un nodo pulsante (SVG)
const PulsingNode = memo(function PulsingNode({
  cx,
  cy,
  r,
  delay,
  color,
  width,
  height,
}: {
  cx: number;
  cy: number;
  r: number;
  delay: number;
  color: string;
  width: number;
  height: number;
}) {
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

// Componente para un punto viajero (View animada sobre el SVG)
const TravelingDot = memo(function TravelingDot({
  startX,
  startY,
  endX,
  endY,
  duration,
  delay,
  color,
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  delay: number;
  color: string;
}) {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      )
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

export const MapBackground = memo(function MapBackground() {
  const colors = useThemedColors();
  const { width, height } = useWindowDimensions();
  const { isDark } = colors;

  // Opacidad total del fondo según tema
  const containerOpacity = isDark ? 0.18 : 0.1;

  // Color para rutas y nodos
  const strokeColor = isDark ? colors.primary[400] : colors.primary[600];
  const nodeColor = isDark ? colors.primary[300] : colors.primary[500];

  // Colores del gradiente
  const gradientColors: [string, string, string] = [
    colors.background.primary,
    colors.background.secondary,
    colors.background.primary,
  ];

  // Generar paths escalados
  const paths = createPaths(width, height);

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Gradiente de fondo sutil */}
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* SVG con rutas y nodos */}
      <View style={[styles.elementsContainer, { opacity: containerOpacity }]}>
        <Svg width={width} height={height} style={styles.svg}>
          {/* Rutas (paths con curvas bezier) */}
          <G>
            {paths.map((path) => (
              <Path
                key={path.id}
                d={path.d}
                stroke={strokeColor}
                strokeWidth={path.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={0.6}
              />
            ))}
          </G>

          {/* Nodos pulsantes */}
          <G>
            {NODES.map((node) => (
              <PulsingNode
                key={node.id}
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                delay={node.delay}
                color={nodeColor}
                width={width}
                height={height}
              />
            ))}
          </G>
        </Svg>

        {/* Puntos viajeros (fuera del SVG para mejor animación) */}
        <TravelingDot
          startX={5}
          startY={25}
          endX={55}
          endY={22}
          duration={14000}
          delay={0}
          color={nodeColor}
        />
        <TravelingDot
          startX={10}
          startY={55}
          endX={92}
          endY={55}
          duration={18000}
          delay={4000}
          color={nodeColor}
        />
        <TravelingDot
          startX={25}
          startY={20}
          endX={25}
          endY={70}
          duration={12000}
          delay={2000}
          color={nodeColor}
        />
      </View>
    </View>
  );
});
