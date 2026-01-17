import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Edit2, Trash2 } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface ProductActionsProps {
    onEdit?: () => void;
    onDelete?: () => void;
    isDeleting?: boolean;
}

export const ProductActions = memo(function ProductActions({
    onEdit,
    onDelete,
    isDeleting = false,
}: ProductActionsProps) {
    const colors = useThemedColors();

    return (
        <View style={[styles.actions, { borderTopColor: colors.border.light }]}>
            <Pressable
                style={({ pressed }) => [
                    styles.actionButton,
                    {
                        backgroundColor: colors.background.tertiary,
                        opacity: pressed ? 0.8 : 1,
                    },
                ]}
                onPress={onEdit}
                disabled={isDeleting}
            >
                <Edit2 color={colors.primary[500]} size={16} strokeWidth={2} />
                <Text style={[styles.actionText, { color: colors.primary[500] }]}>Editar</Text>
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    styles.actionButton,
                    {
                        backgroundColor: colors.background.tertiary,
                        opacity: pressed || isDeleting ? 0.5 : 1,
                    },
                ]}
                onPress={onDelete}
                disabled={isDeleting}
            >
                {isDeleting ? (
                    <ActivityIndicator size="small" color={colors.error} />
                ) : (
                    <>
                        <Trash2 color={colors.error} size={16} strokeWidth={2} />
                        <Text style={[styles.actionText, { color: colors.error }]}>Eliminar</Text>
                    </>
                )}
            </Pressable>
        </View>
    );
});
