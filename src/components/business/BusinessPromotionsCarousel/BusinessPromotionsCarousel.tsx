import { memo, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useThemedColors } from '@/hooks';
import { useBusinessPromotions } from '@/features/promotions/hooks';
import { PromotionPublicCard } from '@/components/promotions';
import { GenericCarousel } from '@/components/ui';
import { styles } from './styles';

interface BusinessPromotionsCarouselProps {
    businessId: string;
    onPromotionPress?: (promotionId: string) => void;
}

export const BusinessPromotionsCarousel = memo(function BusinessPromotionsCarousel({
    businessId,
    onPromotionPress,
}: BusinessPromotionsCarouselProps) {
    const colors = useThemedColors();
    const { data: promotions = [], isLoading } = useBusinessPromotions(businessId);

    // Filtrar solo promociones activas, aprobadas y pagadas
    const activePromotions = useMemo(() => {
        const now = new Date();
        return promotions.filter(promo => {
            if (promo.moderationStatus !== 'approved' || promo.paymentState !== 'paid') {
                return false;
            }
            
            const startDate = new Date(promo.startAt);
            const endDate = new Date(promo.endAt);
            
            return now >= startDate && now <= endDate;
        });
    }, [promotions]);

    const handlePress = (promotion: any) => {
        if (onPromotionPress) {
            onPromotionPress(promotion.id);
        }
    };

    // Si no hay promociones activas, no mostrar nada
    if (!isLoading && activePromotions.length === 0) {
        return null;
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                    Promociones Activas
                </Text>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                    Promociones
                </Text>
            </View>

            <GenericCarousel
                items={activePromotions}
                renderItem={(promotion) => (
                    <PromotionPublicCard
                        promotion={promotion}
                        onPress={onPromotionPress ? () => handlePress(promotion) : undefined}
                    />
                )}
                showNavigation={true}
                showIndicators={true}
            />
        </View>
    );
});
