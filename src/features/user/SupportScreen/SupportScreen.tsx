import { memo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { router } from 'expo-router';
import { Mail, Phone, MessageCircle, HelpCircle } from 'lucide-react-native';
import { Screen } from '@/components/layout';
import { BaseHeader } from '@/components/layout/Header';
import { BackButton } from '@/components/ui';
import { useThemedColors } from '@/hooks';
import styles from './styles';

export const SupportScreen = memo(function SupportScreen() {
  const colors = useThemedColors();

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleEmail = useCallback(() => {
    Linking.openURL('mailto:rutica.app@gmail.com');
  }, []);

  const handlePhone = useCallback(
    (phone: string) => () => {
      Linking.openURL(`tel:${phone}`);
    },
    [],
  );

  const handleWhatsApp = useCallback(
    (phoneNumber: string) => () => {
      // Formato: https://wa.me/PHONENUMBER?text=MESSAGE
      // Número sin espacios ni caracteres especiales
      const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
      const message = encodeURIComponent('Hola, necesito ayuda con Rutica');
      Linking.openURL(`https://wa.me/${cleanPhone}?text=${message}`);
    },
    [],
  );

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
            <BackButton onPress={handleBack} />
            <View style={styles.headerContent}>
              <Text style={[styles.title, { color: colors.text.primary }]}>Soporte</Text>
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                Estamos aquí para ayudarte
              </Text>
            </View>
          </View>

          {/* Contacto */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.tertiary }]}>Contacto</Text>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.light,
                },
              ]}
            >
              <Pressable style={styles.contactItem} onPress={handleEmail}>
                <Mail color={colors.primary[500]} size={20} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.contactLabel, { color: colors.text.tertiary }]}>
                    Correo electrónico
                  </Text>
                  <Text style={[styles.contactValue, { color: colors.text.primary }]}>
                    rutica.app@gmail.com
                  </Text>
                </View>
              </Pressable>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              <Pressable style={styles.contactItem} onPress={handlePhone('+50684501389')}>
                <Phone color={colors.primary[500]} size={20} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.contactLabel, { color: colors.text.tertiary }]}>
                    Teléfono 1
                  </Text>
                  <Text style={[styles.contactValue, { color: colors.text.primary }]}>
                    +506 8450-1389
                  </Text>
                </View>
              </Pressable>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              <Pressable style={styles.contactItem} onPress={handlePhone('+50687077994')}>
                <Phone color={colors.primary[500]} size={20} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.contactLabel, { color: colors.text.tertiary }]}>
                    Teléfono 2
                  </Text>
                  <Text style={[styles.contactValue, { color: colors.text.primary }]}>
                    +506 8707-7994
                  </Text>
                </View>
              </Pressable>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              <Pressable style={styles.contactItem} onPress={handleWhatsApp('+50684501389')}>
                <MessageCircle color={colors.primary[500]} size={20} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.contactLabel, { color: colors.text.tertiary }]}>
                    WhatsApp 1
                  </Text>
                  <Text style={[styles.contactValue, { color: colors.text.primary }]}>
                    +506 8450-1389
                  </Text>
                </View>
              </Pressable>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              <Pressable style={styles.contactItem} onPress={handleWhatsApp('+50687077994')}>
                <MessageCircle color={colors.primary[500]} size={20} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.contactLabel, { color: colors.text.tertiary }]}>
                    WhatsApp 2
                  </Text>
                  <Text style={[styles.contactValue, { color: colors.text.primary }]}>
                    +506 8707-7994
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* Preguntas Frecuentes */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.tertiary }]}>
              Preguntas Frecuentes
            </Text>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.light,
                },
              ]}
            >
              <View style={styles.faqItem}>
                <Text style={[styles.faqQuestion, { color: colors.text.primary }]}>
                  ¿Cómo puedo crear una cuenta?
                </Text>
                <Text style={[styles.faqAnswer, { color: colors.text.secondary }]}>
                  Puedes registrarte desde la pantalla de inicio tocando el botón "Registrarse" y
                  completando el formulario con tus datos.
                </Text>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              <View style={styles.faqItem}>
                <Text style={[styles.faqQuestion, { color: colors.text.primary }]}>
                  ¿Cómo cambio mi contraseña?
                </Text>
                <Text style={[styles.faqAnswer, { color: colors.text.secondary }]}>
                  Ve a tu perfil, selecciona "Configuración" y encontrarás la opción para cambiar tu
                  contraseña.
                </Text>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              <View style={styles.faqItem}>
                <Text style={[styles.faqQuestion, { color: colors.text.primary }]}>
                  ¿Cómo reporto un problema?
                </Text>
                <Text style={[styles.faqAnswer, { color: colors.text.secondary }]}>
                  Puedes contactarnos directamente por correo o teléfono. Nuestro equipo te
                  responderá en menos de 24 horas.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
});

export default SupportScreen;
