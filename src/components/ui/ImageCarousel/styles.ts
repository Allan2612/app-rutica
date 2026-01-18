import { StyleSheet, Dimensions, Platform } from 'react-native';
import { spacing } from '@/styles/theme';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
    },
    image: {
        aspectRatio: 16 / 9,
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -20 }],
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    navButtonLeft: {
        left: spacing.sm,
    },
    navButtonRight: {
        right: spacing.sm,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: spacing.sm,
        left: 0,
        right: 0,
        gap: spacing.xs,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    activeIndicator: {
        backgroundColor: '#FFFFFF',
    },
    placeholder: {
        aspectRatio: 16 / 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
