import { memo, useState } from 'react';
import { View } from 'react-native';
import { TabSelector, TabOption } from '@/components/ui';
import { styles } from './styles';

const BUSINESS_TABS: TabOption[] = [
    { id: 'commerces', label: 'Comercios' },
    { id: 'promotions', label: 'Promociones' },
];

export const BusinessesScreen = memo(function BusinessesScreen() {
    const [activeTab, setActiveTab] = useState('commerces');

    return (
        <View style={styles.container}>
            <TabSelector
                tabs={BUSINESS_TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <View style={styles.content}>
                {/* Aquí irá el contenido filtrado según el tab seleccionado */}
            </View>
        </View>
    );
});
