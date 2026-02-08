import { memo } from 'react';
import { View, Text } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { CategoryChips } from '@/components/ui';
import {
    ProductImage,
    ProductPrice,
    ProductStatus,
    ProductActions,
} from '@/components/products';
import { styles } from './styles';

export interface UserProductCardProps {
    name: string;
    description?: string | null;
    price: number;
    currency: string;
    categoryNames: string[];
    categoryIds: string[];
    imageUrl?: string | null;
    isActive: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    isDeleting?: boolean;
}

export const UserProductCard = memo(function UserProductCard({
    name,
    description,
    price,
    currency,
    categoryNames,
    categoryIds,
    imageUrl,
    isActive,
    onEdit,
    onDelete,
    isDeleting = false,
}: UserProductCardProps) {
    const colors = useThemedColors();

    return (
        <View
            style={[
                styles.card,
                { backgroundColor: colors.background.primary, borderColor: colors.border.medium },
            ]}
        >
            <View style={styles.cardContent}>
                {/* Imagen */}
                <ProductImage imageUrl={imageUrl} />

                {/* Info */}
                <View style={styles.info}>
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Text style={[styles.name, { color: colors.text.primary }]} numberOfLines={2}>
                                {name}
                            </Text>

                            {/* Precio */}
                            <ProductPrice price={price} currency={currency} />

                            {/* Categorías */}
                            <CategoryChips
                                categoryNames={categoryNames}
                                categoryIds={categoryIds}
                                maxVisible={2}
                            />
                        </View>

                        {/* Status Badge */}
                        <ProductStatus isActive={isActive} />
                    </View>

                    {/* Descripción */}
                    {description && (
                        <Text style={[styles.description, { color: colors.text.secondary }]} numberOfLines={2}>
                            {description}
                        </Text>
                    )}
                </View>
            </View>

            {/* Acciones */}
            <ProductActions onEdit={onEdit} onDelete={onDelete} isDeleting={isDeleting} />
        </View>
    );
});
