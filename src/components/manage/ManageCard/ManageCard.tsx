import { memo, useCallback, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedColors } from '@/hooks';
import { shadows } from '@/styles/theme';
import styles from './styles';

export type ManageCardVariant = 'default' | 'admin';

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
    [scale]
  );

  const handlePressIn = useCallback(() => {
    animateTo(0.97);
  }, [animateTo]);

  const handlePressOut = useCallback(() => {
    animateTo(1);
  }, [animateTo]);

  const gradientColors = useMemo(
    () =>
      colors.isDark
        ? ([colors.primary[800], colors.primary[600]] as const)
        : ([colors.primary[700], colors.primary[500]] as const),
    [colors.isDark, colors.primary]
  );

  const adminContentColor = colors.isDark ? colors.text.primary : colors.text.inverse;

  const themed = useMemo(() => {
    const basePressable = styles.pressable;

    const defaultCardStyle = [
      styles.card,
      {
        backgroundColor: colors.isDark
          ? colors.background.secondary
          : colors.background.primary,
        borderColor: colors.isDark ? colors.border.light : colors.border.medium,
      },
      colors.isDark ? shadows.lg : shadows.xl,
    ];

    const defaultIconContainerStyle = [
      styles.iconContainer,
      {
        backgroundColor: colors.isDark
          ? colors.background.tertiary
          : colors.background.secondary,
        borderColor: colors.isDark ? colors.border.light : colors.border.medium,
      },
    ];

    const defaultBadgeStyle = [
      styles.badge,
      {
        backgroundColor: colors.isDark
          ? colors.background.tertiary
          : colors.background.secondary,
        borderColor: colors.isDark ? colors.border.light : colors.border.medium,
      },
    ];

    const adminCardStyle = [
      styles.card,
      { borderColor: colors.primary[400] },
      shadows.lg,
    ];

    const adminIconContainerStyle = [
      styles.iconContainer,
      {
        backgroundColor: colors.background.primary,
        borderColor: colors.primary[300],
      },
    ];

    const adminBadgeStyle = [
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
        card: adminCardStyle,
        iconContainer: adminIconContainerStyle,
        badge: adminBadgeStyle,
      },
    };
  }, [colors.background, colors.border, colors.isDark, colors.primary]);

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
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={themed.admin.card}
          >
            <View style={styles.topRow}>
              <View
                style={themed.admin.iconContainer}
              >
                {icon}
              </View>

              {badgeText ? (
                <View
                  style={themed.admin.badge}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: colors.primary[700] },
                    ]}
                  >
                    {badgeText}
                  </Text>
                </View>
              ) : null}
            </View>

            <Text style={[styles.title, { color: adminContentColor }]}>{title}</Text>
            <Text style={[styles.description, { color: adminContentColor }]}>
              {description}
            </Text>

            <View style={[styles.ctaRow, { borderTopColor: colors.primary[300] }]}>
              <Text style={[styles.ctaText, { color: adminContentColor }]}>Abrir</Text>
            </View>
          </LinearGradient>
        ) : (
          <View
            style={themed.default.card}
          >
            <View style={styles.topRow}>
              <View
                style={themed.default.iconContainer}
              >
                {icon}
              </View>

              {badgeText ? (
                <View
                  style={themed.default.badge}
                >
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
