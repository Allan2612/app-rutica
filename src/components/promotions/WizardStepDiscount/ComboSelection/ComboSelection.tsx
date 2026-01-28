import { memo, useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { Layers, Minus, Plus, AlertCircle, Package, Lightbulb } from 'lucide-react-native';
import { useThemedColors, useHideScrollbar } from '@/hooks';
import { formSectionStyles } from '@/styles/form-section-styles';
import { styles } from './styles';
import { ComboHelpModal } from '../ComboHelpModal';

interface Product {
  id: string;
  name: string;
  price?: number;
}

interface ComboItem {
  productId: string;
  quantity: number;
  paidQuantity?: number;  // Cuántas unidades paga (para 2x1, 3x2, etc.)
}

interface ComboSelectionProps {
  products: Product[];
  comboItems: ComboItem[];
  isLoading: boolean;
  onUpdateComboItem: (productId: string, quantity: number, paidQuantity?: number) => void;
  error?: string;
}

/**
 * Genera una etiqueta descriptiva del combo basada en los items seleccionados
 * Ej: "2x1", "3x2", "Combo 4 productos"
 */
function generateComboLabel(comboItems: ComboItem[]): string {
  if (comboItems.length === 0) return '';
  
  const totalQuantity = comboItems.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueProducts = comboItems.length;
  
  // Si es un solo producto con descuento de cantidad
  if (uniqueProducts === 1 && totalQuantity >= 2) {
    const item = comboItems[0];
    if (item.paidQuantity && item.paidQuantity < item.quantity) {
      return `${item.quantity}x${item.paidQuantity}`;
    }
    return `Combo ${totalQuantity} unidades`;
  }
  
  // Si hay múltiples productos
  if (uniqueProducts >= 2) {
    return `Combo: ${totalQuantity} unidades`;
  }
  
  return `${totalQuantity} unidades`;
}

export const ComboSelection = memo(function ComboSelection({
  products,
  comboItems,
  isLoading,
  onUpdateComboItem,
  error,
}: ComboSelectionProps) {
  const colors = useThemedColors();
  const comboItemCount = comboItems.length;
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);

  // Generate combo label for preview
  const comboLabel = useMemo(() => generateComboLabel(comboItems), [comboItems]);

  // Calculate total value of combo (lo que el cliente PAGA)
  const comboTotalValue = useMemo(() => {
    return comboItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      const quantityToPay = item.paidQuantity ?? item.quantity;
      return total + (product?.price ?? 0) * quantityToPay;
    }, 0);
  }, [comboItems, products]);

  // Get quantity and paidQuantity for a product
  const getQuantityInfo = (productId: string): { quantity: number; paidQuantity?: number } => {
    const item = comboItems.find((i) => i.productId === productId);
    return item ? { quantity: item.quantity, paidQuantity: item.paidQuantity } : { quantity: 0 };
  };

  // Hook para ocultar scrollbar en web
  useHideScrollbar();

  const renderProductCard = (product: Product) => {
    const { quantity, paidQuantity } = getQuantityInfo(product.id);
    const isInCombo = quantity > 0;

    // Use theme-aware background colors
    const selectedBgColor = colors.isDark 
      ? `${colors.primary[500]}20`
      : `${colors.primary[500]}15`;

    return (
      <View
        key={product.id}
        style={[
          styles.productCard,
          {
            backgroundColor: isInCombo
              ? selectedBgColor
              : colors.background.secondary,
            borderColor: isInCombo ? colors.primary[500] : colors.border.medium,
          },
        ]}
      >
        <View style={styles.productInfo}>
          <View style={styles.productNameRow}>
            
            <Text
              style={[styles.productName, { color: colors.text.primary }]}
              numberOfLines={1}
            >
              {product.name}
            </Text>
            {isInCombo && (
              <View style={[styles.quantityBadge, { backgroundColor: colors.primary[500] }]}>
                <Text style={styles.quantityBadgeText}>
                  {paidQuantity && paidQuantity < quantity ? `${quantity}x${paidQuantity}` : `x${quantity}`}
                </Text>
              </View>
            )}
          </View>
          {product.price && (
            <Text 
              style={[styles.productPrice, { color: colors.text.secondary }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              ₡{product.price.toLocaleString()}
            </Text>
          )}
        </View>
        
        {/* Controles de cantidad */}
        <View style={styles.quantitySection}>
          {/* Lleva */}
          <View style={styles.quantityRowCentered}>
            <Text style={[styles.quantityLabel, { color: colors.text.primary }]}>Lleva</Text>
            <View style={[styles.quantityPill, { backgroundColor: colors.background.tertiary }]}>
              <Pressable
                style={styles.pillButton}
                onPress={() => {
                  const newQty = quantity - 1;
                  const newPaid = paidQuantity && paidQuantity > newQty ? newQty : paidQuantity;
                  onUpdateComboItem(product.id, newQty, newPaid);
                }}
                disabled={quantity === 0}
              >
                <Minus 
                  size={18} 
                  color={quantity > 0 ? colors.primary[500] : colors.text.tertiary} 
                  strokeWidth={2.5}
                />
              </Pressable>
              <View style={styles.pillNumber}>
                <Text style={[styles.pillNumberText, { color: colors.primary[600] }]}>
                  {quantity}
                </Text>
              </View>
              <Pressable
                style={styles.pillButton}
                onPress={() => onUpdateComboItem(product.id, quantity + 1, paidQuantity)}
              >
                <Plus 
                  size={18} 
                  color={colors.primary[500]} 
                  strokeWidth={2.5}
                />
              </Pressable>
            </View>
          </View>
          
          {/* Paga (solo si quantity > 1) */}
          {quantity > 1 && (
            <View style={styles.quantityRowCentered}>
              <Text style={[styles.quantityLabel, { color: colors.text.primary }]}>Paga</Text>
              <View style={[styles.quantityPill, { backgroundColor: colors.background.tertiary }]}>
                <Pressable
                  style={styles.pillButton}
                  onPress={() => {
                    const currentPaid = paidQuantity ?? quantity;
                    const newPaid = Math.max(1, currentPaid - 1);
                    onUpdateComboItem(product.id, quantity, newPaid);
                  }}
                  disabled={(paidQuantity ?? quantity) <= 1}
                >
                  <Minus 
                    size={18} 
                    color={(paidQuantity ?? quantity) > 1 ? colors.success : colors.text.tertiary}
                    strokeWidth={2.5}
                  />
                </Pressable>
                <View style={styles.pillNumber}>
                  <Text style={[styles.pillNumberText, { color: colors.success }]}>
                    {paidQuantity ?? quantity}
                  </Text>
                </View>
                <Pressable
                  style={styles.pillButton}
                  onPress={() => {
                    const currentPaid = paidQuantity ?? quantity;
                    const newPaid = Math.min(quantity, currentPaid + 1);
                    onUpdateComboItem(product.id, quantity, newPaid === quantity ? undefined : newPaid);
                  }}
                  disabled={(paidQuantity ?? quantity) >= quantity}
                >
                  <Plus 
                    size={18} 
                    color={(paidQuantity ?? quantity) < quantity ? colors.success : colors.text.tertiary}
                    strokeWidth={2.5}
                  />
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={formSectionStyles.section}>
      {/* Combo Preview Badge - shows what kind of combo this is */}
      {comboLabel && (
        <View style={[styles.comboPreview, { backgroundColor: colors.primary[500] }]}>
          <Package size={18} color="#FFFFFF" />
          <Text style={styles.comboPreviewLabel}>{comboLabel}</Text>
          {comboTotalValue > 0 && (
            <Text style={styles.comboPreviewValue}>
              Valor: ₡{comboTotalValue.toLocaleString()}
            </Text>
          )}
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
          Arma tu combo <Text style={formSectionStyles.required}>*</Text>
        </Text>
        {comboItemCount > 0 && (
          <View style={[styles.countBadge, { backgroundColor: colors.primary[500] }]}>
            <Text style={styles.countText}>{comboItemCount} productos</Text>
          </View>
        )}
        <Pressable
          onPress={() => setIsHelpModalVisible(true)}
          style={({ pressed }) => [
            styles.helpButton,
            {
              backgroundColor: pressed ? colors.primary[100] : colors.background.secondary,
              borderColor: colors.primary[500],
            },
          ]}
        >
          <Lightbulb size={20} color={colors.primary[500]} strokeWidth={2} />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Cargando productos...
          </Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Layers size={24} color={colors.text.tertiary} />
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
            No hay productos registrados
          </Text>
        </View>
      ) : Platform.OS === 'web' ? (
        <div
          className="hide-scrollbar"
          style={{
            maxHeight: 350,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            border: `1px solid ${colors.border.medium}`,
            borderRadius: 8,
            padding: 8,
            scrollbarWidth: 'none' as const,
            msOverflowStyle: 'none' as const,
          }}
        >
          {products.map(renderProductCard)}
        </div>
      ) : (
        <ScrollView
          style={[styles.productScroll, { borderColor: colors.border.medium }]}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          {products.map(renderProductCard)}
        </ScrollView>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={14} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </View>
      )}

      {/* Help Modal */}
      <ComboHelpModal
        visible={isHelpModalVisible}
        onClose={() => setIsHelpModalVisible(false)}
      />
    </View>
  );
});
