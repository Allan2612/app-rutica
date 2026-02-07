import { memo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Building2, Store } from 'lucide-react-native';
import { styles } from './styles';
import type { BusinessSelectorProps } from '../../../../../../types/entities/premium';

interface ExtendedBusinessSelectorProps extends BusinessSelectorProps {
    showStoreIcon?: boolean;
}

export const BusinessSelector = memo(function BusinessSelector({
    businessOptions,
    selectedBusinessId,
    onSelectBusiness,
    colors,
    showStoreIcon = false,
}: ExtendedBusinessSelectorProps) {
    const IconComponent = showStoreIcon ? Store : Building2;

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
                Empresa
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    gap: 10,
                    paddingHorizontal: 16,
                    flexGrow: 1,
                    justifyContent: 'center',
                }}
            >
                {/* Opción "Todas" */}
                <Pressable
                    style={[
                        styles.option,
                        {
                            backgroundColor: selectedBusinessId === null
                                ? colors.primary[500]
                                : colors.background.primary,
                            borderColor: selectedBusinessId === null
                                ? colors.primary[500]
                                : colors.border.light,
                        },
                    ]}
                    onPress={() => onSelectBusiness(null)}
                >
                    <View
                        style={[
                            styles.optionIcon,
                            {
                                backgroundColor: selectedBusinessId === null
                                    ? 'rgba(255,255,255,0.2)'
                                    : colors.background.secondary,
                            },
                        ]}
                    >
                        <IconComponent
                            color={selectedBusinessId === null ? '#ffffff' : colors.primary[500]}
                            size={22}
                            strokeWidth={2}
                        />
                    </View>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.optionText,
                            { color: selectedBusinessId === null ? '#ffffff' : colors.text.primary },
                        ]}
                    >
                        Todas
                    </Text>
                </Pressable>

                {/* Opciones de empresas */}
                {businessOptions.map((business) => (
                    <Pressable
                        key={business.id}
                        style={[
                            styles.option,
                            {
                                backgroundColor: selectedBusinessId === business.id
                                    ? colors.primary[500]
                                    : colors.background.primary,
                                borderColor: selectedBusinessId === business.id
                                    ? colors.primary[500]
                                    : colors.border.light,
                            },
                        ]}
                        onPress={() => onSelectBusiness(business.id)}
                    >
                        <View
                            style={[
                                styles.optionIcon,
                                {
                                    backgroundColor: selectedBusinessId === business.id
                                        ? 'rgba(255,255,255,0.2)'
                                        : colors.background.secondary,
                                },
                            ]}
                        >
                            {business.logoUrl ? (
                                <Image
                                    source={{ uri: business.logoUrl }}
                                    style={styles.optionImage}
                                    contentFit="cover"
                                />
                            ) : (
                                <IconComponent
                                    color={selectedBusinessId === business.id ? '#ffffff' : colors.primary[500]}
                                    size={22}
                                    strokeWidth={2}
                                />
                            )}
                        </View>
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.optionText,
                                { color: selectedBusinessId === business.id ? '#ffffff' : colors.text.primary },
                            ]}
                        >
                            {business.name}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
});
