import { memo } from 'react';
import { View } from 'react-native';
import { UserProductCard } from '@/components/manage';
import { ProductListItem } from '@/types/entities/product';
import { styles } from './styles';

export interface ProductsListProps {
    products: ProductListItem[];
    deletingId: string | null;
    onEdit: (productId: string) => void;
    onDelete: (productId: string, productName: string) => void;
}

export const ProductsList = memo(function ProductsList({
    products,
    deletingId,
    onEdit,
    onDelete,
}: ProductsListProps) {
    return (
        <View style={styles.list}>
            {products.map((product) => (
                <UserProductCard
                    key={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    currency={product.currency}
                    categoryNames={product.categoryNames}
                    categoryIds={product.categoryIds}
                    imageUrl={product.imageUrl}
                    isActive={product.isActive}
                    onEdit={() => onEdit(product.id)}
                    onDelete={() => onDelete(product.id, product.name)}
                    isDeleting={deletingId === product.id}
                />
            ))}
        </View>
    );
});
