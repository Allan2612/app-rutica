import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { useCategories } from '@/hooks';
import { useBusinessProducts } from '@/features/products/hooks';
import { CategorySection } from '@/components/manage';
import type { PromotionScope, DiscountType } from '@/types/enums';
import type { PromotionWizardFormData, PromotionWizardErrors } from '@/types/entities';
import { ScopeSelection } from './ScopeSelection';
import { DiscountTypeSelector } from './DiscountTypeSelector';
import { DiscountValueInput } from './DiscountValueInput';
import { ProductSelection } from './ProductSelection';
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
  // Include parent categories if a product has a subcategory
  const productCategories = useMemo(() => {
    const categoryIds = new Set<string>();
    
    products.forEach((product) => {
      if (product.categoryIds && Array.isArray(product.categoryIds)) {
        product.categoryIds.forEach((catId) => {
          categoryIds.add(catId);
          
          // Also add all parent categories up to the root
          const category = allCategories.find(c => c.id === catId);
          if (category) {
            let currentCat = category;
            while (currentCat.parentId) {
              categoryIds.add(currentCat.parentId);
              const parentCat = allCategories.find(c => c.id === currentCat.parentId);
              if (!parentCat) break;
              currentCat = parentCat;
            }
          }
        });
      }
    });
    
    return allCategories.filter((cat) => categoryIds.has(cat.id));
  }, [products, allCategories]);

  // Handlers for field changes
  const handleScopeChange = (scope: PromotionScope) => {
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
        {formData.scope === 'products' && (
          <ProductSelection
            products={products}
            selectedProductIds={formData.selectedProductIds}
            isLoading={loadingProducts}
            onToggleProduct={onToggleProduct}
            error={errors.selectedProductIds}
          />
        )}

        {/* Category Selection (only if scope is CATEGORY) */}
        {formData.scope === 'categories' && (
          <CategorySection
            categories={productCategories}
            selectedIds={formData.scopeCategoryIds}
            isLoading={loadingCategories || loadingProducts}
            onSelectionChange={(ids: string[]) => onFieldChange('scopeCategoryIds', ids)}
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
