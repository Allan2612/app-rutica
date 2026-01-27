import { memo } from 'react';
import { View, Text } from 'react-native';
import { PartyPopper } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { getInitials, getTimeAgo } from './helpers';
import { styles } from './styles';

interface EventPostHeaderProps {
    authorName?: string | null;
    createdAt?: string;
}

export const EventPostHeader = memo(function EventPostHeader({
    authorName,
    createdAt,
}: EventPostHeaderProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.header}>
            <View style={[styles.avatar, { backgroundColor: colors.primary[100] }]}>
                {authorName ? (
                    <Text style={[styles.avatarText, { color: colors.primary[700] }]}>
                        {getInitials(authorName)}
                    </Text>
                ) : (
                    <PartyPopper size={20} color={colors.primary[600]} />
                )}
            </View>
            <View style={styles.headerInfo}>
                <Text style={[styles.authorName, { color: colors.text.primary }]}>
                    {authorName ?? 'Rutica'}
                </Text>
                <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                    {createdAt ? getTimeAgo(createdAt) : ''}
                </Text>
            </View>
        </View>
    );
});
