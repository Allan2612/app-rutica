import { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

export const BuyerManageScreen = memo(function BuyerManageScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mi Perfil</Text>
            <Text style={styles.subtitle}>Comprador</Text>
        </View>
    );
});
