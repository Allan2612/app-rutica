import { memo } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { styles } from '../styles';

interface PickerModalProps {
    visible: boolean;
    title: string;
    items: { value: number; label: string }[];
    selectedValue: number;
    colors: any;
    isDisabled: (value: number) => boolean;
    onSelect: (value: number) => void;
    onClose: () => void;
}

export const PickerModal = memo(function PickerModal({
    visible,
    title,
    items,
    selectedValue,
    colors,
    isDisabled,
    onSelect,
    onClose,
}: PickerModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.pickerOverlay} onPress={onClose}>
                <View style={[styles.pickerContainer, { backgroundColor: colors.background.primary }]}>
                    <Text style={[styles.pickerTitle, { color: colors.text.primary }]}>
                        {title}
                    </Text>
                    <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                        <View style={styles.pickerGrid}>
                            {items.map((item) => {
                                const disabled = isDisabled(item.value);
                                const isSelected = item.value === selectedValue;
                                return (
                                    <Pressable
                                        key={item.value}
                                        style={[
                                            styles.pickerItem,
                                            isSelected && [styles.pickerItemSelected, { backgroundColor: colors.primary[500] }],
                                            disabled && styles.pickerItemDisabled,
                                        ]}
                                        onPress={() => !disabled && onSelect(item.value)}
                                        disabled={disabled}
                                    >
                                        <Text
                                            style={[
                                                styles.pickerItemText,
                                                { color: colors.text.primary },
                                                isSelected && styles.pickerItemTextSelected,
                                                disabled && { color: colors.text.tertiary },
                                            ]}
                                        >
                                            {item.label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>
            </Pressable>
        </Modal>
    );
});
