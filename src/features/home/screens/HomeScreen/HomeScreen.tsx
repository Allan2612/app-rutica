/**
 * HomeScreen
 * Main landing screen of the Rutica app
 * Features: Hero welcome, quick actions, promotions carousel, featured business
 */

import { memo, useCallback } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator, Text, Pressable } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useHomeData } from '../../hooks/useHomeData';
import { 
    HeroWelcome, 
    QuickActions, 
    FeaturedPromotions, 
    CallToAction 
} from '../../components';
import { styles } from './styles';

export const HomeScreen = memo(function HomeScreen() {
    const colors = useThemedColors();
    const { 
        promotions, 
        stats, 
        isLoading, 
        isError, 
        refetch 
    } = useHomeData();


    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const isRefreshing = promotions.isFetching || stats.isFetching;

    // Initial loading state
    if (isLoading && !promotions.data && !stats.data) {
        return (
            <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background.primary }]}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    // Error state
    if (isError && !promotions.data && !stats.data) {
        return (
            <View style={[styles.container, styles.errorContainer, { backgroundColor: colors.background.primary }]}>
                <AlertTriangle size={48} color={colors.error} strokeWidth={1.5} />
                <Text style={[styles.errorText, { color: colors.text.secondary }]}>
                    No pudimos cargar el contenido. Por favor, intenta de nuevo.
                </Text>
                <Pressable
                    style={[styles.retryButton, { backgroundColor: colors.primary[500] }]}
                    onPress={handleRefresh}
                >
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </Pressable>
            </View>
        );
    }

    const statsData = stats.data ?? { businessCount: 0, eventCount: 0, attractionCount: 0, promotionCount: 0 };

    return (
        <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={[colors.primary[500]]}
                        tintColor={colors.primary[500]}
                    />
                }
            >
                {/* Hero Welcome Section */}
                <HeroWelcome
                    businessCount={statsData.businessCount}
                    eventCount={statsData.eventCount}
                    attractionCount={statsData.attractionCount}
                />

                {/* Quick Navigation Actions */}
                <QuickActions />

                {/* Featured Promotions Carousel */}
                <FeaturedPromotions
                    promotions={promotions.data ?? []}
                    isLoading={promotions.isLoading}
                />

                {/* Call to Action for Non-Sellers */}
                <CallToAction />
            </ScrollView>
        </View>
    );
});
