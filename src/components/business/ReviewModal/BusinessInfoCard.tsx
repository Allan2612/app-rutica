import { memo } from 'react';
import { View, Text, Image } from 'react-native';
import { Store } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface BusinessInfoCardProps {
    businessName: string;
    businessLogo?: string | null;
}

export const BusinessInfoCard = memo(function BusinessInfoCard({
    businessName,
    businessLogo,
}: BusinessInfoCardProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.businessInfo}>
            <View style={[styles.businessLogo, { backgroundColor: colors.background.tertiary }]}>
                {businessLogo ? (
                    <Image source={{ uri: businessLogo }} style={styles.logoImage} />
                ) : (
                    <Store size={24} color={colors.text.tertiary} />
                )}
            </View>
            <View style={styles.businessDetails}>
                <Text style={[styles.businessName, { color: colors.text.primary }]}>
                    {businessName}
                </Text>
                <Text style={[styles.businessType, { color: colors.primary[500] }]}>
                    Negocio
                </Text>
            </View>
        </View>
    );
});
