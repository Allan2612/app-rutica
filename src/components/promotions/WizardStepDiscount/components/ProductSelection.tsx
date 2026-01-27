import { memo, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { Package, Check, AlertCircle } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { formSectionStyles } from '@/styles/form-section-styles';
import { productSelectionStyles as styles } from './styles';

interface Product {
  id: string;
  name: string;
  price?: number;
}

interface ProductSelectionProps {
  products: Product[];
  selectedProductIds: string[];
  isLoading: boolean;
  onToggleProduct: (productId: string) => void;
  error?: string;
}

export const ProductSelection = memo(function ProductSelection({
  products,
  selectedProductIds,
  isLoading,
  onToggleProduct,
  error,
}: ProductSelectionProps) {
  const colors = useThemedColors();
  const selectedCount = selectedProductIds.length;

  // Inject styles to hide scrollbar on web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'hide-scrollbar-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          .hide-scrollbar::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          .hide-scrollbar {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  const renderProductCard = (product: Product) => {
    const isSelected = selectedProductIds.includes(product.id);

    return (
      <Pressable
        key={product.id}
        style={[
          styles.productCard,
          {
            backgroundColor: isSelected
              ? colors.primary[500]
              : colors.background.secondary,
            borderColor: isSelected ? colors.primary[500] : colors.border.medium,
          },
        ]}
        onPress={() => onToggleProduct(product.id)}
      >
        <View style={styles.productInfo}>
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                borderColor: isSelected ? '#FFFFFF' : colors.border.medium,
              },
            ]}
          >
            {isSelected && <Check size={12} color={colors.primary[500]} />}
          </View>
          <Text
            style={[styles.productName, { color: isSelected ? '#FFFFFF' : colors.text.primary }]}
            numberOfLines={1}
          >
            {product.name}
          </Text>
          {product.price && (
            <Text
              style={[styles.productPrice, { color: isSelected ? '#FFFFFF' : colors.text.secondary }]}
            >
              ₡{product.price.toLocaleString()}
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={formSectionStyles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
          Productos a aplicar <Text style={formSectionStyles.required}>*</Text>
        </Text>
        {selectedCount > 0 && (
          <View style={[styles.countBadge, { backgroundColor: colors.primary[500] }]}>
            <Text style={styles.countText}>{selectedCount}</Text>
          </View>
        )}
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
          <Package size={24} color={colors.text.tertiary} />
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
            No hay productos registrados
          </Text>
        </View>
      ) : Platform.OS === 'web' ? (
        <div
          className="hide-scrollbar"
          style={{
            maxHeight: 300,
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
    </View>
  );
});
