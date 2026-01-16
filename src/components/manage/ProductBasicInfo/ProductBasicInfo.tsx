import { memo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface ProductBasicInfoProps {
    name: string;
    description: string;
    price: string;
    onNameChange: (text: string) => void;
    onDescriptionChange: (text: string) => void;
    onPriceChange: (text: string) => void;
    errors?: { name?: string; price?: string };
}

export const ProductBasicInfo = memo(function ProductBasicInfo({
    name,
    description,
    price,
    onNameChange,
    onDescriptionChange,
    onPriceChange,
    errors = {},
}: ProductBasicInfoProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Información Básica
            </Text>

            {/* Nombre */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                    Nombre del Producto <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: colors.background.primary,
                            borderColor: errors.name ? '#ef4444' : colors.border.medium,
                            color: colors.text.primary,
                        },
                    ]}
                    placeholder="Ej: Hamburguesa Clásica"
                    placeholderTextColor={colors.text.tertiary}
                    value={name}
                    onChangeText={onNameChange}
                />
                {errors.name && <Text style={styles.error}>{errors.name}</Text>}
            </View>

            {/* Descripción */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>Descripción</Text>
                <TextInput
                    style={[
                        styles.input,
                        styles.textArea,
                        {
                            backgroundColor: colors.background.primary,
                            borderColor: colors.border.medium,
                            color: colors.text.primary,
                        },
                    ]}
                    placeholder="Describe tu producto..."
                    placeholderTextColor={colors.text.tertiary}
                    value={description}
                    onChangeText={onDescriptionChange}
                    multiline
                    numberOfLines={4}
                />
            </View>

            {/* Precio */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                    Precio <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: colors.background.primary,
                            borderColor: errors.price ? '#ef4444' : colors.border.medium,
                            color: colors.text.primary,
                        },
                    ]}
                    placeholder="0.00"
                    placeholderTextColor={colors.text.tertiary}
                    value={price}
                    onChangeText={onPriceChange}
                    keyboardType="decimal-pad"
                />
                {errors.price && <Text style={styles.error}>{errors.price}</Text>}
            </View>
        </View>
    );
});
