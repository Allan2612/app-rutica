import { memo, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useThemedColors, useProductQuota } from '@/hooks';
import { useBusinessProducts } from '@/features/products/hooks';
import { useBusinessById } from '@/features/business/hooks';
import { useProfile } from '@/features/user/hooks';
import { ConfirmDeleteDialog } from '@/components/manage';
import { PremiumModal } from '@/components/user';
import { Header, QuotaInfo, LimitBanner, AddProductButton, ProductsList } from './components';
import { useManageProductsHandlers } from './hooks';
import { styles } from './styles';

export const ManageProductsScreen = memo(function ManageProductsScreen() {
    const colors = useThemedColors();
    const { id: businessId } = useLocalSearchParams<{ id: string }>();

    const { data: products = [], isLoading, refetch: refetchProducts } = useBusinessProducts(businessId || '');
    const { data: business } = useBusinessById(businessId || '');
    const { quotaInfo, invalidateQuota } = useProductQuota(businessId || '');
    const { profile } = useProfile();

    const businessName = business?.name || '';
    const canAddProduct = quotaInfo?.canAdd ?? true;
    const hasReachedLimit = quotaInfo && !quotaInfo.canAdd;

    const {
        deletingId,
        deleteDialog,
        isPremiumModalVisible,
        setDeleteDialog,
        handleAddProduct,
        handleBuyPackage,
        handleClosePremiumModal,
        handlePremiumSuccess,
        handleEditProduct,
        handleDeleteProduct,
        handleConfirmDelete,
    } = useManageProductsHandlers({ businessId: businessId || '', canAddProduct, invalidateQuota });

    useFocusEffect(
        useCallback(() => {
            invalidateQuota();
            refetchProducts();
        }, [invalidateQuota, refetchProducts])
    );

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                    <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                        Cargando productos...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Header />

                {quotaInfo && <QuotaInfo quotaInfo={quotaInfo} />}

                {hasReachedLimit && quotaInfo && <LimitBanner quotaInfo={quotaInfo} />}

                <AddProductButton
                    hasReachedLimit={hasReachedLimit ?? false}
                    onAddProduct={handleAddProduct}
                    onBuyPackage={handleBuyPackage}
                />

                <ProductsList
                    products={products}
                    deletingId={deletingId}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                />
            </ScrollView>

            <ConfirmDeleteDialog
                visible={!!deleteDialog}
                entityName={deleteDialog?.name || ''}
                entityType="producto"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteDialog(null)}
                isDeleting={!!deletingId}
            />

            <PremiumModal
                visible={isPremiumModalVisible}
                onClose={handleClosePremiumModal}
                onSuccess={handlePremiumSuccess}
                userRole={profile?.role_prf || null}
                initialPlan="package_products"
                preSelectedBusinessId={businessId}
                preSelectedBusinessName={businessName}
            />
        </View>
    );
});
