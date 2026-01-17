import { memo } from 'react';
import { View, Text, Image } from 'react-native';
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
    isApproved?: boolean;
}

export const BusinessHeader = memo(({ name, description, categoryNames, categoryIds, locationLabel, isApproved = false }: BusinessHeaderProps) => {
    const themedColors = useThemedColors();

    return (
        <View style={styles.header}>
            <View style={styles.infoSection}>
                <View style={styles.nameRow}>
                    <Text style={[styles.name, { color: '#FFFFFF' }]}>{name}</Text>
                    {isApproved && (
                        <Image
                            source={require('../../../../assets/verification.png')}
                            style={styles.verificationIcon}
                            resizeMode="contain"
                        />
                    )}
                </View>

                {description && (
                    <Text style={[styles.description, { color: '#FFFFFF' }]}>
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
                    <View style={styles.locationRow}>
                        <MapPin size={18} color="#FFFFFF" />
                        <Text style={[styles.locationText, { color: '#FFFFFF' }]}>
                            {locationLabel}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
});

BusinessHeader.displayName = 'BusinessHeader';
