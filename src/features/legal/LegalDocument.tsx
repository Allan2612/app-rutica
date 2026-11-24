import { memo, type ReactNode } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Shield } from 'lucide-react-native';
import { Screen } from '@/components/layout';
import { BaseHeader } from '@/components/layout/Header';
import { BackButton } from '@/components/ui';
import { useThemedColors } from '@/hooks';
import styles from '@/features/user/TermsScreen/styles';
import type { LegalSection } from './privacyPolicy';

interface LegalDocumentProps {
  title: string;
  subtitle: string;
  sections: LegalSection[];
  onBack: () => void;
  /** Contenido extra al final (p. ej. botón de contacto) */
  footer?: ReactNode;
}

/** Pantalla de documento legal (Términos, Privacidad) a partir de secciones de texto. */
export const LegalDocument = memo(function LegalDocument({
  title,
  subtitle,
  sections,
  onBack,
  footer,
}: LegalDocumentProps) {
  const colors = useThemedColors();

  return (
    <Screen>
      <BaseHeader />
      <ScrollView
        style={[styles.scrollContainer, { backgroundColor: colors.background.secondary }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.centerWrapper}>
          <View style={styles.headerWithBack}>
            <BackButton onPress={onBack} />
            <View style={styles.headerContent}>
              <Text
                style={[styles.title, { color: colors.text.primary }]}
                accessibilityRole="header"
              >
                {title}
              </Text>
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>{subtitle}</Text>
            </View>
          </View>

          {sections.map((section) => (
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

          {footer}
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </Screen>
  );
});
