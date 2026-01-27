import { memo } from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { X, Package, ShoppingBag, Plus, ArrowRight, Check } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface ComboHelpModalProps {
    visible: boolean;
    onClose: () => void;
}

export const ComboHelpModal = memo(function ComboHelpModal({
    visible,
    onClose,
}: ComboHelpModalProps) {
    const colors = useThemedColors();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable 
                style={styles.overlay}
                onPress={onClose}
            >
                <Pressable
                    style={[styles.modalContainer, { backgroundColor: colors.background.primary }]}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
                        <View style={styles.headerTitleRow}>
                            <Package size={24} color={colors.primary[500]} strokeWidth={2} />
                            <Text style={[styles.title, { color: colors.text.primary }]}>
                                Cómo crear tu combo
                            </Text>
                        </View>
                        <Pressable
                            onPress={onClose}
                            style={({ pressed }) => [
                                styles.closeButton,
                                { backgroundColor: pressed ? colors.background.tertiary : 'transparent' }
                            ]}
                        >
                            <X size={24} color={colors.text.secondary} />
                        </Pressable>
                    </View>

                    {/* Content */}
                    <ScrollView 
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Introducción */}
                        <View style={styles.section}>
                            <Text style={[styles.introText, { color: colors.text.secondary }]}>
                                Los combos son promociones especiales donde ofreces múltiples unidades o productos juntos. 
                                Usa los botones <Text style={{ fontWeight: '700' }}>+</Text> y <Text style={{ fontWeight: '700' }}>-</Text> para 
                                indicar cuántas unidades de cada producto incluye tu combo.
                            </Text>
                        </View>

                        {/* Caso 1: 2x1 */}
                        <View style={[styles.exampleCard, { backgroundColor: colors.background.secondary, borderColor: colors.border.medium }]}>
                            <View style={styles.exampleHeader}>
                                <View style={[styles.badge, { backgroundColor: colors.primary[500] }]}>
                                    <Text style={styles.badgeText}>Ejemplo 1</Text>
                                </View>
                                <Text style={[styles.exampleTitle, { color: colors.text.primary }]}>
                                    Promoción 2x1
                                </Text>
                            </View>
                            
                            <View style={styles.stepsList}>
                                <View style={styles.step}>
                                    <View style={[styles.stepNumber, { backgroundColor: colors.primary[100] }]}>
                                        <Text style={[styles.stepNumberText, { color: colors.primary[700] }]}>1</Text>
                                    </View>
                                    <Text style={[styles.stepText, { color: colors.text.secondary }]}>
                                        Selecciona <Text style={{ fontWeight: '700' }}>1 producto</Text> (ej: Hamburguesa)
                                    </Text>
                                </View>
                                
                                <View style={styles.step}>
                                    <View style={[styles.stepNumber, { backgroundColor: colors.primary[100] }]}>
                                        <Text style={[styles.stepNumberText, { color: colors.primary[700] }]}>2</Text>
                                    </View>
                                    <Text style={[styles.stepText, { color: colors.text.secondary }]}>
                                        Presiona el botón <Text style={{ fontWeight: '700', color: colors.primary[500] }}>+</Text> dos veces
                                    </Text>
                                </View>
                                
                                <View style={styles.step}>
                                    <View style={[styles.stepNumber, { backgroundColor: colors.primary[100] }]}>
                                        <Text style={[styles.stepNumberText, { color: colors.primary[700] }]}>3</Text>
                                    </View>
                                    <Text style={[styles.stepText, { color: colors.text.secondary }]}>
                                        La cantidad quedará en <Text style={{ fontWeight: '700' }}>2</Text>
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.resultBox, { backgroundColor: colors.success + '15', borderColor: colors.success }]}>
                                <Check size={16} color={colors.success} strokeWidth={2.5} />
                                <Text style={[styles.resultText, { color: colors.success }]}>
                                    Etiqueta final: <Text style={{ fontWeight: '700' }}>"2x1"</Text>
                                </Text>
                            </View>
                        </View>

                        {/* Caso 2: 3x2 */}
                        <View style={[styles.exampleCard, { backgroundColor: colors.background.secondary, borderColor: colors.border.medium }]}>
                            <View style={styles.exampleHeader}>
                                <View style={[styles.badge, { backgroundColor: colors.primary[500] }]}>
                                    <Text style={styles.badgeText}>Ejemplo 2</Text>
                                </View>
                                <Text style={[styles.exampleTitle, { color: colors.text.primary }]}>
                                    Promoción 3x2 (Lleva 3, paga 2)
                                </Text>
                            </View>
                            
                            <View style={styles.stepsList}>
                                <View style={styles.step}>
                                    <View style={[styles.stepNumber, { backgroundColor: colors.primary[100] }]}>
                                        <Text style={[styles.stepNumberText, { color: colors.primary[700] }]}>1</Text>
                                    </View>
                                    <Text style={[styles.stepText, { color: colors.text.secondary }]}>
                                        Selecciona <Text style={{ fontWeight: '700' }}>1 producto</Text> (ej: Pizza)
                                    </Text>
                                </View>
                                
                                <View style={styles.step}>
                                    <View style={[styles.stepNumber, { backgroundColor: colors.primary[100] }]}>
                                        <Text style={[styles.stepNumberText, { color: colors.primary[700] }]}>2</Text>
                                    </View>
                                    <Text style={[styles.stepText, { color: colors.text.secondary }]}>
                                        En <Text style={{ fontWeight: '700' }}>Lleva</Text>, presiona <Text style={{ fontWeight: '700', color: colors.primary[500] }}>+</Text> hasta llegar a <Text style={{ fontWeight: '700' }}>3</Text>
                                    </Text>
                                </View>
                                
                                <View style={styles.step}>
                                    <View style={[styles.stepNumber, { backgroundColor: colors.primary[100] }]}>
                                        <Text style={[styles.stepNumberText, { color: colors.primary[700] }]}>3</Text>
                                    </View>
                                    <Text style={[styles.stepText, { color: colors.text.secondary }]}>
                                        En <Text style={{ fontWeight: '700' }}>Paga</Text>, presiona <Text style={{ fontWeight: '700', color: colors.success }}>-</Text> hasta llegar a <Text style={{ fontWeight: '700' }}>2</Text>
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.resultBox, { backgroundColor: colors.success + '15', borderColor: colors.success }]}>
                                <Check size={16} color={colors.success} strokeWidth={2.5} />
                                <Text style={[styles.resultText, { color: colors.success }]}>
                                    Etiqueta final: <Text style={{ fontWeight: '700' }}>"3x2"</Text> (lleva 3, paga 2)
                                </Text>
                            </View>
                        </View>

                        {/* Caso 3: Combo Mixto */}
                        <View style={[styles.exampleCard, { backgroundColor: colors.background.secondary, borderColor: colors.border.medium }]}>
                            <View style={styles.exampleHeader}>
                                <View style={[styles.badge, { backgroundColor: colors.primary[500] }]}>
                                    <Text style={styles.badgeText}>Ejemplo 3</Text>
                                </View>
                                <Text style={[styles.exampleTitle, { color: colors.text.primary }]}>
                                    Combo Mixto (múltiples productos)
                                </Text>
                            </View>
                            
                            <View style={styles.stepsList}>
                                <View style={styles.step}>
                                    <View style={[styles.stepNumber, { backgroundColor: colors.primary[100] }]}>
                                        <Text style={[styles.stepNumberText, { color: colors.primary[700] }]}>1</Text>
                                    </View>
                                    <Text style={[styles.stepText, { color: colors.text.secondary }]}>
                                        Selecciona <Text style={{ fontWeight: '700' }}>Hamburguesa</Text> y ajusta <Text style={{ fontWeight: '700' }}>Lleva: 2</Text>
                                    </Text>
                                </View>
                                
                                <View style={styles.step}>
                                    <View style={[styles.stepNumber, { backgroundColor: colors.primary[100] }]}>
                                        <Text style={[styles.stepNumberText, { color: colors.primary[700] }]}>2</Text>
                                    </View>
                                    <Text style={[styles.stepText, { color: colors.text.secondary }]}>
                                        Selecciona <Text style={{ fontWeight: '700' }}>Refresco</Text> y ajusta <Text style={{ fontWeight: '700' }}>Lleva: 1</Text>
                                    </Text>
                                </View>
                                
                                <View style={styles.step}>
                                    <View style={[styles.stepNumber, { backgroundColor: colors.primary[100] }]}>
                                        <Text style={[styles.stepNumberText, { color: colors.primary[700] }]}>3</Text>
                                    </View>
                                    <Text style={[styles.stepText, { color: colors.text.secondary }]}>
                                        Opcionalmente ajusta <Text style={{ fontWeight: '700' }}>Paga</Text> si quieres dar descuento adicional
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.resultBox, { backgroundColor: colors.success + '15', borderColor: colors.success }]}>
                                <Check size={16} color={colors.success} strokeWidth={2.5} />
                                <Text style={[styles.resultText, { color: colors.success }]}>
                                    Etiqueta final: <Text style={{ fontWeight: '700' }}>"Combo: 3 unidades"</Text>
                                </Text>
                            </View>
                        </View>

                        {/* Nota importante */}
                        <View style={[styles.noteBox, { backgroundColor: colors.isDark ? colors.primary[900] + '40' : colors.primary[50], borderColor: colors.primary[200] }]}>
                            <ShoppingBag size={20} color={colors.primary[500]} />
                            <Text style={[styles.noteText, { color: colors.isDark ? colors.primary[300] : colors.primary[700] }]}>
                                <Text style={{ fontWeight: '700' }}>Nota:</Text> El campo <Text style={{ fontWeight: '700' }}>Paga</Text> solo aparece cuando "Lleva" es mayor a 1. 
                                Si no modificas "Paga", el cliente paga el precio completo (útil para combos sin descuento de cantidad).
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={[styles.footer, { borderTopColor: colors.border.light }]}>
                        <Pressable
                            style={[styles.closeButtonLarge, { backgroundColor: colors.primary[500] }]}
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>Entendido</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
});
