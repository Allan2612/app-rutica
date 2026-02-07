import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import { Plus, ShoppingBag } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface AddProductButtonProps {
    hasReachedLimit: boolean;
    onAddProduct: () => void;
    onBuyPackage: () => void;
}

export const AddProductButton = memo<AddProductButtonProps>(function AddProductButton({
    hasReachedLimit,
    onAddProduct,
    onBuyPackage
}) {
    const colors = useThemedColors();

    if (hasReachedLimit) {
        return (
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: colors.primary[500], opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={onBuyPackage}
            >
                <ShoppingBag color="#fff" size={20} strokeWidth={2.5} />
                <Text style={[styles.buttonText, { color: '#fff' }]}>
                    Adquirir Paquete de Productos
                </Text>
            </Pressable>
        );
    }

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                { backgroundColor: colors.primary[500], opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={onAddProduct}
        >
            <Plus color="#fff" size={20} strokeWidth={2.5} />
            <Text style={[styles.buttonText, { color: '#fff' }]}>
                Agregar Producto
            </Text>
        </Pressable>
    );
});
