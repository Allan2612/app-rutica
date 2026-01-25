/**
 * PromotionFormView Component
 * Formulario para crear/editar promociones
 * TODO: Implementar formulario completo
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PromoScope, DiscountType } from '@/types/enums';

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
  // TODO: Implementar formulario con react-hook-form y zod

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.placeholder}>
          {isEditing ? 'Editar Promoción' : 'Nueva Promoción'}
        </Text>
        <Text style={styles.info}>Business ID: {businessId}</Text>
        <Text style={styles.info}>
          TODO: Implementar formulario completo con campos para:
        </Text>
        <Text style={styles.info}>- Título</Text>
        <Text style={styles.info}>- Descripción</Text>
        <Text style={styles.info}>- Tipo de promoción (scope)</Text>
        <Text style={styles.info}>- Tipo y valor de descuento</Text>
        <Text style={styles.info}>- Fechas de inicio y fin</Text>
        <Text style={styles.info}>- Categorías</Text>
        <Text style={styles.info}>- Productos (si aplica)</Text>
        <Text style={styles.info}>- Imágenes</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  placeholder: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});




