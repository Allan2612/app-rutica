// ============================================
// Promotion Detail View Component
// ============================================

import { memo } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import {
  MapPin,
  User,
  Calendar,
  Tag as TagIcon,
  Store,
  Clock,
  TrendingDown,
  Package,
  ShoppingBag,
} from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { StatusBadge } from '@/components/ui';
import {
  InfoCard,
  CategoryChips,
  DateRangeDisplay,
  ImageGallery,
  ModerationNote,
  ActiveToggle,
} from '../../common';
import { formatDateAdmin } from '@/features/admin/services/helpers';
import { SCOPE_LABELS } from '@/features/admin/types';
import { styles } from './styles';
import type { PromotionVerificationRequest } from '@/features/admin/types';

interface PromotionDetailViewProps {
  request: PromotionVerificationRequest;
  onToggleActive?: (isActive: boolean) => void;
  isProcessing?: boolean;
}

export const PromotionDetailView = memo(function PromotionDetailView({
  request,
  onToggleActive,
  isProcessing = false,
}: PromotionDetailViewProps) {
  const colors = useThemedColors();
  const { metadata } = request;

  // Format discount display
  const discountDisplay = metadata.discountType === 'percentage'
    ? `${metadata.discountValue}%`
    : `₡${metadata.discountValue.toLocaleString('es-CR')}`;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      nestedScrollEnabled={true}
      bounces={true}
      scrollEnabled={true}
      scrollEventThrottle={16}
      overScrollMode="always"
      alwaysBounceVertical={true}
    >
      {/* Main Image */}
      {request.imageUrl ? (
        <Image
          source={{ uri: request.imageUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.background.tertiary }]}>
          <TagIcon size={48} color={colors.text.tertiary} />
          <Text style={[styles.placeholderText, { color: colors.text.tertiary }]}>
            Sin imagen
          </Text>
        </View>
      )}

      {/* Name */}
      <Text style={[styles.entityName, { color: colors.text.primary }]}>
        {request.name}
      </Text>

      {/* Description */}
      {request.description && (
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          {request.description}
        </Text>
      )}

      {/* Status Row */}
      <View style={styles.statusRow}>
        <StatusBadge status={request.moderationStatus} size="md" />
        <View style={[
          styles.activeIndicator,
          { backgroundColor: request.isActive ? colors.success : colors.error }
        ]}>
          <Text style={styles.activeIndicatorText}>
            {request.isActive ? 'Visible' : 'Oculto'}
          </Text>
        </View>
      </View>

      {/* Active Toggle */}
      {onToggleActive && (
        <View style={[styles.toggleWrapper, { backgroundColor: colors.background.secondary }]}>
          <ActiveToggle
            isActive={request.isActive}
            onToggle={onToggleActive}
            disabled={isProcessing}
          />
        </View>
      )}

      {/* Associated Business */}
      <InfoCard
        icon={<Store size={18} color={colors.primary[500]} />}
        title="Negocio Asociado"
        value={metadata.businessName || 'No especificado'}
      />

      {/* Validity Period */}
      <InfoCard
        icon={<Clock size={18} color={colors.warning} />}
        title="Período de Validez"
      >
        <DateRangeDisplay startAt={metadata.startAt} endAt={metadata.endAt} />
      </InfoCard>
      {/* Scope */}
      <InfoCard
        icon={<TagIcon size={18} color={colors.primary[500]} />}
        title="Alcance de la Promoción"
        value={metadata.scope ? SCOPE_LABELS[metadata.scope] : 'No especificado'}
      />
      {/* Discount Info - hide for combo */}
      {metadata.scope !== 'combo' && (
        <InfoCard
          icon={<TrendingDown size={18} color={colors.success} />}
          title="Descuento"
        >
          <View style={styles.discountRow}>
            <Text style={[styles.discountValue, { color: colors.success }]}>
              {discountDisplay}
            </Text>
            <Text style={[styles.discountType, { color: colors.text.secondary }]}>
              {metadata.discountType === 'percentage' ? 'de descuento' : 'de rebaja'}
            </Text>
          </View>
        </InfoCard>
      )}





      {/* Categories (if scope is categories) */}
      {metadata.scope === 'categories' && metadata.categories.length > 0 && (
        <InfoCard
          icon={<TagIcon size={18} color={colors.primary[500]} />}
          title="Categorías Incluidas"
        >
          <CategoryChips categories={metadata.categories} />
        </InfoCard>
      )}

      {/* Products in Promotion (if scope is products) */}
      {metadata.scope === 'products' && metadata.promotionProducts && metadata.promotionProducts.length > 0 && (
        <View style={[styles.comboCard, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.comboHeader}>
            <ShoppingBag size={18} color={colors.primary[500]} />
            <Text style={[styles.comboTitle, { color: colors.text.primary }]}>
              Productos en Promoción
            </Text>
          </View>
          <View style={styles.comboList}>
            {metadata.promotionProducts.map((item, index) => (
              <View
                key={index}
                style={[styles.comboItem, { borderBottomColor: colors.border.light }]}
              >
                <View style={styles.comboItemHeader}>
                  <Package size={16} color={colors.text.secondary} />
                  <Text style={[styles.comboItemName, { color: colors.text.primary }]}>
                    {item.productName}
                  </Text>
                </View>
                {item.price && (
                  <Text style={[styles.comboItemPrice, { color: colors.success }]}>
                    ₡{item.price.toLocaleString('es-CR')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Combo Items (if scope is combo) */}
      {metadata.scope === 'combo' && metadata.comboItems.length > 0 && (
        <View style={[styles.comboCard, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.comboHeader}>
            <Package size={18} color={colors.primary[500]} />
            <Text style={[styles.comboTitle, { color: colors.text.primary }]}>
              Productos del Combo
            </Text>
          </View>
          <View style={[styles.comboBadge, { backgroundColor: colors.promo.combo.bg }]}>
            <Text style={[styles.comboBadgeText, { color: colors.promo.combo.text }]}>
              Combo Especial
            </Text>
          </View>
          <View style={styles.comboList}>
            {metadata.comboItems.map((item, index) => (
              <View
                key={index}
                style={[styles.comboItem, { borderBottomColor: colors.border.light }]}
              >
                <View style={styles.comboItemHeader}>
                  <ShoppingBag size={16} color={colors.text.secondary} />
                  <Text style={[styles.comboItemName, { color: colors.text.primary }]}>
                    {item.productName}
                  </Text>
                </View>
                <View style={styles.comboItemDetails}>
                  <Text style={[styles.comboItemQuantity, { color: colors.text.secondary }]}>
                    Cantidad: {item.quantity}
                    {item.paidQuantity && ` (${item.paidQuantity} pagados)`}
                  </Text>
                  {item.price && (
                    <Text style={[styles.comboItemPrice, { color: colors.success }]}>
                      ₡{item.price.toLocaleString('es-CR')}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Additional Images */}
      {request.images.length > 0 && (
        <ImageGallery images={request.images} />
      )}

      {/* Moderation Note */}
      <ModerationNote note={request.moderationNote} />

      {/* Location (from business) */}
      {metadata.businessLocation && (
        <InfoCard
          icon={<MapPin size={18} color={colors.text.secondary} />}
          title="Ubicación del Negocio"
          value={metadata.businessLocation}
        />
      )}

      {/* Creator */}
      <InfoCard
        icon={<User size={18} color={colors.text.secondary} />}
        title="Creado Por"
        value={request.ownerName}
      />

      {/* Created Date */}
      <InfoCard
        icon={<Calendar size={18} color={colors.text.secondary} />}
        title="Fecha de Registro"
        value={formatDateAdmin(request.createdAt)}
      />
    </ScrollView>
  );
});
