import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { DollarSign } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface ProductCurrencySelectorProps {
    currency: string;
    onCurrencyChange: (currency: string) => void;
}

export const ProductCurrencySelector = memo(function ProductCurrencySelector({
    currency,
    onCurrencyChange,
}: ProductCurrencySelectorProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Moneda</Text>
            <Text style={[styles.label, { color: colors.text.primary }]}>
                Selecciona la moneda <Text style={styles.required}>*</Text>
            </Text>

            <View style={styles.currencyOptions}>
                {/* Colones */}
                <Pressable
                    style={[
                        styles.currencyOption,
                        {
                            backgroundColor:
                                currency === 'CRC'
                                    ? colors.primary[500] + '20'
                                    : colors.background.primary,
                            borderColor: currency === 'CRC' ? colors.primary[500] : colors.border.medium,
                        },
                    ]}
                    onPress={() => onCurrencyChange('CRC')}
                >
                    <Text
                        style={[
                            styles.currencyText,
                            {
                                color: currency === 'CRC' ? colors.primary[500] : colors.text.primary,
                            },
                        ]}
                    >
                        ₡ Colones
                    </Text>
                </Pressable>

                {/* Dólares */}
                <Pressable
                    style={[
                        styles.currencyOption,
                        {
                            backgroundColor:
                                currency === 'USD'
                                    ? colors.primary[500] + '20'
                                    : colors.background.primary,
                            borderColor: currency === 'USD' ? colors.primary[500] : colors.border.medium,
                        },
                    ]}
                    onPress={() => onCurrencyChange('USD')}
                >
                    <DollarSign
                        size={18}
                        strokeWidth={2.5}
                        color={currency === 'USD' ? colors.primary[500] : colors.text.primary}
                    />
                    <Text
                        style={[
                            styles.currencyText,
                            {
                                color: currency === 'USD' ? colors.primary[500] : colors.text.primary,
                            },
                        ]}
                    >
                        Dólares
                    </Text>
                </Pressable>
            </View>
        </View>
    );
});
