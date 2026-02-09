import { memo, useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { Edit3, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useUpdateProductAsAdmin } from '@/features/admin/hooks/useAdminProducts';
import type { AdminProductListItem } from '@/types/entities/product';
import { ActiveToggle } from '@/components/admin/common';
import Toast from 'react-native-toast-message';
import { styles } from './styles';

export interface EditProductDialogProps {
  visible: boolean;
  product: AdminProductListItem;
  onClose: () => void;
}

export const EditProductDialog = memo(function EditProductDialog({
  visible,
  product,
  onClose,
}: EditProductDialogProps) {
  const colors = useThemedColors();
  const updateProduct = useUpdateProductAsAdmin();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(product.price.toString());
  const [isActive, setIsActive] = useState(product.isActive);

  // Reset values when dialog opens
  useEffect(() => {
    if (visible) {
      setName(product.name);
      setDescription(product.description || '');
      setPrice(product.price.toString());
      setIsActive(product.isActive);
    }
  }, [visible, product]);

  const handleConfirm = async () => {
    if (!name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'El nombre del producto es requerido',
        position: 'top',
      });
      return;
    }

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'El precio debe ser un número válido',
        position: 'top',
      });
      return;
    }

    try {
      await updateProduct.mutateAsync({
        productId: product.id,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          price: priceNumber,
          isActive: isActive,
        },
      });

      Toast.show({
        type: 'success',
        text1: 'Producto actualizado',
        text2: 'El producto ha sido actualizado correctamente',
        position: 'top',
      });

      onClose();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo actualizar el producto',
        position: 'top',
      });
    }
  };

  const handleCancel = () => {
    if (!updateProduct.isPending) {
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: colors.background.primary }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
            <Edit3 size={24} color={colors.primary[500]} />
            <Text style={[styles.title, { color: colors.text.primary }]}>Editar producto</Text>
            {!updateProduct.isPending && (
              <Pressable
                onPress={handleCancel}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <X size={24} color={colors.text.tertiary} />
              </Pressable>
            )}
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Content */}
            <View style={styles.content}>
              <View style={[styles.infoBox, { backgroundColor: colors.background.secondary }]}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Negocio:</Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                  {product.businessName}
                </Text>
              </View>

              {/* Name */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                  Nombre del producto *
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Nombre del producto"
                  placeholderTextColor={colors.text.tertiary}
                  editable={!updateProduct.isPending}
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background.secondary,
                      color: colors.text.primary,
                      borderColor: colors.border.medium,
                    },
                  ]}
                />
              </View>

              {/* Price */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                  Precio ({product.currency}) *
                </Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="decimal-pad"
                  editable={!updateProduct.isPending}
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background.secondary,
                      color: colors.text.primary,
                      borderColor: colors.border.medium,
                    },
                  ]}
                />
              </View>

              {/* Description */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: colors.text.primary }]}>Descripción</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Descripción del producto"
                  placeholderTextColor={colors.text.tertiary}
                  multiline
                  numberOfLines={4}
                  editable={!updateProduct.isPending}
                  style={[
                    styles.input,
                    styles.textArea,
                    {
                      backgroundColor: colors.background.secondary,
                      color: colors.text.primary,
                      borderColor: colors.border.medium,
                    },
                  ]}
                />
              </View>

              {/* Estado */}
              <View
                style={[
                  styles.field,
                  { backgroundColor: colors.background.secondary, padding: 12, borderRadius: 8 },
                ]}
              >
                <ActiveToggle
                  isActive={isActive}
                  onToggle={setIsActive}
                  disabled={updateProduct.isPending}
                />
              </View>

              <Text style={[styles.note, { color: colors.text.secondary }]}>
                * Campos requeridos
              </Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={[styles.actions, { borderTopColor: colors.border.light }]}>
            <Pressable
              onPress={handleCancel}
              disabled={updateProduct.isPending}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                {
                  backgroundColor: colors.background.tertiary,
                  opacity: pressed || updateProduct.isPending ? 0.7 : 1,
                },
              ]}
            >
              <Text style={[styles.buttonText, { color: colors.text.primary }]}>Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={handleConfirm}
              disabled={updateProduct.isPending}
              style={({ pressed }) => [
                styles.button,
                styles.saveButton,
                {
                  backgroundColor: colors.primary[500],
                  opacity: pressed || updateProduct.isPending ? 0.8 : 1,
                },
              ]}
            >
              {updateProduct.isPending ? (
                <ActivityIndicator size="small" color={colors.text.inverse} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.text.inverse }]}>Guardar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
});
