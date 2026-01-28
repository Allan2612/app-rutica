import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { useCategories } from '@/hooks';
import { useBusinessProducts } from '@/features/products/hooks';
import type { PromoScope, DiscountType } from '@/types/enums';
import type { PromotionWizardFormData, PromotionWizardErrors } from '@/types/entities';
import { ScopeSelection } from './ScopeSelection';
import { DiscountTypeSelector } from './DiscountTypeSelector';
import { DiscountValueInput } from './DiscountValueInput';
import { ProductSelection } from './ProductSelection';
import { CategorySelection } from './CategorySelection';
import { ComboSelection } from './ComboSelection';
import { styles } from './styles';

interface WizardStepDiscountProps {
  formData: PromotionWizardFormData;
  errors: PromotionWizardErrors;
  onFieldChange: <K extends keyof PromotionWizardFormData>(
    field: K,
    value: PromotionWizardFormData[K]
  ) => void;
  onToggleProduct: (productId: string) => void;
  onToggleScopeCategory: (categoryId: string) => void;
  onUpdateComboItem: (productId: string, quantity: number, paidQuantity?: number) => void;
  onToggleComboItem: (productId: string) => void;
}

export const WizardStepDiscount = memo(function WizardStepDiscount({
  formData,
  errors,
  onFieldChange,
  onToggleProduct,
  onToggleScopeCategory,
  onUpdateComboItem,
}: WizardStepDiscountProps) {
  const { data: products = [], isLoading: loadingProducts } = useBusinessProducts(formData.businessId);
  const { data: allCategories = [], isLoading: loadingCategories } = useCategories();

  // Get categories that exist in the business's products
  const productCategories = useMemo(() => {
    const categoryIds = new Set<string>();
    products.forEach((product: { id: string; name: string; price?: number; categoryIds?: string[] }) => {
      if (product.categoryIds) {
        product.categoryIds.forEach((catId: string) => categoryIds.add(catId));
      }
    });
    return allCategories.filter((cat) => categoryIds.has(cat.id));
  }, [products, allCategories]);

  // Handlers for field changes
  const handleScopeChange = (scope: PromoScope) => {
    onFieldChange('scope', scope);
  };

  const handleDiscountTypeChange = (type: DiscountType) => {
    onFieldChange('discountType', type);
  };

  const handleDiscountValueChange = (value: number) => {
    onFieldChange('discountValue', value);
  };

  // Combo doesn't need discount type/value - it's a bundle deal
  const isCombo = formData.scope === 'combo';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Scope Selection */}
        <ScopeSelection
          selectedScope={formData.scope}
          onScopeChange={handleScopeChange}
        />

        {/* Discount Type - NOT shown for combo */}
        {!isCombo && (
          <DiscountTypeSelector
            selectedType={formData.discountType}
            onTypeChange={handleDiscountTypeChange}
          />
        )}

        {/* Discount Value - NOT shown for combo */}
        {!isCombo && (
          <DiscountValueInput
            discountType={formData.discountType}
            discountValue={formData.discountValue}
            onValueChange={handleDiscountValueChange}
            error={errors.discountValue}
          />
        )}

        {/* Product Selection (only if scope is PRODUCT) */}
        {formData.scope === 'product' && (
          <ProductSelection
            products={products}
            selectedProductIds={formData.selectedProductIds}
            isLoading={loadingProducts}
            onToggleProduct={onToggleProduct}
            error={errors.selectedProductIds}
          />
        )}

        {/* Category Selection (only if scope is CATEGORY) */}
        {formData.scope === 'category' && (
          <CategorySelection
            categories={productCategories}
            selectedCategoryIds={formData.scopeCategoryIds}
            isLoading={loadingCategories || loadingProducts}
            onToggleCategory={onToggleScopeCategory}
            error={errors.scopeCategoryIds}
          />
        )}

        {/* Combo Selection (only if scope is COMBO) */}
        {formData.scope === 'combo' && (
          <ComboSelection
            products={products}
            comboItems={formData.comboItems}
            isLoading={loadingProducts}
            onUpdateComboItem={onUpdateComboItem}
            error={errors.comboItems}
          />
        )}
      </View>
    </View>
  );
});
