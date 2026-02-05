import { memo } from 'react';
import { View, Text } from 'react-native';
import { Award, MousePointerClick } from 'lucide-react-native';
import { styles } from './styles';
import { CONTACT_ICONS, CONTACT_COLORS } from '@/styles/premium-section-styles';
import type { ContactType } from '@/services/contactClicks.service';
import type { ThemedColors } from '../../../../../../../../types/entities/premium';

interface TopContactHighlightProps {
    colors: ThemedColors;
    topContactType: {
        contactType: ContactType;
        count: number;
        shortLabel: string;
    };
}

export const TopContactHighlight = memo(function TopContactHighlight({
    colors,
    topContactType,
}: TopContactHighlightProps) {
    const IconComponent = CONTACT_ICONS[topContactType.contactType];
    const iconColor = CONTACT_COLORS[topContactType.contactType];

    return (
        <View style={[styles.highlightCard, { backgroundColor: colors.background.primary, borderColor: '#fbbf24' }]}>
            <View style={styles.highlightHeader}>
                <Award color="#f59e0b" size={24} strokeWidth={2} />
                <Text style={[styles.highlightTitle, { color: colors.text.primary }]}>Canal Más Popular</Text>
            </View>
            <View style={styles.highlightContent}>
                <View style={[styles.highlightLogo, { backgroundColor: `${iconColor}20` }]}>
                    <IconComponent color="#ffffff" size={32} strokeWidth={2} />
                </View>
                <View style={styles.highlightInfo}>
                    <Text style={[styles.highlightName, { color: colors.text.primary }]} numberOfLines={1}>
                        {topContactType.shortLabel}
                    </Text>
                    <View style={styles.highlightStats}>
                        <MousePointerClick color="#ffffff" size={14} strokeWidth={2} />
                        <Text style={[styles.highlightCount, { color: colors.text.secondary }]}>
                            {topContactType.count} clicks
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
});
