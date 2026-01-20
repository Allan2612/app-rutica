import { memo, useState } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { ProductImageCarousel } from '../ProductImageCarousel';
import { styles } from './styles';

interface ProductCardProps {
    name: string;
    description?: string | null;
    price: number;
    currency: string;
    imageUrl?: string | null;
    imageUrls?: string[];
    onImagePress?: (imageUrl: string) => void;
}

const formatPrice = (value: number, curr: string): string => {
    if (curr === 'CRC') return `₡${value.toLocaleString('es-CR')}`;
    if (curr === 'USD') return `$${value.toFixed(2)}`;
    return `${curr} ${value}`;
};

export const ProductCard = memo(function ProductCard({
    name,
    description,
    price,
    currency,
    imageUrl,
    imageUrls = [],
    onImagePress,
}: ProductCardProps) {
    const colors = useThemedColors();
    const [cardWidth, setCardWidth] = useState(0);

    const images = imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [];

    const onLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setCardWidth(width);
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.background.primary, borderColor: colors.border.medium }]}>
            <ProductImageCarousel images={images} cardWidth={cardWidth} onLayout={onLayout} onImagePress={onImagePress} />

            <View style={styles.content}>
                <Text style={[styles.name, { color: colors.text.primary }]} numberOfLines={1}>
                    {name}
                </Text>

                {description && (
                    <Text style={[styles.description, { color: colors.text.secondary }]} numberOfLines={2}>
                        {description}
                    </Text>
                )}

                <Text style={[styles.price, { color: colors.primary[500] }]}>
                    {formatPrice(price, currency)}
                </Text>
            </View>
        </View>
    );
});
