/**
 * PromotionFormView Component
 * Formulario para crear/editar promociones
 * TODO: Implementar formulario completo
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useThemedColors } from '@/hooks';
import { PromoScope, DiscountType } from '@/types/enums';
import { styles } from './styles';

export interface PromotionFormData {
  title: string;
  description: string;
  scope: PromoScope;
  discountType: DiscountType;
  discountValue: number;
  startAt: string;
  endAt: string;
  categoryIds: string[];
  productIds: string[];
  coverUri: string | null;
  galleryUris: string[];
}

interface PromotionFormViewProps {
  initialData?: Partial<PromotionFormData>;
  businessId: string;
  isEditing?: boolean;
  onSubmit?: (data: PromotionFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function PromotionFormView({
  initialData,
  businessId,
  isEditing = false,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: PromotionFormViewProps) {
  const colors = useThemedColors();

  // TODO: Implementar formulario con react-hook-form y zod

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.content}>
        <Text style={[styles.placeholder, { color: colors.text.primary }]}>
          {isEditing ? 'Editar Promoción' : 'Nueva Promoción'}
        </Text>
        <Text style={[styles.info, { color: colors.text.secondary }]}>Business ID: {businessId}</Text>
        <Text style={[styles.info, { color: colors.text.secondary }]}>
          TODO: Implementar formulario completo con campos para:
        </Text>
        <Text style={[styles.info, { color: colors.text.secondary }]}>- Título</Text>
        <Text style={[styles.info, { color: colors.text.secondary }]}>- Descripción</Text>
        <Text style={[styles.info, { color: colors.text.secondary }]}>- Tipo de promoción (scope)</Text>
        <Text style={[styles.info, { color: colors.text.secondary }]}>- Tipo y valor de descuento</Text>
        <Text style={[styles.info, { color: colors.text.secondary }]}>- Fechas de inicio y fin</Text>
        <Text style={[styles.info, { color: colors.text.secondary }]}>- Categorías</Text>
        <Text style={[styles.info, { color: colors.text.secondary }]}>- Productos (si aplica)</Text>
        <Text style={[styles.info, { color: colors.text.secondary }]}>- Imágenes</Text>
      </View>
    </ScrollView>
  );
}




