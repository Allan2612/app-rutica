import { StyleSheet, Dimensions, Platform } from 'react-native';
import { spacing, typography } from '@/styles/theme';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const MAX_WIDTH = isWeb ? 500 : width - 48;
const CAROUSEL_WIDTH = Math.min(width - 48, MAX_WIDTH);
const IMAGE_WIDTH = CAROUSEL_WIDTH - 48;

export const styles = StyleSheet.create({
    gallerySection: {
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
        ...(isWeb && { alignItems: 'center' }),
    },
    carouselContainer: {
        alignItems: 'center',
    },
    imageContainer: {
        width: IMAGE_WIDTH,
        height: 220,
        marginHorizontal: 24,
        borderRadius: 16,
        overflow: 'hidden',
    },
    carouselImage: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    sectionTitle: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        marginBottom: spacing.lg,
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    carouselWrapper: {
        position: 'relative',
        ...(isWeb && {
            width: CAROUSEL_WIDTH,
            alignSelf: 'center',
        }),
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        marginTop: -20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    navButtonLeft: {
        left: isWeb ? 28 : 1,
    },
    navButtonRight: {
        right: isWeb ? 28 : -15,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.md,
        gap: spacing.xs,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    activeIndicator: {
        backgroundColor: '#FFFFFF',
        width: 24,
    },
});
