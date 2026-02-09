import { memo, useCallback } from 'react';
import { View, Text, ScrollView, Linking, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Shield, FileText, Users, Eye, AlertTriangle, Scale, Mail } from 'lucide-react-native';
import { Screen } from '@/components/layout';
import { BaseHeader } from '@/components/layout/Header';
import { BackButton } from '@/components/ui';
import { useThemedColors } from '@/hooks';
import styles from './styles';

const LAST_UPDATED = '8 de febrero de 2026';

export const TermsScreen = memo(function TermsScreen() {
  const colors = useThemedColors();

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleContact = useCallback(() => {
    Linking.openURL('mailto:rutica.app@gmail.com');
  }, []);

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
              <Text style={[styles.title, { color: colors.text.primary }]}>
                Términos y Condiciones
              </Text>
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                Última actualización: {LAST_UPDATED}
              </Text>
            </View>
          </View>

          {/* Introducción */}
          <View style={styles.section}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.light,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <FileText color={colors.primary[500]} size={20} />
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  1. Introducción
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                Bienvenido a Rutica. Al acceder y utilizar nuestra aplicación móvil y plataforma
                web, usted acepta estar sujeto a los presentes Términos y Condiciones de uso. Le
                recomendamos leerlos detenidamente antes de utilizar nuestros servicios.
              </Text>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                Rutica es una plataforma digital que permite a los usuarios explorar y descubrir
                negocios, eventos y atracciones turísticas en Costa Rica. Si no está de acuerdo con
                estos términos, le solicitamos abstenerse de utilizar la aplicación.
              </Text>
            </View>
          </View>

          {/* Uso de la plataforma */}
          <View style={styles.section}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.light,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Users color={colors.primary[500]} size={20} />
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  2. Uso de la Plataforma
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                Al utilizar Rutica, usted se compromete a:
              </Text>
              <View style={styles.bulletList}>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • Proporcionar información veraz y actualizada al registrarse.
                </Text>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • No utilizar la plataforma para fines ilegales o no autorizados.
                </Text>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • No intentar acceder a cuentas de otros usuarios sin autorización.
                </Text>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • No publicar contenido ofensivo, difamatorio, obsceno o que infrinja derechos de
                  terceros.
                </Text>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • No manipular calificaciones o reseñas de manera fraudulenta.
                </Text>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • Mantener la confidencialidad de sus credenciales de acceso.
                </Text>
              </View>
            </View>
          </View>

          {/* Cuentas de usuario */}
          <View style={styles.section}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.light,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Shield color={colors.primary[500]} size={20} />
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  3. Cuentas de Usuario
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                Para acceder a ciertas funcionalidades de Rutica, es necesario crear una cuenta
                proporcionando un correo electrónico válido y una contraseña segura. Usted es
                responsable de toda la actividad que ocurra bajo su cuenta.
              </Text>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                Rutica se reserva el derecho de suspender o eliminar cuentas que violen estos
                términos, que permanezcan inactivas por un período prolongado, o que se utilicen de
                forma fraudulenta.
              </Text>
            </View>
          </View>

          {/* Contenido del usuario */}
          <View style={styles.section}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.light,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Eye color={colors.primary[500]} size={20} />
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  4. Contenido Generado por el Usuario
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                Los usuarios pueden publicar reseñas, calificaciones, imágenes y registrar negocios,
                eventos y atracciones. Al publicar contenido, usted:
              </Text>
              <View style={styles.bulletList}>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • Otorga a Rutica una licencia no exclusiva para mostrar, distribuir y utilizar
                  dicho contenido dentro de la plataforma.
                </Text>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • Declara que es el propietario del contenido o tiene autorización para
                  publicarlo.
                </Text>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • Acepta que el contenido puede ser revisado y moderado por nuestro equipo.
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                Rutica se reserva el derecho de eliminar cualquier contenido que se considere
                inapropiado, falso o que viole estos términos sin previo aviso.
              </Text>
            </View>
          </View>

          {/* Propiedad intelectual */}
          <View style={styles.section}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.light,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Scale color={colors.primary[500]} size={20} />
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  5. Propiedad Intelectual
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                Todos los derechos de propiedad intelectual de la aplicación Rutica, incluyendo pero
                no limitado a su diseño, código fuente, logotipos, marcas, gráficos e interfaces,
                son propiedad exclusiva de Rutica o sus licenciantes.
              </Text>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                Queda prohibida la reproducción, distribución, modificación o uso comercial de
                cualquier elemento de la plataforma sin autorización expresa por escrito.
              </Text>
            </View>
          </View>

          {/* Privacidad */}
          <View style={styles.section}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.light,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Eye color={colors.primary[500]} size={20} />
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  6. Privacidad y Datos Personales
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                Rutica recopila y procesa datos personales necesarios para el funcionamiento de la
                plataforma, tales como nombre, correo electrónico y ubicación. Nos comprometemos a:
              </Text>
              <View style={styles.bulletList}>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • No vender ni compartir sus datos personales con terceros para fines comerciales.
                </Text>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • Utilizar la información de ubicación únicamente para mejorar su experiencia
                  dentro de la app.
                </Text>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • Almacenar sus datos de forma segura utilizando tecnologías de encriptación.
                </Text>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • Permitirle solicitar la eliminación de su cuenta y datos asociados en cualquier
                  momento.
                </Text>
              </View>
            </View>
          </View>

          {/* Limitación de responsabilidad */}
          <View style={styles.section}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.light,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <AlertTriangle color={colors.primary[500]} size={20} />
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  7. Limitación de Responsabilidad
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                Rutica actúa como una plataforma de información y descubrimiento. No somos
                responsables de:
              </Text>
              <View style={styles.bulletList}>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • La veracidad del contenido publicado por negocios o usuarios.
                </Text>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • La calidad de los servicios o productos ofrecidos por los negocios registrados.
                </Text>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • Daños directos o indirectos derivados del uso de la plataforma.
                </Text>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • Interrupciones temporales del servicio por mantenimiento o causas ajenas a
                  nuestro control.
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                La plataforma se proporciona "tal cual" sin garantías de ningún tipo, ya sean
                expresas o implícitas.
              </Text>
            </View>
          </View>

          {/* Modificaciones */}
          <View style={styles.section}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.light,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <FileText color={colors.primary[500]} size={20} />
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  8. Modificaciones a los Términos
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                Rutica se reserva el derecho de modificar estos Términos y Condiciones en cualquier
                momento. Las modificaciones entrarán en vigor desde su publicación en la aplicación.
                El uso continuado de la plataforma después de cualquier cambio constituye la
                aceptación de los nuevos términos.
              </Text>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                Se notificará a los usuarios sobre cambios significativos a través de la aplicación
                o por correo electrónico.
              </Text>
            </View>
          </View>

          {/* Legislación aplicable */}
          <View style={styles.section}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.light,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Scale color={colors.primary[500]} size={20} />
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  9. Legislación Aplicable
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                Estos términos se rigen por las leyes de la República de Costa Rica. Cualquier
                disputa será sometida a la jurisdicción de los tribunales competentes de Costa Rica.
              </Text>
            </View>
          </View>

          {/* Contacto */}
          <View style={styles.section}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.light,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Mail color={colors.primary[500]} size={20} />
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  10. Contacto
                </Text>
              </View>
              <Text style={[styles.paragraph, { color: colors.text.secondary }]}>
                Si tiene preguntas, comentarios o inquietudes sobre estos Términos y Condiciones,
                puede contactarnos a través de:
              </Text>
              <View style={styles.bulletList}>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • Correo electrónico: rutica.app@gmail.com
                </Text>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • Teléfono: +506 8450-1389
                </Text>
                <Text style={[styles.bulletItem, { color: colors.text.secondary }]}>
                  • Teléfono: +506 8707-7994
                </Text>
              </View>

              <Pressable
                style={[styles.contactButton, { borderColor: colors.primary[500] }]}
                onPress={handleContact}
              >
                <Mail color={colors.primary[500]} size={16} />
                <Text style={[styles.contactButtonText, { color: colors.primary[500] }]}>
                  Enviar correo
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Spacing final */}
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </Screen>
  );
});

export default TermsScreen;
