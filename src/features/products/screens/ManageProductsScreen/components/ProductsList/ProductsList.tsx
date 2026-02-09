import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { UserProductCard } from '@/components/manage';
import { styles } from './styles';

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  categoryNames: string[];
  categoryIds: string[];
  mainImageUrl?: string | null;
  isActive: boolean;
}

interface ProductsListProps {
  products: Product[];
  deletingId: string | null;
  onEdit: (productId: string) => void;
  onDelete: (productId: string, productName: string) => void;
}

export const ProductsList = memo<ProductsListProps>(function ProductsList({
  products,
  deletingId,
  onEdit,
  onDelete,
}) {
  const colors = useThemedColors();

  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>No tienes productos</Text>
        <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
          Comienza agregando tu primer producto para que los usuarios puedan ver lo que ofreces.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {products.map((product) => (
        <UserProductCard
          key={product.id}
          name={product.name}
          description={product.description ?? undefined}
          price={product.price}
          currency={product.currency}
          categoryNames={product.categoryNames}
          categoryIds={product.categoryIds}
          imageUrl={product.mainImageUrl ?? undefined}
          isActive={product.isActive}
          onEdit={() => onEdit(product.id)}
          onDelete={() => onDelete(product.id, product.name)}
          isDeleting={deletingId === product.id}
        />
      ))}
    </View>
  );
});
