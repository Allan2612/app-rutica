import { memo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useThemedColors } from '@/hooks';
import { formSectionStyles as styles } from '@/styles/form-section-styles';

interface ContactSectionProps {
  phone: string;
  email: string;
  website: string;
  onPhoneChange: (text: string) => void;
  onEmailChange: (text: string) => void;
  onWebsiteChange: (text: string) => void;
}

export const ContactSection = memo(function ContactSection({
  phone,
  email,
  website,
  onPhoneChange,
  onEmailChange,
  onWebsiteChange,
}: ContactSectionProps) {
  const colors = useThemedColors();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Información de Contacto
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text.primary }]}>Teléfono</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.medium,
              color: colors.text.primary,
            },
          ]}
          value={phone}
          onChangeText={onPhoneChange}
          placeholder="Ej: 8888-8888"
          placeholderTextColor={colors.text.tertiary}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text.primary }]}>Email</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.medium,
              color: colors.text.primary,
            },
          ]}
          value={email}
          onChangeText={onEmailChange}
          placeholder="Ej: contacto@negocio.com"
          placeholderTextColor={colors.text.tertiary}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text.primary }]}>Sitio Web</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.medium,
              color: colors.text.primary,
            },
          ]}
          value={website}
          onChangeText={onWebsiteChange}
          placeholder="Ej: https://minegocio.com"
          placeholderTextColor={colors.text.tertiary}
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>
    </View>
  );
});
