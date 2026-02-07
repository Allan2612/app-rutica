import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { BackButton } from '@/components/ui';
import { styles } from './styles';

interface HeaderProps {
    title?: string;
    subtitle?: string;
}

export const Header = memo<HeaderProps>(function Header({
    title = 'Mis Productos',
    subtitle = 'Administra los productos de tu negocio. Puedes crear, editar y eliminar productos.'
}) {
    const colors = useThemedColors();

    return (
        <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
            <BackButton />
            <View style={styles.headerContent}>
                <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                    {title}
                </Text>
                <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                    {subtitle}
                </Text>
            </View>
        </View>
    );
});
