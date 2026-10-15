import { memo, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Shield } from 'lucide-react-native';
import { Screen } from '@/components/layout';
import { BaseHeader } from '@/components/layout/Header';
import { BackButton } from '@/components/ui';
import { useThemedColors } from '@/hooks';
import styles from '@/features/user/TermsScreen/styles';
import { PRIVACY_POLICY, PRIVACY_POLICY_VERSION } from './privacyPolicy';

export const PrivacyScreen = memo(function PrivacyScreen() {
  const colors = useThemedColors();

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(auth)/register');
  }, []);

  return (
    <Screen>
      <BaseHeader />
      <ScrollView
        style={[styles.scrollContainer, { backgroundColor: colors.background.secondary }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.centerWrapper}>
          <View style={styles.headerWithBack}>
            <BackButton onPress={handleBack} />
            <View style={styles.headerContent}>
              <Text style={[styles.title, { color: colors.text.primary }]}>
                Política de Privacidad
              </Text>
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                Versión {PRIVACY_POLICY_VERSION}
              </Text>
            </View>
          </View>

          {PRIVACY_POLICY.map((section) => (
            <View key={section.title} style={styles.section}>
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.background.primary, borderColor: colors.border.light },
                ]}
              >
                <View style={styles.sectionHeader}>
                  <Shield color={colors.primary[500]} size={20} />
                  <Text
                    style={[styles.sectionTitle, { color: colors.text.primary }]}
                    accessibilityRole="header"
                  >
                    {section.title}
                  </Text>
                </View>
                {section.paragraphs.map((p) => (
                  <Text key={p} style={[styles.paragraph, { color: colors.text.secondary }]}>
                    {p}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
});

export default PrivacyScreen;
