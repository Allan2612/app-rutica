import { memo } from 'react';
import { View, Text } from 'react-native';
import { MousePointerClick, Phone } from 'lucide-react-native';
import { styles } from './styles';
import { CONTACT_ICONS, CONTACT_COLORS } from '@/styles/premium-section-styles';
import type { ContactType } from '@/services/contactClicks.service';
import type { ThemedColors } from '../../../../../../../../types/entities/premium';

interface TopContactType {
    contactType: ContactType;
    count: number;
    label: string;
}

interface ContactsSummaryCardsProps {
    colors: ThemedColors;
    totalClicks: number;
    topContactType?: TopContactType;
    channelsCount: number;
}

export const ContactsSummaryCards = memo(function ContactsSummaryCards({
    colors,
    totalClicks,
    topContactType,
    channelsCount,
}: ContactsSummaryCardsProps) {
    return (
        <View style={styles.summaryGrid}>
            <View style={[styles.summaryCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
                <View style={[styles.summaryIconContainer, { backgroundColor: '#ede9fe' }]}>
                    <MousePointerClick color="#8b5cf6" size={20} strokeWidth={2} />
                </View>
                <Text style={[styles.summaryValue, { color: colors.text.primary }]}>
                    {totalClicks}
                </Text>
                <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Total Clicks</Text>
            </View>

            {topContactType && (
                <View style={[styles.summaryCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
                    <View style={[styles.summaryIconContainer, { backgroundColor: `${CONTACT_COLORS[topContactType.contactType]}20` }]}>
                        {(() => {
                            const IconComponent = CONTACT_ICONS[topContactType.contactType];
                            const isTikTok = topContactType.contactType === 'tiktok';
                            return <IconComponent color={isTikTok ? '#ffffff' : CONTACT_COLORS[topContactType.contactType]} size={20} strokeWidth={2} />;
                        })()}
                    </View>
                    <Text style={[styles.summaryValue, { color: colors.text.primary }]}>
                        {topContactType.count}
                    </Text>
                    <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
                        {topContactType.label}
                    </Text>
                </View>
            )}

            <View style={[styles.summaryCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
                <View style={[styles.summaryIconContainer, { backgroundColor: '#dbeafe' }]}>
                    <Phone color="#3b82f6" size={20} strokeWidth={2} />
                </View>
                <Text style={[styles.summaryValue, { color: colors.text.primary }]}>
                    {channelsCount}
                </Text>
                <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Canales</Text>
            </View>
        </View>
    );
});
