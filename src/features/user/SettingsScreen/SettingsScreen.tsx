import { memo, useCallback } from 'react';
import { View, Text, ScrollView, Switch, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Moon, Sun, Bell, Globe, Info } from 'lucide-react-native';
import { Screen } from '@/components/layout';
import { BaseHeader } from '@/components/layout/Header';
import { BackButton } from '@/components/ui';
import { useThemeStore } from '@/store';
import { useThemedColors } from '@/hooks';
import styles from './styles';

export const SettingsScreen = memo(function SettingsScreen() {
  const colors = useThemedColors();
  const { mode, setMode } = useThemeStore();
  const isDark = mode === 'dark';

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleToggleTheme = useCallback(() => {
    setMode(isDark ? 'light' : 'dark');
  }, [isDark, setMode]);

  return (
    <Screen>
      <BaseHeader />
      <ScrollView
        style={[styles.scrollContainer, { backgroundColor: colors.background.secondary }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.centerWrapper}>
          {/* Header con botón de retroceso */}
          <View style={styles.headerWithBack}>
            <BackButton href="/(app)/(tabs)/home" />
            <View style={styles.headerContent}>
              <Text style={[styles.title, { color: colors.text.primary }]}>
                Configuración
              </Text>
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                Personaliza tu experiencia
              </Text>
            </View>
          </View>

          {/* Apariencia */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.tertiary }]}>
              Apariencia
            </Text>
            <View style={[styles.card, {
              backgroundColor: colors.background.primary,
              borderColor: colors.border.light,
            }]}>
              <View style={styles.settingRow}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  {isDark ? (
                    <Moon color={colors.text.primary} size={20} />
                  ) : (
                    <Sun color={colors.text.primary} size={20} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                      Tema Oscuro
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      {isDark ? 'Modo oscuro activado' : 'Modo claro activado'}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={handleToggleTheme}
                  trackColor={{ false: colors.border.medium, true: colors.primary[500] }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </View>

          {/* Notificaciones */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.tertiary }]}>
              Notificaciones
            </Text>
            <View style={[styles.card, {
              backgroundColor: colors.background.primary,
              borderColor: colors.border.light,
            }]}>
              <View style={styles.settingRow}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Bell color={colors.text.primary} size={20} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                      Notificaciones Push
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      Recibir notificaciones de la app
                    </Text>
                  </View>
                </View>
                <Switch
                  value={false}
                  onValueChange={() => { }}
                  trackColor={{ false: colors.border.medium, true: colors.primary[500] }}
                  thumbColor="#ffffff"
                  disabled
                />
              </View>
            </View>
          </View>

          {/* General */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.tertiary }]}>
              General
            </Text>
            <View style={[styles.card, {
              backgroundColor: colors.background.primary,
              borderColor: colors.border.light,
            }]}>
              <Pressable style={styles.settingRow}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Globe color={colors.text.primary} size={20} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                      Idioma
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      Español
                    </Text>
                  </View>
                </View>
              </Pressable>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              <Pressable style={styles.settingRow}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Info color={colors.text.primary} size={20} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                      Acerca de
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      Versión 1.0.0
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
});

export default SettingsScreen;
