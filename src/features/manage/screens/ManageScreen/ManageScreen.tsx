import { View, ActivityIndicator } from 'react-native';
import { useAuthUser } from '../../../../hooks';
import { BuyerManageScreen } from './roles/BuyerManageScreen';
import { SellerManageScreen } from './roles/SellerManageScreen';
import { AdminManageScreen } from './roles/AdminManageScreen';
import { NoAuthManageScreen } from './roles/NoAuthManageScreen';
import { colors } from '@/styles/theme/colors';

export function ManageScreen() {
    const { role, isAuthenticated, isLoading } = useAuthUser();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.light.background }}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <NoAuthManageScreen />;
    }

    switch (role) {
        case 'buyer':
            return <BuyerManageScreen />;
        case 'seller':
            return <SellerManageScreen />;
        case 'admin':
            return <AdminManageScreen />;
    }
}
