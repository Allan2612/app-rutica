import { memo, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Phone, Mail, Globe } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useTrackContactClick } from '@/hooks/useContactClicks';
import { SocialButtons, SocialType } from '../SocialButtons';
import { styles } from './styles';
import type { ContactType } from '@/services/contactClicks.service';

interface ContactSectionProps {
    businessId?: string; // Opcional - solo se trackea si se proporciona
    phone: string | null;
    email: string | null;
    website: string | null;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    onContactPress: (url: string) => void;
}

export const ContactSection = memo(({ businessId, phone, email, website, facebook, instagram, tiktok, onContactPress }: ContactSectionProps) => {
    const themedColors = useThemedColors();
    const { mutate: trackClick } = useTrackContactClick();

    const handleContactPress = useCallback((url: string, contactType: ContactType) => {
        // Registrar el click solo si hay businessId
        if (businessId) {
            trackClick({ businessId, contactType });
        }
        // Ejecutar la acción original
        onContactPress(url);
    }, [businessId, trackClick, onContactPress]);

    const handleSocialPress = useCallback((url: string, socialType?: SocialType) => {
        // Registrar el click solo si hay businessId y socialType
        if (businessId && socialType) {
            trackClick({ businessId, contactType: socialType as ContactType });
        }
        // Ejecutar la acción original
        onContactPress(url);
    }, [businessId, trackClick, onContactPress]);

    const hasContactInfo = phone || email || website || facebook || instagram || tiktok;

    return (
        <View style={styles.contactSection}>
            <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                Contáctenos
            </Text>

            {!hasContactInfo ? (
                <Text style={[styles.noContactText, { color: themedColors.text.secondary }]}>
                    No hay información de contacto disponible
                </Text>
            ) : (
                <View style={styles.contactGrid}>
                    {/* Teléfono */}
                    {phone && (
                        <Pressable
                            style={({ pressed }) => [
                                styles.contactItem,
                                {
                                    backgroundColor: pressed ? themedColors.border.medium : themedColors.background.tertiary,
                                    borderColor: themedColors.border.medium,
                                },
                            ]}
                            onPress={() => handleContactPress(`tel:${phone}`, 'phone')}
                        >
                            <View style={[styles.contactIcon, { backgroundColor: themedColors.primary[50] }]}>
                                <Phone size={18} color={themedColors.primary[500]} />
                            </View>
                            <View style={styles.contactTextContainer}>
                                <Text style={[styles.contactLabel, { color: themedColors.text.tertiary }]}>
                                    Teléfono
                                </Text>
                                <Text style={[styles.contactValue, { color: themedColors.text.primary }]}>
                                    {phone}
                                </Text>
                            </View>
                        </Pressable>
                    )}

                    {/* Email */}
                    {email && (
                        <Pressable
                            style={({ pressed }) => [
                                styles.contactItem,
                                {
                                    backgroundColor: pressed ? themedColors.border.medium : themedColors.background.tertiary,
                                    borderColor: themedColors.border.medium,
                                },
                            ]}
                            onPress={() => handleContactPress(`mailto:${email}`, 'email')}
                        >
                            <View style={[styles.contactIcon, { backgroundColor: themedColors.primary[50] }]}>
                                <Mail size={18} color={themedColors.primary[500]} />
                            </View>
                            <View style={styles.contactTextContainer}>
                                <Text style={[styles.contactLabel, { color: themedColors.text.tertiary }]}>
                                    Correo electrónico
                                </Text>
                                <Text style={[styles.contactValue, { color: themedColors.text.primary }]}>
                                    {email}
                                </Text>
                            </View>
                        </Pressable>
                    )}

                    {/* Website */}
                    {website && (
                        <Pressable
                            style={({ pressed }) => [
                                styles.contactItem,
                                {
                                    backgroundColor: pressed ? themedColors.border.medium : themedColors.background.tertiary,
                                    borderColor: themedColors.border.medium,
                                },
                            ]}
                            onPress={() => handleContactPress(website, 'website')}
                        >
                            <View style={[styles.contactIcon, { backgroundColor: themedColors.primary[50] }]}>
                                <Globe size={18} color={themedColors.primary[500]} />
                            </View>
                            <View style={styles.contactTextContainer}>
                                <Text style={[styles.contactLabel, { color: themedColors.text.tertiary }]}>
                                    Sitio web
                                </Text>
                                <Text style={[styles.contactValue, { color: themedColors.text.primary }]} numberOfLines={1}>
                                    {website}
                                </Text>
                            </View>
                        </Pressable>
                    )}

                </View>
            )}

            {hasContactInfo && (
                <SocialButtons
                    facebook={facebook}
                    instagram={instagram}
                    tiktok={tiktok}
                    onSocialPress={handleSocialPress}
                />
            )}
        </View>
    );
});

ContactSection.displayName = 'ContactSection';
