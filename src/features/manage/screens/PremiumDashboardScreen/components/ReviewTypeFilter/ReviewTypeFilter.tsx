import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from './styles';
import type { ReviewTypeFilterProps, ReviewType } from '../../../../../../types/entities/premium';

const REVIEW_TYPE_OPTIONS: Array<{ value: ReviewType; label: string }> = [
    { value: 'all', label: 'Todas' },
    { value: 'business', label: 'Negocios' },
    { value: 'product', label: 'Productos' },
];

export const ReviewTypeFilter = memo(function ReviewTypeFilter({
    selectedType,
    onSelectType,
    colors,
}: ReviewTypeFilterProps) {
    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
                Tipo de Reseñas
            </Text>
            <View style={styles.buttons}>
                {REVIEW_TYPE_OPTIONS.map((option) => (
                    <Pressable
                        key={option.value}
                        style={[
                            styles.button,
                            {
                                backgroundColor: selectedType === option.value
                                    ? colors.primary[500]
                                    : colors.background.primary,
                                borderColor: selectedType === option.value
                                    ? colors.primary[500]
                                    : colors.border.light,
                            },
                        ]}
                        onPress={() => onSelectType(option.value)}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                {
                                    color: selectedType === option.value ? '#ffffff' : colors.text.secondary,
                                },
                            ]}
                        >
                            {option.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
});
