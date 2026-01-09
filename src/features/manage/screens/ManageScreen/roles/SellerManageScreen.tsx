import { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

export const SellerManageScreen = memo(function SellerManageScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🏪 Mi Negocio</Text>
            <Text style={styles.subtitle}>Vendedor</Text>
        </View>
    );
});
