import { memo } from 'react';
import { View, Pressable } from 'react-native';
import { Facebook, Instagram } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { colors as themeColors } from '@/styles/theme';
import { TikTokIcon } from '../TikTokIcon';
import { styles } from './styles';

export type SocialType =
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'whatsapp'
  | 'youtube'
  | 'twitter'
  | 'linkedin';

interface SocialButtonsProps {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  onSocialPress: (url: string, socialType?: SocialType) => void;
}

export const SocialButtons = memo(function SocialButtons({
  facebook,
  instagram,
  tiktok,
  onSocialPress,
}: SocialButtonsProps) {
  const colors = useThemedColors();

  const hasSocialLinks = facebook || instagram || tiktok;

  if (!hasSocialLinks) {
    return null;
  }

  return (
    <View style={styles.socialLinksContainer}>
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
            onPress={() => onSocialPress(facebook, 'facebook')}
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
            onPress={() => onSocialPress(instagram, 'instagram')}
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
            onPress={() => onSocialPress(tiktok, 'tiktok')}
          >
            <TikTokIcon size={32} color={colors.text.primary} />
          </Pressable>
        )}
      </View>
    </View>
  );
});
