import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface ProductStatusProps {
    isActive: boolean;
}

export const ProductStatus = memo(function ProductStatus({ isActive }: ProductStatusProps) {
    const colors = useThemedColors();

    return (
        <View
            style={[
                styles.statusBadge,
                { backgroundColor: isActive ? colors.success + '20' : colors.error + '20' }
            ]}
        >
            <Text
                style={[
                    styles.statusText,
                    { color: isActive ? colors.success : colors.error }
                ]}
            >
                {isActive ? 'Activo' : 'Inactivo'}
            </Text>
        </View>
    );
});
