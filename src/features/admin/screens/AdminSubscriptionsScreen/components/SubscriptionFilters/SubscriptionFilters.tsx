import { memo } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Search, CheckCircle, Users, Clock, XCircle, TimerOff } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { SubscriptionStatus } from '@/types/enums';
import { styles } from './styles';

interface SubscriptionFiltersProps {
    selectedStatus: SubscriptionStatus | 'all';
    searchQuery: string;
    onStatusChange: (status: SubscriptionStatus | 'all') => void;
    onSearchChange: (query: string) => void;
}

const statusFilters: { key: SubscriptionStatus | 'all'; label: string; icon: typeof Clock }[] = [
    { key: 'pending', label: 'Pendientes', icon: Clock },
    { key: 'approved', label: 'Aprobadas', icon: CheckCircle },
    { key: 'expired', label: 'Expiradas', icon: TimerOff },
    { key: 'rejected', label: 'Rechazadas', icon: XCircle },
    { key: 'all', label: 'Todas', icon: Users },
];

export const SubscriptionFilters = memo(function SubscriptionFilters({
    selectedStatus,
    searchQuery,
    onStatusChange,
    onSearchChange,
}: SubscriptionFiltersProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.filtersContainer}>
            <View style={styles.filterRow}>
                {statusFilters.map((filter) => (
                    <Pressable
                        key={filter.key}
                        style={[
                            styles.filterButton,
                            { borderColor: colors.border.medium },
                            selectedStatus === filter.key && [
                                styles.filterButtonActive,
                                { backgroundColor: colors.primary[500] },
                            ],
                        ]}
                        onPress={() => onStatusChange(filter.key)}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            { color: selectedStatus === filter.key ? '#fff' : colors.text.secondary },
                        ]}>
                            {filter.label}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {/* Search */}
            <View style={styles.searchWrapper}>
                <View style={[styles.searchContainer, {
                    borderColor: colors.border.light,
                    backgroundColor: colors.background.primary,
                    shadowColor: '#000',
                }]}>
                    <View style={[styles.searchIconWrapper, { backgroundColor: colors.primary[50] }]}>
                        <Search size={20} color={colors.primary[500]} />
                    </View>
                    <TextInput
                        style={[styles.searchInput, { color: colors.text.primary }]}
                        placeholder="Buscar usuario, plan premium o referencia de pago..."
                        placeholderTextColor={colors.text.tertiary}
                        value={searchQuery}
                        onChangeText={onSearchChange}
                    />
                </View>
            </View>
        </View>
    );
});
