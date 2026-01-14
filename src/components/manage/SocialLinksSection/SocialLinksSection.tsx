import { memo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface SocialLinksSectionProps {
    facebook: string;
    instagram: string;
    tiktok: string;
    onFacebookChange: (text: string) => void;
    onInstagramChange: (text: string) => void;
    onTiktokChange: (text: string) => void;
}

export const SocialLinksSection = memo(function SocialLinksSection({
    facebook,
    instagram,
    tiktok,
    onFacebookChange,
    onInstagramChange,
    onTiktokChange,
}: SocialLinksSectionProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Redes Sociales (Opcional)
            </Text>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>Facebook</Text>
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: colors.background.primary,
                            borderColor: colors.border.medium,
                            color: colors.text.primary,
                        },
                    ]}
                    value={facebook}
                    onChangeText={onFacebookChange}
                    placeholder="Ej: https://facebook.com/minegocio"
                    placeholderTextColor={colors.text.tertiary}
                    keyboardType="url"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>Instagram</Text>
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: colors.background.primary,
                            borderColor: colors.border.medium,
                            color: colors.text.primary,
                        },
                    ]}
                    value={instagram}
                    onChangeText={onInstagramChange}
                    placeholder="Ej: https://instagram.com/minegocio"
                    placeholderTextColor={colors.text.tertiary}
                    keyboardType="url"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>TikTok</Text>
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: colors.background.primary,
                            borderColor: colors.border.medium,
                            color: colors.text.primary,
                        },
                    ]}
                    value={tiktok}
                    onChangeText={onTiktokChange}
                    placeholder="Ej: https://tiktok.com/@minegocio"
                    placeholderTextColor={colors.text.tertiary}
                    keyboardType="url"
                    autoCapitalize="none"
                />
            </View>
        </View>
    );
});
