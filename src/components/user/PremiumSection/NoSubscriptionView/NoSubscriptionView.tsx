import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import type { ThemedColors } from '@/types/entities/premium';
import { styles } from './styles';

interface NoSubscriptionViewProps {
    onSubscribePress: () => void;
    colors: ThemedColors;
}

export const NoSubscriptionView = memo(function NoSubscriptionView({
    onSubscribePress,
    colors,
}: NoSubscriptionViewProps) {
    return (
        <View style={styles.container}>
            <Sparkles
                size={40}
                color={colors.warning}
                style={styles.icon}
            />
            <Text style={[styles.title, { color: colors.text.primary }]}>
                ¡Hazte Premium!
            </Text>
            <Text style={[styles.description, { color: colors.text.secondary }]}>
                Desbloquea funciones exclusivas como galerías extendidas, dashboard
                de promociones y mucho más.
            </Text>
            <Pressable
                style={[styles.button, { backgroundColor: colors.primary[500] }]}
                onPress={onSubscribePress}
            >
                <Text style={styles.buttonText}>Ver Planes Premium</Text>
            </Pressable>
        </View>
    );
});
