import { memo, useState, useEffect } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { CalendarPicker } from '../CalendarPicker';
import { TimePicker } from '../TimePicker';
import { styles } from './styles';

interface UnifiedDateTimeModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (date: Date) => void;
    initialDate: Date;
    type: 'date' | 'time';
    title: string;
    minDate?: string;
}

export const UnifiedDateTimeModal = memo(function UnifiedDateTimeModal({
    visible,
    onClose,
    onConfirm,
    initialDate,
    type,
    title,
    minDate,
}: UnifiedDateTimeModalProps) {
    const colors = useThemedColors();
    const [tempDate, setTempDate] = useState<Date>(initialDate);

    useEffect(() => {
        if (visible) {
            setTempDate(new Date(initialDate));
        }
    }, [visible, initialDate]);

    const handleConfirm = () => {
        onConfirm(tempDate);
        onClose();
    };

    const handleDateChange = (date: Date) => {
        const newDate = new Date(tempDate);
        newDate.setFullYear(date.getFullYear());
        newDate.setMonth(date.getMonth());
        newDate.setDate(date.getDate());
        setTempDate(newDate);
    };

    const handleTimeChange = (time: { hours: number; minutes: number }) => {
        const newDate = new Date(tempDate);
        newDate.setHours(time.hours);
        newDate.setMinutes(time.minutes);
        setTempDate(newDate);
    };

    const minDateObj = minDate ? new Date(minDate) : undefined;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable
                    style={[styles.modalContainer, { backgroundColor: colors.background.primary }]}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: colors.border.medium }]}>
                        <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={colors.text.secondary} />
                        </Pressable>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        {type === 'date' ? (
                            <CalendarPicker
                                selectedDate={tempDate}
                                onDateChange={handleDateChange}
                                minDate={minDateObj}
                            />
                        ) : (
                            <TimePicker
                                selectedTime={{
                                    hours: tempDate.getHours(),
                                    minutes: tempDate.getMinutes(),
                                }}
                                onTimeChange={handleTimeChange}
                            />
                        )}
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <Pressable
                            style={[styles.button, styles.cancelButton, { borderColor: colors.border.medium }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.cancelText, { color: colors.text.primary }]}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.button, styles.confirmButton, { backgroundColor: colors.primary[500] }]}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.confirmText}>Confirmar</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
});
