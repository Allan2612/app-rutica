import { memo } from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Award, Store, Heart } from 'lucide-react-native';
import { styles } from './styles';
import type { ThemedColors } from '../../../../../../../../types/entities/premium';

interface TopBusinessHighlightProps {
    colors: ThemedColors;
    topBusiness: {
        businessName: string;
        logoUrl?: string;
        favoriteCount: number;
    };
}

export const TopBusinessHighlight = memo(function TopBusinessHighlight({
    colors,
    topBusiness,
}: TopBusinessHighlightProps) {
    return (
        <View style={[styles.highlightCard, { backgroundColor: colors.background.primary, borderColor: '#fbbf24' }]}>
            <View style={styles.highlightHeader}>
                <Award color="#f59e0b" size={24} strokeWidth={2} />
                <Text style={[styles.highlightTitle, { color: colors.text.primary }]}>
                    Negocio Más Popular
                </Text>
            </View>
            <View style={styles.highlightContent}>
                <View style={[styles.highlightLogo, { backgroundColor: colors.background.secondary }]}>
                    {topBusiness.logoUrl ? (
                        <Image source={{ uri: topBusiness.logoUrl }} style={styles.logoImage} contentFit="cover" />
                    ) : (
                        <Store color={colors.text.tertiary} size={24} strokeWidth={2} />
                    )}
                </View>
                <View style={styles.highlightInfo}>
                    <Text style={[styles.highlightName, { color: colors.text.primary }]} numberOfLines={1}>
                        {topBusiness.businessName}
                    </Text>
                    <View style={styles.highlightStats}>
                        <Heart color="#ef4444" size={14} fill="#ef4444" />
                        <Text style={[styles.highlightCount, { color: colors.text.secondary }]}>
                            {topBusiness.favoriteCount} favoritos
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
});
