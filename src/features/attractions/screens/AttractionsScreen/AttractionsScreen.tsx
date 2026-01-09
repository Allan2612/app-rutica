import { memo, useState } from 'react';
import { View } from 'react-native';
import { TabSelector, TabOption } from '@/components/ui';
import { styles } from './styles';

const ATTRACTION_TABS: TabOption[] = [
    { id: 'attractions', label: 'Atracciones' },
    { id: 'events', label: 'Eventos' },
];

export const AttractionsScreen = memo(function AttractionsScreen() {
    const [activeTab, setActiveTab] = useState('attractions');

    return (
        <View style={styles.container}>
            <TabSelector
                tabs={ATTRACTION_TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <View style={styles.content}>
                {/* Aquí irá el contenido filtrado según el tab seleccionado */}
            </View>
        </View>
    );
});
