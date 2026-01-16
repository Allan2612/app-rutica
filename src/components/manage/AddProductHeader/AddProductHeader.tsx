import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface AddProductHeaderProps {
    title: string;
    subtitle: string;
}

export const AddProductHeader = memo<AddProductHeaderProps>(function AddProductHeader({
    title,
    subtitle,
}) {
    const colors = useThemedColors();

    return (
        <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>{title}</Text>
            <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                {subtitle}
            </Text>
        </View>
    );
});
