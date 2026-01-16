import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Plus, Store, ArrowLeft } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface ProductsHeaderProps {
    businessName?: string;
    onBack: () => void;
    onAdd: () => void;
}

export const ProductsHeader = memo(function ProductsHeader({
    businessName,
    onBack,
    onAdd,
}: ProductsHeaderProps) {
    const colors = useThemedColors();

    return (
        <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
            <Pressable style={styles.businessInfo} onPress={onBack}>
                <ArrowLeft color={colors.text.secondary} size={20} strokeWidth={2} />
                <Store color={colors.text.secondary} size={18} strokeWidth={2} />
                <Text style={[styles.businessName, { color: colors.text.secondary }]} numberOfLines={1}>
                    {businessName || 'Negocio'}
                </Text>
            </Pressable>

            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                Mis Productos
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                Administra los productos de tu negocio. Puedes crear, editar y eliminar productos.
            </Text>

            {/* Botón Agregar */}
            <Pressable
                style={({ pressed }) => [
                    styles.addButton,
                    { backgroundColor: colors.primary[500], opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={onAdd}
            >
                <Plus color="#fff" size={20} strokeWidth={2.5} />
                <Text style={[styles.addButtonText, { color: '#fff' }]}>Agregar Producto</Text>
            </Pressable>
        </View>
    );
});
