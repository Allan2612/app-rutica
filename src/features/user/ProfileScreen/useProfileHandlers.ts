import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

export function useProfileHandlers(setPremiumRefreshKey: (fn: (prev: number) => number) => void) {
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

    const handleOpenEdit = useCallback(() => {
        setIsEditModalVisible(true);
    }, []);

    const handleCloseEdit = useCallback(() => {
        setIsEditModalVisible(false);
    }, []);

    const handleOpenPremiumModal = useCallback(() => {
        setIsPremiumModalVisible(true);
    }, []);

    const handleClosePremiumModal = useCallback(() => {
        setIsPremiumModalVisible(false);
    }, []);

    const handlePremiumSuccess = useCallback((planNames: string, planCount: number) => {
        setPremiumRefreshKey(prev => prev + 1);
        Toast.show({
            type: 'success',
            text1: '¡Bienvenido a Premium!',
            text2: `${planNames} será${planCount > 1 ? 'n' : ''} activado${planCount > 1 ? 's' : ''} una vez verificado el pago`,
            position: 'top',
            visibilityTime: 5000,
            topOffset: 50,
            autoHide: true,
        });
    }, [setPremiumRefreshKey]);

    const handlePremiumInfo = useCallback((title: string, message: string) => {
        Toast.show({
            type: 'info',
            text1: title,
            text2: message,
            position: 'top',
            visibilityTime: 4000,
            topOffset: 50,
            autoHide: true,
        });
    }, []);

    const handleBack = useCallback(() => {
        router.back();
    }, []);

    return {
        isEditModalVisible,
        isPremiumModalVisible,
        handleOpenEdit,
        handleCloseEdit,
        handleOpenPremiumModal,
        handleClosePremiumModal,
        handlePremiumSuccess,
        handlePremiumInfo,
        handleBack,
    };
}
