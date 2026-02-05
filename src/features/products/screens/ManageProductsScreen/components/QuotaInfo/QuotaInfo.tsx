import { memo } from 'react';
import { View, Text } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { QuotaInfo as QuotaInfoType } from '@/types/entities';
import { styles } from './styles';

interface QuotaInfoProps {
    quotaInfo: QuotaInfoType;
}

export const QuotaInfo = memo<QuotaInfoProps>(function QuotaInfo({ quotaInfo }) {
    const colors = useThemedColors();

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
            <ShoppingBag color={colors.text.secondary} size={18} />
            <Text style={[styles.text, { color: colors.text.secondary }]}>
                {quotaInfo.usedCount}/{quotaInfo.totalQuota} productos
                {quotaInfo.hasPremium && ` (${quotaInfo.freeQuota} gratis + ${quotaInfo.premiumQuota} premium)`}
            </Text>
        </View>
    );
});
