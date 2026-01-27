import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Package, Tag, Layers, Check } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { formSectionStyles } from '@/styles/form-section-styles';
import type { PromoScope } from '@/types/enums';
import { scopeSelectionStyles } from './styles';

interface ScopeOption {
  value: PromoScope;
  label: string;
  description: string;
}

const SCOPE_OPTIONS: ScopeOption[] = [
  { value: 'general', label: 'Todo el negocio', description: 'Aplica a todos los productos' },
  { value: 'product', label: 'Productos específicos', description: 'Selecciona productos individuales' },
  { value: 'category', label: 'Por categoría', description: 'Aplica a productos de ciertas categorías' },
  { 
    value: 'combo', 
    label: 'Combo / 2x1', 
    description: 'Aplica a combos o promociones de tipo 2x1' 
  },
];

const SCOPE_ICONS: Record<PromoScope, typeof Package> = {
  general: Package,
  product: Package,
  category: Tag,
  combo: Layers,
};

interface ScopeSelectionProps {
  selectedScope: PromoScope;
  onScopeChange: (scope: PromoScope) => void;
}

export const ScopeSelection = memo(function ScopeSelection({
  selectedScope,
  onScopeChange,
}: ScopeSelectionProps) {
  const colors = useThemedColors();

  return (
    <View style={formSectionStyles.section}>
      <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
        Alcance de la promoción <Text style={formSectionStyles.required}>*</Text>
      </Text>
      <View style={scopeSelectionStyles.grid}>
        {SCOPE_OPTIONS.map((option) => {
          const isSelected = selectedScope === option.value;
          const ScopeIcon = SCOPE_ICONS[option.value];
          
          return (
            <Pressable
              key={option.value}
              style={[
                scopeSelectionStyles.card,
                {
                  backgroundColor: isSelected
                    ? colors.primary[500]
                    : colors.background.secondary,
                  borderColor: isSelected ? colors.primary[500] : colors.border.medium,
                },
              ]}
              onPress={() => onScopeChange(option.value)}
            >
              <View style={scopeSelectionStyles.cardHeader}>
                <ScopeIcon size={18} color={isSelected ? '#FFFFFF' : colors.text.tertiary} />
                {isSelected && <Check size={14} color="#FFFFFF" />}
              </View>
              <Text
                style={[
                  scopeSelectionStyles.cardTitle,
                  { color: isSelected ? '#FFFFFF' : colors.text.primary },
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  scopeSelectionStyles.cardDescription,
                  { color: isSelected ? 'rgba(255,255,255,0.8)' : colors.text.secondary },
                ]}
                numberOfLines={2}
              >
                {option.description}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});
