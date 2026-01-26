import { memo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { Percent, DollarSign, Package, Check, AlertCircle } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useBusinessProducts } from '@/features/products/hooks';
import type { DiscountType, PromoScope } from '@/types/enums';
import { formSectionStyles } from '@/styles/form-section-styles';
import type { PromotionWizardFormData, PromotionWizardErrors } from '@/types/entities';
import { styles } from './styles';

interface WizardStepDiscountProps {
  formData: PromotionWizardFormData;
  errors: PromotionWizardErrors;
  onFieldChange: <K extends keyof PromotionWizardFormData>(
    field: K,
    value: PromotionWizardFormData[K]
  ) => void;
  onToggleProduct: (productId: string) => void;
}

const DISCOUNT_TYPES: { value: DiscountType; label: string; icon: any }[] = [
  {
    value: 'percentage',
    label: 'Porcentaje',
    icon: Percent,
  },
  {
    value: 'fixed',
    label: 'Monto fijo',
    icon: DollarSign,
  },
];

const SCOPE_OPTIONS: { value: PromoScope; label: string }[] = [
  { value: 'general', label: 'Todo el negocio' },
  { value: 'product', label: 'Productos específicos' },
];

export const WizardStepDiscount = memo(function WizardStepDiscount({
  formData,
  errors,
  onFieldChange,
  onToggleProduct,
}: WizardStepDiscountProps) {
  const colors = useThemedColors();
  const { data: products = [], isLoading } = useBusinessProducts(formData.businessId);

  const showProductSelection = formData.scope === 'product';

  // Calculate selected products count
  const selectedCount = formData.selectedProductIds.length;

  // Inyectar estilos para ocultar scrollbar en web
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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Scope Selection */}
        <View style={formSectionStyles.section}>
          <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
            Alcance de la promoción <Text style={formSectionStyles.required}>*</Text>
          </Text>
          <View style={styles.scopeRow}>
            {SCOPE_OPTIONS.map((option) => {
              const isSelected = formData.scope === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.scopeChip,
                    {
                      backgroundColor: isSelected
                        ? colors.primary[500]
                        : colors.background.secondary,
                      borderColor: isSelected ? colors.primary[500] : colors.border.medium,
                    },
                  ]}
                  onPress={() => onFieldChange('scope', option.value)}
                >
                  {isSelected && <Check size={14} color="#FFFFFF" />}
                  <Text
                    style={[
                      styles.scopeLabel,
                      { color: isSelected ? '#FFFFFF' : colors.text.primary },
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Discount Type */}
        <View style={formSectionStyles.section}>
          <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
            Tipo de descuento <Text style={formSectionStyles.required}>*</Text>
          </Text>

          <View style={styles.discountTypeRow}>
            {DISCOUNT_TYPES.map((type) => {
              const isSelected = formData.discountType === type.value;
              const Icon = type.icon;

              return (
                <Pressable
                  key={type.value}
                  style={[
                    styles.discountTypeCard,
                    {
                      backgroundColor: isSelected
                        ? colors.primary[500]
                        : colors.background.secondary,
                      borderColor: isSelected ? colors.primary[500] : colors.border.medium,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => onFieldChange('discountType', type.value)}
                >
                  <Icon
                    size={20}
                    color={isSelected ? '#FFFFFF' : colors.text.tertiary}
                  />
                  <Text
                    style={[
                      styles.discountTypeLabel,
                      { color: isSelected ? '#FFFFFF' : colors.text.primary },
                    ]}
                  >
                    {type.label}
                  </Text>
                  {isSelected && <Check size={16} color="#FFFFFF" />}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Discount Value */}
        <View style={formSectionStyles.section}>
          <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
            {formData.discountType === 'percentage'
              ? 'Porcentaje de descuento'
              : 'Monto de descuento (₡)'}{' '}
            <Text style={formSectionStyles.required}>*</Text>
          </Text>

          <View style={styles.inputWithUnit}>
            <TextInput
              style={[
                formSectionStyles.input,
                styles.discountInput,
                {
                  backgroundColor: colors.background.secondary,
                  borderColor: errors.discountValue ? colors.error : colors.border.medium,
                  color: colors.text.primary,
                },
              ]}
              value={formData.discountValue > 0 ? String(formData.discountValue) : ''}
              onChangeText={(text) => {
                const numValue = parseFloat(text) || 0;
                onFieldChange('discountValue', numValue);
              }}
              placeholder={
                formData.discountType === 'percentage' ? 'Ej: 20' : 'Ej: 5000'
              }
              placeholderTextColor={colors.text.tertiary}
              keyboardType="numeric"
            />
            <View
              style={[
                styles.unitBadge,
                { backgroundColor: colors.background.tertiary },
              ]}
            >
              <Text style={[styles.unitText, { color: colors.text.secondary }]}>
                {formData.discountType === 'percentage' ? '%' : '₡'}
              </Text>
            </View>
          </View>

          {errors.discountValue && (
            <View style={styles.errorContainer}>
              <AlertCircle size={14} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.discountValue}
              </Text>
            </View>
          )}

          {formData.discountType === 'percentage' && formData.discountValue > 0 && (
            <Text style={[styles.helperText, { color: colors.text.secondary }]}>
              Los clientes recibirán un {formData.discountValue}% de descuento
            </Text>
          )}
        </View>

        {/* Product Selection (only if scope is PRODUCT) */}
        {showProductSelection && (
          <View style={formSectionStyles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
                Productos a aplicar <Text style={formSectionStyles.required}>*</Text>
              </Text>
              {selectedCount > 0 && (
                <View
                  style={[styles.countBadge, { backgroundColor: colors.primary[500] }]}
                >
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
                  scrollbarWidth: 'none' as any,
                  msOverflowStyle: 'none' as any,
                }}
              >
                {products.map((product: any) => {
                  const isSelected = formData.selectedProductIds.includes(product.id);

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
                          borderWidth: 1,
                        },
                      ]}
                      onPress={() => onToggleProduct(product.id)}
                    >
                      <View style={styles.productInfo}>
                        <View
                          style={[
                            styles.checkbox,
                            {
                              backgroundColor: isSelected
                                ? '#FFFFFF'
                                : 'transparent',
                              borderColor: isSelected
                                ? '#FFFFFF'
                                : colors.border.medium,
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
                })}
              </div>
            ) : (
              <ScrollView
                style={[styles.productScroll, { borderColor: colors.border.medium }]}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {products.map((product: any) => {
                  const isSelected = formData.selectedProductIds.includes(product.id);

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
                          borderWidth: 1,
                        },
                      ]}
                      onPress={() => onToggleProduct(product.id)}
                    >
                      <View style={styles.productInfo}>
                        <View
                          style={[
                            styles.checkbox,
                            {
                              backgroundColor: isSelected
                                ? '#FFFFFF'
                                : 'transparent',
                              borderColor: isSelected
                                ? '#FFFFFF'
                                : colors.border.medium,
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
                })}
              </ScrollView>
            )}

            {errors.selectedProductIds && (
              <View style={styles.errorContainer}>
                <AlertCircle size={14} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.selectedProductIds}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
});




