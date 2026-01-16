import { memo } from 'react';
import { View, Text } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export const ProductsEmptyState = memo(function ProductsEmptyState() {
    const colors = useThemedColors();

    return (
        <View style={styles.emptyContainer}>
            <View
                style={[
                    styles.emptyIconWrapper,
                    { backgroundColor: colors.background.tertiary },
                ]}
            >
                <ShoppingBag color={colors.text.tertiary} size={40} strokeWidth={1.5} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                No tienes productos
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
                Comienza agregando tu primer producto para que los usuarios puedan ver lo que ofreces.
            </Text>
        </View>
    );
});
