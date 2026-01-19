import { memo } from 'react';
import { View, Text, Image, Pressable, Platform, Linking } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { getCategoryColorScheme } from '@/utils/categoryColors';
import { styles } from './styles';

interface BusinessHeaderProps {
    name: string;
    description: string | null;
    categoryNames: string[];
    categoryIds: string[];
    locationLabel: string | null;
    latitude?: number | null;
    longitude?: number | null;
    isApproved?: boolean;
}

export const BusinessHeader = memo(({ name, description, categoryNames, categoryIds, locationLabel, latitude, longitude, isApproved = false }: BusinessHeaderProps) => {
    const themedColors = useThemedColors();

    const handleLocationPress = () => {
        if (latitude && longitude) {
            const encodedLabel = encodeURIComponent(locationLabel ?? name);
            const url = Platform.select({
                ios: `http://maps.apple.com/?q=${encodedLabel}&ll=${latitude},${longitude}`,
                android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedLabel})`,
                default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
            });
            Linking.openURL(url!);
        }
    };

    return (
        <View style={styles.header}>
            <View style={styles.infoSection}>
                <View style={styles.nameRow}>
                    <Text style={[styles.name, { color: themedColors.text.primary }]}>{name}</Text>
                    {isApproved && (
                        <Image
                            source={require('../../../../assets/verification.png')}
                            style={styles.verificationIcon}
                            resizeMode="contain"
                        />
                    )}
                </View>

                {description && (
                    <Text style={[styles.description, { color: themedColors.text.primary }]}>
                        {description}
                    </Text>
                )}

                {/* Categorías */}
                {categoryNames.length > 0 && (
                    <View style={styles.categoriesRow}>
                        {categoryNames.map((catName, index) => {
                            const categoryColor = getCategoryColorScheme(categoryIds[index]);
                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.categoryChip,
                                        { backgroundColor: categoryColor.backgroundColor },
                                    ]}
                                >
                                    <Text style={[styles.categoryText, { color: categoryColor.textColor }]}>
                                        {catName}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Ubicación */}
                {locationLabel && (
                    <Pressable
                        style={({ pressed }) => [
                            styles.locationRow,
                            { opacity: pressed ? 0.7 : 1 }
                        ]}
                        onPress={handleLocationPress}
                        disabled={!latitude || !longitude}
                    >
                        <MapPin size={18} color={themedColors.text.primary} />
                        <Text style={[styles.locationText, { color: themedColors.text.primary }]}>
                            {locationLabel}
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
});

BusinessHeader.displayName = 'BusinessHeader';
