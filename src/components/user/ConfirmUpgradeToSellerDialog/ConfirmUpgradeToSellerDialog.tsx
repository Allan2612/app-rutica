import { memo } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Store, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface ConfirmUpgradeToSellerDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isUpgrading?: boolean;
}

export const ConfirmUpgradeToSellerDialog = memo(function ConfirmUpgradeToSellerDialog({
  visible,
  onConfirm,
  onCancel,
  isUpgrading = false,
}: ConfirmUpgradeToSellerDialogProps) {
  const colors = useThemedColors();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: colors.background.primary }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconWrapper, { backgroundColor: colors.primary[500] + '20' }]}>
              <Store color={colors.primary[500]} size={28} strokeWidth={2} />
            </View>
            <Pressable style={styles.closeButton} onPress={onCancel} disabled={isUpgrading}>
              <X color={colors.text.tertiary} size={24} />
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Convertirse en Vendedor
            </Text>
            <Text style={[styles.description, { color: colors.text.secondary }]}>
              Al convertirte en vendedor, podrás acceder a funcionalidades adicionales para
              gestionar tu negocio.
            </Text>

            <View
              style={[
                styles.benefitsBox,
                {
                  backgroundColor: colors.primary[500] + '10',
                  borderColor: colors.primary[500] + '30',
                },
              ]}
            >
              <Text style={[styles.benefitsTitle, { color: colors.primary[500] }]}>
                Beneficios de ser vendedor:
              </Text>
              <View style={styles.benefitsList}>
                <Text style={[styles.benefitItem, { color: colors.text.primary }]}>
                  • Crear y gestionar negocios
                </Text>
                <Text style={[styles.benefitItem, { color: colors.text.primary }]}>
                  • Publicar promociones
                </Text>
                <Text style={[styles.benefitItem, { color: colors.text.primary }]}>
                  • Administrar productos
                </Text>
                <Text style={[styles.benefitItem, { color: colors.text.primary }]}>
                  • Acceso a herramientas premium
                </Text>
              </View>
            </View>

            <Text style={[styles.note, { color: colors.text.tertiary }]}>
              Este cambio es permanente y no podrás volver a ser comprador.
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                {
                  backgroundColor: colors.background.tertiary,
                  opacity: pressed || isUpgrading ? 0.5 : 1,
                },
              ]}
              onPress={onCancel}
              disabled={isUpgrading}
            >
              <Text style={[styles.buttonText, { color: colors.text.primary }]}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                {
                  backgroundColor: colors.primary[500],
                  opacity: pressed || isUpgrading ? 0.7 : 1,
                },
              ]}
              onPress={onConfirm}
              disabled={isUpgrading}
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>
                {isUpgrading ? 'Actualizando...' : 'Sí, convertir'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
});
