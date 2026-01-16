import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Phone, Mail, Globe } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface ContactSectionProps {
    phone: string | null;
    email: string | null;
    website: string | null;
    onContactPress: (url: string) => void;
}

export const ContactSection = memo(({ phone, email, website, onContactPress }: ContactSectionProps) => {
    const themedColors = useThemedColors();

    return (
        <View style={styles.contactSection}>
            <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>
                Contáctenos
            </Text>

            <View style={styles.contactGrid}>
                {/* Teléfono */}
                {phone && (
                    <Pressable
                        style={({ pressed }) => [
                            styles.contactItem,
                            {
                                backgroundColor: pressed ? themedColors.background.secondary : themedColors.background.primary,
                                borderColor: themedColors.border.medium,
                            },
                        ]}
                        onPress={() => onContactPress(`tel:${phone}`)}
                    >
                        <View style={[styles.contactIcon, { backgroundColor: themedColors.primary[50] }]}>
                            <Phone size={22} color={themedColors.primary[500]} />
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
                                backgroundColor: pressed ? themedColors.background.secondary : themedColors.background.primary,
                                borderColor: themedColors.border.medium,
                            },
                        ]}
                        onPress={() => onContactPress(`mailto:${email}`)}
                    >
                        <View style={[styles.contactIcon, { backgroundColor: themedColors.primary[50] }]}>
                            <Mail size={22} color={themedColors.primary[500]} />
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
                                backgroundColor: pressed ? themedColors.background.secondary : themedColors.background.primary,
                                borderColor: themedColors.border.medium,
                            },
                        ]}
                        onPress={() => onContactPress(website)}
                    >
                        <View style={[styles.contactIcon, { backgroundColor: themedColors.primary[50] }]}>
                            <Globe size={22} color={themedColors.primary[500]} />
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
        </View>
    );
});

ContactSection.displayName = 'ContactSection';
