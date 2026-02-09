import { memo, useMemo } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { Building2, Calendar, Tag } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useUserBusinesses } from '@/features/business/hooks';
import { PromoBadge } from '@/components/ui';
import { getPromotionBadgeLabel } from '@/utils';
import type { PromotionWizardFormData } from '@/types/entities';
import { styles } from './styles';

interface PromotionPreviewCardProps {
  formData: PromotionWizardFormData;
  compact?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const PromotionPreviewCard = memo(function PromotionPreviewCard({
  formData,
  compact = false,
}: PromotionPreviewCardProps) {
  const colors = useThemedColors();
  const { data: businesses = [] } = useUserBusinesses();

  // Get selected business name
  const businessName = useMemo(() => {
    const business = businesses.find((b: any) => b.id === formData.businessId);
    return business?.name || 'Sin negocio';
  }, [businesses, formData.businessId]);

  // Format dates
  const dateRange = useMemo(() => {
    const formatDate = (date: Date) =>
      date.toLocaleDateString('es-CR', {
        day: 'numeric',
        month: 'short',
      });

    return `${formatDate(formData.startDate)} - ${formatDate(formData.endDate)}`;
  }, [formData.startDate, formData.endDate]);

  // Obtener label del badge usando el helper
  const badgeLabel = useMemo(() => {
    return getPromotionBadgeLabel({
      scope: formData.scope,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      comboItems: formData.comboItems,
    } as any);
  }, [formData.scope, formData.discountType, formData.discountValue, formData.comboItems]);

  if (compact) {
    return (
      <View
        style={[
          styles.compactCard,
          {
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.light,
          },
        ]}
      >
        {/* Mini Preview */}
        <View style={styles.compactImageContainer}>
          {formData.coverUri ? (
            <Image source={{ uri: formData.coverUri }} style={styles.compactImage} />
          ) : (
            <View
              style={[styles.compactPlaceholder, { backgroundColor: colors.background.tertiary }]}
            >
              <Tag size={20} color={colors.text.tertiary} />
            </View>
          )}
          {/* Badge */}
          <View style={styles.badgeContainer}>
            <PromoBadge label={badgeLabel} size="small" />
          </View>
        </View>

        <View style={styles.compactInfo}>
          <Text style={[styles.compactTitle, { color: colors.text.primary }]} numberOfLines={1}>
            {formData.title || 'Título de la promoción'}
          </Text>
          <Text
            style={[styles.compactBusiness, { color: colors.text.secondary }]}
            numberOfLines={1}
          >
            {businessName}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.light,
        },
      ]}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {formData.coverUri ? (
          <Image source={{ uri: formData.coverUri }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.background.tertiary }]}>
            <Tag size={32} color={colors.text.tertiary} />
            <Text style={[styles.placeholderText, { color: colors.text.tertiary }]}>
              Vista previa de imagen
            </Text>
          </View>
        )}

        {/* Badge */}
        <View style={styles.badgeContainer}>
          <PromoBadge label={badgeLabel} size="medium" />
        </View>

        {/* Scope Badge */}
        <View style={[styles.scopeBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
          <Text style={styles.scopeText}>
            {formData.scope === 'all'
              ? 'Todo el negocio'
              : formData.scope === 'products'
                ? `${formData.selectedProductIds.length} producto(s)`
                : formData.scope === 'categories'
                  ? `${formData.scopeCategoryIds.length} categoría(s)`
                  : `Combo (${formData.comboItems.length} productos)`}
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={2}>
          {formData.title || 'Título de la promoción'}
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: colors.text.secondary }]} numberOfLines={2}>
          {formData.description || 'Descripción de la promoción...'}
        </Text>

        {/* Meta Info */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Building2 size={14} color={colors.text.tertiary} />
            <Text style={[styles.metaText, { color: colors.text.secondary }]} numberOfLines={1}>
              {businessName}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Calendar size={14} color={colors.text.tertiary} />
            <Text style={[styles.metaText, { color: colors.text.secondary }]}>{dateRange}</Text>
          </View>
        </View>

        {/* Categories */}
        {formData.selectedCategoryIds.length > 0 && (
          <View style={styles.categoriesRow}>
            <Tag size={12} color={colors.text.tertiary} />
            <Text style={[styles.categoriesText, { color: colors.text.tertiary }]}>
              {formData.selectedCategoryIds.length} categoría(s)
            </Text>
          </View>
        )}
      </View>

      {/* Preview Label */}
      <View style={[styles.previewLabel, { backgroundColor: colors.background.tertiary }]}>
        <Text style={[styles.previewLabelText, { color: colors.text.tertiary }]}>VISTA PREVIA</Text>
      </View>
    </View>
  );
});
