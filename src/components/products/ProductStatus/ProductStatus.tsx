import { memo } from 'react';
import { View, Text } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface ProductStatusProps {
    isActive: boolean;
}

export const ProductStatus = memo(function ProductStatus({ isActive }: ProductStatusProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.statusContainer}>
            {isActive ? (
                <Eye size={20} color={colors.success} strokeWidth={2} />
            ) : (
                <EyeOff size={20} color={colors.text.tertiary} strokeWidth={2} />
            )}
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
        </View>
    );
});
