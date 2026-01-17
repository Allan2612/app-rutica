import { memo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useThemedColors } from '@/hooks';
import { formSectionStyles } from '@/styles/form-section-styles';

interface BasicInfoSectionProps {
    name: string;
    description: string;
    onNameChange: (text: string) => void;
    onDescriptionChange: (text: string) => void;
    errors?: { name?: string; description?: string };
    nameLabel?: string;
    namePlaceholder?: string;
    descriptionLabel?: string;
    descriptionPlaceholder?: string;
    sectionTitle?: string;
    nameRequired?: boolean;
}

export const BasicInfoSection = memo(function BasicInfoSection({
    name,
    description,
    onNameChange,
    onDescriptionChange,
    errors = {},
    nameLabel = 'Nombre',
    namePlaceholder = 'Ej: Café Premium',
    descriptionLabel = 'Descripción',
    descriptionPlaceholder = 'Describe tu negocio...',
    sectionTitle = 'Información Básica',
    nameRequired = true,
}: BasicInfoSectionProps) {
    const colors = useThemedColors();

    return (
        <View style={formSectionStyles.section}>
            <Text style={[formSectionStyles.sectionTitle, { color: colors.text.primary }]}>
                {sectionTitle}
            </Text>

            <View style={formSectionStyles.inputGroup}>
                <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
                    {nameLabel}
                    {nameRequired && <Text style={formSectionStyles.required}> *</Text>}
                </Text>
                <TextInput
                    style={[
                        formSectionStyles.input,
                        {
                            backgroundColor: colors.background.secondary,
                            borderColor: errors.name ? colors.error : colors.border.medium,
                            color: colors.text.primary,
                        },
                    ]}
                    value={name}
                    onChangeText={onNameChange}
                    placeholder={namePlaceholder}
                    placeholderTextColor={colors.text.tertiary}
                />
                {errors.name && <Text style={[formSectionStyles.error, { color: colors.error }]}>{errors.name}</Text>}
            </View>

            <View style={formSectionStyles.inputGroup}>
                <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>{descriptionLabel}</Text>
                <TextInput
                    style={[
                        formSectionStyles.input,
                        formSectionStyles.textArea,
                        {
                            backgroundColor: colors.background.secondary,
                            borderColor: colors.border.medium,
                            color: colors.text.primary,
                        },
                    ]}
                    value={description}
                    onChangeText={onDescriptionChange}
                    placeholder={descriptionPlaceholder}
                    placeholderTextColor={colors.text.tertiary}
                    multiline
                    numberOfLines={4}
                />
            </View>
        </View>
    );
});
