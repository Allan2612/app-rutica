import { StyleSheet, Dimensions, Platform } from 'react-native';
import { spacing, typography } from '@/styles/theme';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const MAX_WIDTH = isWeb ? 500 : width - 48;
const IMAGE_WIDTH = Math.min(width - 96, MAX_WIDTH);

export const styles = StyleSheet.create({
    gallerySection: {
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
        ...(isWeb && { alignItems: 'center' }),
    },
    imageContainer: {
        width: IMAGE_WIDTH,
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
    },
    image: {
        width: IMAGE_WIDTH,
        height: 280,
        borderRadius: 16,
    },
    sectionTitle: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        marginBottom: spacing.lg,
        textAlign: 'center',
        letterSpacing: -0.3,
    },
});
