import { memo, useCallback, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedColors } from '@/hooks';
import { shadows } from '@/styles/theme';
import styles from './styles';

export type ManageCardVariant = 'default' | 'admin' | 'premium';

export interface ManageCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onPress: () => void;
  variant?: ManageCardVariant;
  badgeText?: string;
  testID?: string;
}

export const ManageCard = memo(function ManageCard({
  title,
  description,
  icon,
  onPress,
  variant = 'default',
  badgeText,
  testID,
}: ManageCardProps) {
  const colors = useThemedColors();
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = useCallback(
    (toValue: number) => {
      Animated.spring(scale, {
        toValue,
        useNativeDriver: true,
        friction: 8,
        tension: 120,
      }).start();
    },
    [scale],
  );

  const handlePressIn = useCallback(() => {
    animateTo(0.97);
  }, [animateTo]);

  const handlePressOut = useCallback(() => {
    animateTo(1);
  }, [animateTo]);

  const adminGradientColors = useMemo(
    () =>
      colors.isDark
        ? ([colors.primary[800], colors.primary[600]] as const)
        : ([colors.primary[700], colors.primary[500]] as const),
    [colors.isDark, colors.primary],
  );

  const gradientContentColor = colors.isDark ? colors.text.primary : colors.text.inverse;

  const themed = useMemo(() => {
    const basePressable = styles.pressable;

    const defaultCardStyle = [
      styles.card,
      {
        backgroundColor: colors.isDark ? colors.background.primary : colors.background.primary,
        borderColor: colors.isDark ? colors.border.light : colors.border.medium,
      },
      colors.isDark ? shadows.lg : shadows.xl,
    ];

    const defaultIconContainerStyle = [
      styles.iconContainer,
      {
        backgroundColor: colors.isDark ? colors.background.tertiary : colors.background.secondary,
        borderColor: colors.isDark ? colors.border.light : colors.border.medium,
      },
    ];

    const defaultBadgeStyle = [
      styles.badge,
      {
        backgroundColor: colors.isDark ? colors.background.tertiary : colors.background.secondary,
        borderColor: colors.isDark ? colors.border.light : colors.border.medium,
      },
    ];

    // Admin y Premium usan los mismos estilos (primary/green)
    const gradientCardStyle = [styles.card, { borderColor: colors.primary[400] }, shadows.lg];

    const gradientIconContainerStyle = [
      styles.iconContainer,
      {
        backgroundColor: colors.background.primary,
        borderColor: colors.primary[300],
      },
    ];

    const gradientBadgeStyle = [
      styles.badge,
      {
        backgroundColor: colors.background.primary,
        borderColor: colors.primary[300],
      },
    ];

    return {
      pressable: basePressable,
      default: {
        card: defaultCardStyle,
        iconContainer: defaultIconContainerStyle,
        badge: defaultBadgeStyle,
      },
      admin: {
        card: gradientCardStyle,
        iconContainer: gradientIconContainerStyle,
        badge: gradientBadgeStyle,
      },
      premium: {
        card: gradientCardStyle,
        iconContainer: gradientIconContainerStyle,
        badge: gradientBadgeStyle,
      },
    };
  }, [colors.background, colors.border, colors.isDark, colors.primary]);

  const renderGradientCard = (
    gradientColors: readonly [string, string],
    themedStyles: typeof themed.admin | typeof themed.premium,
    badgeTextColor: string,
    ctaBorderColor: string,
  ) => (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={themedStyles.card}
    >
      <View style={styles.topRow}>
        <View style={themedStyles.iconContainer}>{icon}</View>

        {badgeText ? (
          <View style={themedStyles.badge}>
            <Text style={[styles.badgeText, { color: badgeTextColor }]}>{badgeText}</Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.title, { color: gradientContentColor }]}>{title}</Text>
      <Text style={[styles.description, { color: gradientContentColor }]}>{description}</Text>

      <View style={[styles.ctaRow, { borderTopColor: ctaBorderColor }]}>
        <Text style={[styles.ctaText, { color: gradientContentColor }]}>Abrir</Text>
      </View>
    </LinearGradient>
  );

  return (
    <Animated.View style={[{ transform: [{ scale }] }]}>
      <Pressable
        testID={testID}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          themed.pressable,
          {
            opacity: pressed ? 0.98 : 1,
          },
        ]}
      >
        {variant === 'admin' ? (
          renderGradientCard(
            adminGradientColors,
            themed.admin,
            colors.primary[700],
            colors.primary[300],
          )
        ) : variant === 'premium' ? (
          renderGradientCard(
            adminGradientColors,
            themed.premium,
            colors.primary[700],
            colors.primary[300],
          )
        ) : (
          <View style={themed.default.card}>
            <View style={styles.topRow}>
              <View style={themed.default.iconContainer}>{icon}</View>

              {badgeText ? (
                <View style={themed.default.badge}>
                  <Text style={[styles.badgeText, { color: colors.text.secondary }]}>
                    {badgeText}
                  </Text>
                </View>
              ) : null}
            </View>

            <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
            <Text style={[styles.description, { color: colors.text.secondary }]}>
              {description}
            </Text>

            <View style={[styles.ctaRow, { borderTopColor: colors.border.light }]}>
              <Text style={[styles.ctaText, { color: colors.primary[600] }]}>Abrir</Text>
            </View>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
});
