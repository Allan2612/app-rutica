import { memo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface EventBasicInfoSectionProps {
    name: string;
    description: string;
    onNameChange: (text: string) => void;
    onDescriptionChange: (text: string) => void;
    errors?: { name?: string; description?: string };
}

export const EventBasicInfoSection = memo(function EventBasicInfoSection({
    name,
    description,
    onNameChange,
    onDescriptionChange,
    errors = {},
}: EventBasicInfoSectionProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Información Básica
            </Text>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                    Nombre del Evento <Text style={{ color: colors.error }}>*</Text>
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
                    placeholder="Ej: Festival de Música 2026"
                    placeholderTextColor={colors.text.tertiary}
                />
                {errors.name && (
                    <Text style={[styles.error, { color: colors.error }]}>
                        {errors.name}
                    </Text>
                )}
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                    Descripción
                </Text>
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
                    placeholder="Describe el evento (opcional)"
                    placeholderTextColor={colors.text.tertiary}
                    multiline
                    numberOfLines={4}
                />
            </View>
        </View>
    );
});
