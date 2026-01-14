import { memo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface BasicInfoSectionProps {
    name: string;
    description: string;
    onNameChange: (text: string) => void;
    onDescriptionChange: (text: string) => void;
    errors?: { name?: string; description?: string };
}

export const BasicInfoSection = memo(function BasicInfoSection({
    name,
    description,
    onNameChange,
    onDescriptionChange,
    errors = {},
}: BasicInfoSectionProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Información Básica
            </Text>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                    Nombre <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: colors.background.secondary,
                            borderColor: errors.name ? colors.error : colors.border.medium,
                            color: colors.text.primary,
                        },
                    ]}
                    value={name}
                    onChangeText={onNameChange}
                    placeholder="Ej: Café Premium"
                    placeholderTextColor={colors.text.tertiary}
                />
                {errors.name && <Text style={styles.error}>{errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>Descripción</Text>
                <TextInput
                    style={[
                        styles.input,
                        styles.textArea,
                        {
                            backgroundColor: colors.background.secondary,
                            borderColor: colors.border.medium,
                            color: colors.text.primary,
                        },
                    ]}
                    value={description}
                    onChangeText={onDescriptionChange}
                    placeholder="Describe tu negocio..."
                    placeholderTextColor={colors.text.tertiary}
                    multiline
                    numberOfLines={4}
                />
            </View>
        </View>
    );
});
