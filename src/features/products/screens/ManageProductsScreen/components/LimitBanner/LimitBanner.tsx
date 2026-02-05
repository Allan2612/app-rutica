import { memo } from 'react';
import { View, Text } from 'react-native';
import { Lock } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { QuotaInfo } from '@/types/entities';
import { styles } from './styles';

interface LimitBannerProps {
    quotaInfo: QuotaInfo;
}

export const LimitBanner = memo<LimitBannerProps>(function LimitBanner({ quotaInfo }) {
    const colors = useThemedColors();

    return (
        <View style={[styles.container, { backgroundColor: colors.error[50], borderColor: colors.error[200] }]}>
            <Lock color={colors.error[600]} size={20} />
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.error[800] }]}>
                    Límite de productos alcanzado
                </Text>
                <Text style={[styles.text, { color: colors.error[700] }]}>
                    {quotaInfo.hasPremium
                        ? 'Has usado toda tu cuota. Adquiere otro paquete para añadir más productos.'
                        : `Has alcanzado el límite de ${quotaInfo.freeQuota} productos gratuitos.`}
                </Text>
            </View>
        </View>
    );
});
