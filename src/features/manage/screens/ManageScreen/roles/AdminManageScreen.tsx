import { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

export const AdminManageScreen = memo(function AdminManageScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>⚙️ Administración</Text>
            <Text style={styles.subtitle}>Administrador</Text>
        </View>
    );
});
