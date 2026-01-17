import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Facebook, Instagram } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { colors as themeColors } from '@/styles/theme';
import { TikTokIcon } from '../TikTokIcon';
import { styles } from './styles';

interface SocialLinksSectionProps {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    onSocialPress: (url: string) => void;
}

export const SocialLinksSection = memo(({ facebook, instagram, tiktok, onSocialPress }: SocialLinksSectionProps) => {
    const colors = useThemedColors();

    if (!facebook && !instagram && !tiktok) {
        return null;
    }

    return (
        <View style={styles.socialSection}>
            <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>
                Redes Sociales
            </Text>
            <View style={styles.socialLinksRow}>
                {facebook && (
                    <Pressable
                        style={({ pressed }) => [
                            styles.socialButton,
                            {
                                backgroundColor: colors.background.primary,
                                borderColor: themeColors.social.facebook,
                                opacity: pressed ? 0.7 : 1,
                            },
                        ]}
                        onPress={() => onSocialPress(facebook)}
                    >
                        <Facebook size={32} color={themeColors.social.facebook} strokeWidth={1.5} />
                    </Pressable>
                )}

                {instagram && (
                    <Pressable
                        style={({ pressed }) => [
                            styles.socialButton,
                            {
                                backgroundColor: colors.background.primary,
                                borderColor: themeColors.social.instagram,
                                opacity: pressed ? 0.7 : 1,
                            },
                        ]}
                        onPress={() => onSocialPress(instagram)}
                    >
                        <Instagram size={32} color={themeColors.social.instagram} strokeWidth={1.5} />
                    </Pressable>
                )}

                {tiktok && (
                    <Pressable
                        style={({ pressed }) => [
                            styles.socialButton,
                            {
                                borderColor: themeColors.social.tiktok,
                                opacity: pressed ? 0.7 : 1,
                            },
                        ]}
                        onPress={() => onSocialPress(tiktok)}
                    >
                        <TikTokIcon size={32} color={colors.text.primary} />
                    </Pressable>
                )}
            </View>
        </View>
    );
});

SocialLinksSection.displayName = 'SocialLinksSection';
