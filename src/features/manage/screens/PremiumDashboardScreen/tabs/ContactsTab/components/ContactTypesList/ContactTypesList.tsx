import { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { CONTACT_ICONS, CONTACT_COLORS } from '@/styles/premium-section-styles';
import type { ContactType } from '@/services/contactClicks.service';
import type { ThemedColors } from '../../../../../../../../types/entities/premium';

interface ClickByType {
    contactType: ContactType;
    count: number;
    shortLabel: string;
}

interface ContactTypesListProps {
    colors: ThemedColors;
    clicksByType: ClickByType[];
}

export const ContactTypesList = memo(function ContactTypesList({
    colors,
    clicksByType,
}: ContactTypesListProps) {
    if (clicksByType.length === 0) return null;

    return (
        <View style={styles.listSection}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Detalle por Canal</Text>
            <View style={styles.contactTypesList}>
                {clicksByType.map((item) => {
                    const IconComponent = CONTACT_ICONS[item.contactType];
                    const iconColor = CONTACT_COLORS[item.contactType];
                    const isTikTok = item.contactType === 'tiktok';
                    return (
                        <View key={item.contactType} style={[styles.contactTypeCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
                            <View style={[styles.contactTypeIcon, { backgroundColor: `${iconColor}20` }]}>
                                <IconComponent color={isTikTok ? '#ffffff' : iconColor} size={20} strokeWidth={2} />
                            </View>
                            <View style={styles.contactTypeInfo}>
                                <Text style={[styles.contactTypeName, { color: colors.text.primary }]}>{item.shortLabel}</Text>
                            </View>
                            <View style={styles.contactTypeCount}>
                                <Text style={[styles.contactTypeValue, { color: isTikTok ? '#ffffff' : iconColor }]}>{item.count}</Text>
                                <Text style={[styles.contactTypeLabel, { color: colors.text.secondary }]}>clicks</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
});
