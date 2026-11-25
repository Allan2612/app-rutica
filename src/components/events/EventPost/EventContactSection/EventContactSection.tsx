import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Phone, Mail, Globe, Facebook, Instagram } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { TikTokIcon } from '@/components/ui';
import { extractSocialUsername } from '../helpers';
import { styles } from '../styles';
import {
  openSafeUrl,
  toSafeMailtoUrl,
  toSafeSocialUrl,
  toSafeTelUrl,
  toSafeWebsiteUrl,
} from '@/utils/externalLinks';

interface EventContactSectionProps {
  contactPhone?: string | null;
  contactEmail?: string | null;
  website?: string | null;
  socialLinks?: Record<string, string> | null;
}

export const EventContactSection = memo(function EventContactSection({
  contactPhone,
  contactEmail,
  website,
  socialLinks,
}: EventContactSectionProps) {
  const colors = useThemedColors();
  const hasSocialLinks = socialLinks && Object.keys(socialLinks).length > 0;

  if (!contactPhone && !contactEmail && !website && !hasSocialLinks) return null;

  return (
    <View style={styles.contactSection}>
      {contactPhone && (
        <Pressable
          style={styles.contactRow}
          onPress={() => openSafeUrl(toSafeTelUrl(contactPhone))}
        >
          <Phone size={14} color={colors.primary[500]} />
          <Text style={[styles.contactText, { color: colors.primary[500] }]}>{contactPhone}</Text>
        </Pressable>
      )}
      {socialLinks?.facebook && (
        <Pressable
          style={styles.contactRow}
          onPress={() => openSafeUrl(toSafeSocialUrl(socialLinks.facebook, 'facebook'))}
        >
          <Facebook size={14} color="#1877F2" />
          <Text style={[styles.contactText, { color: '#1877F2' }]} numberOfLines={1}>
            {extractSocialUsername(socialLinks.facebook)}
          </Text>
        </Pressable>
      )}
      {website && (
        <Pressable style={styles.contactRow} onPress={() => openSafeUrl(toSafeWebsiteUrl(website))}>
          <Globe size={14} color={colors.primary[500]} />
          <Text style={[styles.contactText, { color: colors.primary[500] }]} numberOfLines={1}>
            {website.replace(/^https?:\/\//, '')}
          </Text>
        </Pressable>
      )}
      {socialLinks?.instagram && (
        <Pressable
          style={styles.contactRow}
          onPress={() => openSafeUrl(toSafeSocialUrl(socialLinks.instagram, 'instagram'))}
        >
          <Instagram size={14} color="#E4405F" />
          <Text style={[styles.contactText, { color: '#E4405F' }]} numberOfLines={1}>
            {extractSocialUsername(socialLinks.instagram)}
          </Text>
        </Pressable>
      )}
      {contactEmail && (
        <Pressable
          style={styles.contactRow}
          onPress={() => openSafeUrl(toSafeMailtoUrl(contactEmail))}
        >
          <Mail size={14} color={colors.primary[500]} />
          <Text style={[styles.contactText, { color: colors.primary[500] }]}>{contactEmail}</Text>
        </Pressable>
      )}
      {socialLinks?.tiktok && (
        <Pressable
          style={styles.contactRow}
          onPress={() => openSafeUrl(toSafeSocialUrl(socialLinks.tiktok, 'tiktok'))}
        >
          <TikTokIcon size={14} color={colors.text.primary} />
          <Text style={[styles.contactText, { color: colors.text.primary }]} numberOfLines={1}>
            {extractSocialUsername(socialLinks.tiktok)}
          </Text>
        </Pressable>
      )}
    </View>
  );
});
