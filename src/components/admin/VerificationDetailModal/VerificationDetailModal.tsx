import { memo } from 'react';
import { View, Text, Image, Modal, ScrollView, Pressable } from 'react-native';
import { X, MapPin, User, Calendar, Tag, Store, TrendingDown, Clock, CreditCard, Package, ShoppingBag } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { VerificationRequest } from '@/features/admin/services/verification.service';
import { styles } from './styles';

interface VerificationDetailModalProps {
  visible: boolean;
  request: VerificationRequest | null;
  onClose: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  business: 'Negocio',
  event: 'Evento',
  attraction: 'Atracción',
  promotion: 'Promoción',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
};

const SCOPE_LABELS: Record<string, string> = {
  business: 'Todo el negocio',
  category: 'Categorías específicas',
  product: 'Productos específicos',
};

export const VerificationDetailModal = memo(function VerificationDetailModal({
  visible,
  request,
  onClose,
}: VerificationDetailModalProps) {
  const colors = useThemedColors();

  if (!request) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateShort = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Render promotion-specific details
  const renderPromotionDetails = () => {
    if (request.type !== 'promotion' || !request.metadata) return null;

    const {
      businessName,
      businessLocation,
      discountType,
      discountValue,
      scope,
      startAt,
      endAt,
      paymentReference,
      paymentState,
      paymentNote,
      moderationNote,
      categories,
      comboItems,
      images,
    } = request.metadata;

    const discountStr = discountType === 'percentage'
      ? `${discountValue}%`
      : `₡${Number(discountValue).toLocaleString('es-CR')}`;

    const paymentStateLabels: Record<string, string> = {
      pending: 'Pendiente',
      paid: 'Pagado',
      rejected: 'Rechazado',
    };

    return (
      <>
        {/* Business Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.infoCardHeader}>
            <Store size={18} color={colors.primary[500]} />
            <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>
              Negocio Asociado
            </Text>
          </View>
          <Text style={[styles.infoCardValue, { color: colors.text.primary }]}>
            {businessName || 'No especificado'}
          </Text>
        </View>

        {/* Payment Reference - IMPORTANT FOR DASHBOARD */}
        {paymentReference && (
          <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
            <View style={styles.infoCardHeader}>
              <CreditCard size={18} color={colors.primary[500]} />
              <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>
                Referencia de Pago
              </Text>
            </View>
            <View>
              <Text style={[styles.paymentReference, { color: colors.text.primary }]}>
                {paymentReference}
              </Text>
              <Text style={[styles.paymentState, { 
                color: paymentState === 'paid' 
                  ? colors.success 
                  : paymentState === 'rejected'
                  ? colors.error
                  : colors.warning 
              }]}>
                {paymentStateLabels[paymentState] || paymentState}
              </Text>
            </View>
          </View>
        )}

        {/* Payment Note */}
        {paymentNote && (
          <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
            <View style={styles.infoCardHeader}>
              <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>
                Nota del Pago
              </Text>
            </View>
            <Text style={[styles.noteText, { color: colors.text.secondary }]}>
              {paymentNote}
            </Text>
          </View>
        )}

        {/* Moderation Note */}
        {moderationNote && (
          <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
            <View style={styles.infoCardHeader}>
              <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>
                Nota de Moderación
              </Text>
            </View>
            <Text style={[styles.noteText, { color: colors.text.secondary }]}>
              {moderationNote}
            </Text>
          </View>
        )}

        {/* Discount Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.infoCardHeader}>
            <TrendingDown size={18} color={colors.success} />
            <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>
              Descuento
            </Text>
          </View>
          <View style={styles.discountRow}>
            <Text style={[styles.discountValue, { color: colors.success }]}>
              {discountStr}
            </Text>
            <Text style={[styles.discountType, { color: colors.text.secondary }]}>
              {discountType === 'percentage' ? 'de descuento' : 'de rebaja'}
            </Text>
          </View>
        </View>

        {/* Validity Period */}
        <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.infoCardHeader}>
            <Clock size={18} color={colors.warning} />
            <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>
              Período de Validez
            </Text>
          </View>
          <View style={styles.dateRange}>
            <View style={styles.dateItem}>
              <Text style={[styles.dateLabel, { color: colors.text.secondary }]}>Inicio</Text>
              <Text style={[styles.dateValue, { color: colors.text.primary }]}>
                {formatDateShort(startAt)}
              </Text>
            </View>
            <View style={[styles.dateSeparator, { backgroundColor: colors.border.light }]} />
            <View style={styles.dateItem}>
              <Text style={[styles.dateLabel, { color: colors.text.secondary }]}>Fin</Text>
              <Text style={[styles.dateValue, { color: colors.text.primary }]}>
                {formatDateShort(endAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Scope */}
        <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.infoCardHeader}>
            <Tag size={18} color={colors.primary[500]} />
            <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>
              Alcance de la Promoción
            </Text>
          </View>
          <Text style={[styles.infoCardValue, { color: colors.text.primary }]}>
            {SCOPE_LABELS[scope] || scope}
          </Text>
        </View>

        {/* Categories (if scope is category) */}
        {scope === 'category' && categories && categories.length > 0 && (
          <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
            <View style={styles.infoCardHeader}>
              <Tag size={18} color={colors.primary[500]} />
              <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>
                Categorías Incluidas
              </Text>
            </View>
            <View style={styles.categoryList}>
              {categories.map((cat: string, index: number) => (
                <View 
                  key={index} 
                  style={[
                    styles.categoryChip, 
                    { 
                      backgroundColor: colors.isDark 
                        ? 'rgba(59, 130, 246, 0.15)' 
                        : colors.primary[50],
                      borderColor: colors.isDark 
                        ? colors.primary[500] 
                        : colors.primary[200],
                    }
                  ]}
                >
                  <Text style={[
                    styles.categoryChipText, 
                    { color: colors.isDark 
                      ? colors.primary[400] 
                      : colors.primary[700] 
                    }
                  ]}>
                    {cat}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Combo Items (if scope is product) */}
        {scope === 'product' && comboItems && comboItems.length > 0 && (
          <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
            <View style={styles.infoCardHeader}>
              <Package size={18} color={colors.primary[500]} />
              <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>
                Productos en Combo
              </Text>
            </View>
            <View style={styles.comboList}>
              {comboItems.map((item: any, index: number) => (
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
                        ₡{Number(item.price).toLocaleString('es-CR')}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Additional Images */}
        {images && images.length > 1 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Galería de Imágenes
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageGallery}
            >
              {images.map((img: any, index: number) => (
                <Image
                  key={index}
                  source={{ uri: img.url }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable 
          style={[styles.modalContainer, { backgroundColor: colors.background.primary }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Información Detallada
            </Text>
            <Pressable 
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                { backgroundColor: pressed ? colors.background.tertiary : 'transparent' }
              ]}
            >
              <X size={24} color={colors.text.secondary} />
            </Pressable>
          </View>

          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Main Image */}
            {request.imageUrl && (
              <Image 
                source={{ uri: request.imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            )}

            {/* Type Badge - YELLOW for promotions */}
            <View style={[
              styles.badge, 
              { backgroundColor: request.type === 'promotion' 
                ? colors.isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7'
                : colors.primary[100] 
              }
            ]}>
              <Tag size={14} color={request.type === 'promotion' 
                ? colors.isDark ? '#fbbf24' : '#92400e'
                : colors.primary[600]} 
              />
              <Text style={[
                styles.badgeText, 
                { color: request.type === 'promotion' 
                  ? colors.isDark ? '#fbbf24' : '#92400e'
                  : colors.primary[700] 
                }
              ]}>
                {TYPE_LABELS[request.type]}
              </Text>
            </View>

            {/* Title/Name */}
            <Text style={[styles.entityName, { color: colors.text.primary }]}>
              {request.name}
            </Text>

            {/* Description - NO subtitle, just text */}
            {request.description && (
              <Text style={[styles.description, { color: colors.text.secondary }]}>
                {request.description}
              </Text>
            )}

            {/* Type-specific details */}
            {renderPromotionDetails()}

            {/* Location - Show business location for promotions */}
            {request.type === 'promotion' && request.metadata?.businessLocation ? (
              <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.infoCardHeader}>
                  <MapPin size={18} color={colors.text.secondary} />
                  <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>
                    Ubicación
                  </Text>
                </View>
                <Text style={[styles.infoCardValue, { color: colors.text.primary }]}>
                  {request.metadata.businessLocation}
                </Text>
              </View>
            ) : request.locationLabel && request.type !== 'promotion' ? (
              <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.infoCardHeader}>
                  <MapPin size={18} color={colors.text.secondary} />
                  <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>
                    Ubicación
                  </Text>
                </View>
                <Text style={[styles.infoCardValue, { color: colors.text.primary }]}>
                  {request.locationLabel}
                </Text>
              </View>
            ) : null}

            {/* Owner */}
            <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
              <View style={styles.infoCardHeader}>
                <User size={18} color={colors.text.secondary} />
                <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>
                  Creado Por
                </Text>
              </View>
              <Text style={[styles.infoCardValue, { color: colors.text.primary }]}>
                {request.ownerName}
              </Text>
            </View>

            {/* Created Date */}
            <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
              <View style={styles.infoCardHeader}>
                <Calendar size={18} color={colors.text.secondary} />
                <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>
                  Fecha de Creación
                </Text>
              </View>
              <Text style={[styles.infoCardValue, { color: colors.text.primary }]}>
                {formatDate(request.createdAt)}
              </Text>
            </View>

            {/* Status */}
            <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
              <View style={styles.infoCardHeader}>
                <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>
                  Estado de Moderación
                </Text>
              </View>
              <Text style={[styles.statusValue, { 
                color: request.moderationStatus === 'approved' 
                  ? colors.success 
                  : request.moderationStatus === 'rejected' 
                  ? colors.error 
                  : colors.warning 
              }]}>
                {STATUS_LABELS[request.moderationStatus]}
              </Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={[styles.footer, { borderTopColor: colors.border.light }]}>
            <Pressable 
              onPress={onClose}
              style={({ pressed }) => [
                styles.button,
                { 
                  backgroundColor: pressed 
                    ? colors.primary[600] 
                    : colors.primary[500] 
                }
              ]}
            >
              <Text style={styles.buttonText}>
                Cerrar
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});
