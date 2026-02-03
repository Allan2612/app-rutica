import { memo, useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { Edit3, X, Star } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface EditReviewDialogProps {
    visible: boolean;
    authorName: string;
    contentTitle: string;
    currentRating: number;
    currentComment: string | null;
    onConfirm: (rating: number, comment: string) => void;
    onCancel: () => void;
    isSaving?: boolean;
}

export const EditReviewDialog = memo(function EditReviewDialog({
    visible,
    authorName,
    contentTitle,
    currentRating,
    currentComment,
    onConfirm,
    onCancel,
    isSaving = false,
}: EditReviewDialogProps) {
    const colors = useThemedColors();
    const [rating, setRating] = useState(currentRating);
    const [comment, setComment] = useState(currentComment || '');

    // Reset values when dialog opens
    useEffect(() => {
        if (visible) {
            setRating(currentRating);
            setComment(currentComment || '');
        }
    }, [visible, currentRating, currentComment]);

    const handleConfirm = () => {
        onConfirm(rating, comment.trim());
    };

    const handleCancel = () => {
        if (!isSaving) {
            onCancel();
        }
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= rating;

            return (
                <Pressable
                    key={index}
                    onPress={() => setRating(starValue)}
                    disabled={isSaving}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                    })}
                >
                    <Star
                        size={32}
                        fill={isFilled ? colors.rating.star : 'transparent'}
                        color={isFilled ? colors.rating.star : colors.text.tertiary}
                        strokeWidth={2}
                    />
                </Pressable>
            );
        });
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
            <View style={styles.overlay}>
                <View style={[styles.dialog, { backgroundColor: colors.background.primary }]}>
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
                        <Edit3 size={24} color={colors.primary[500]} />
                        <Text style={[styles.title, { color: colors.text.primary }]}>
                            Editar reseña
                        </Text>
                        {!isSaving && (
                            <Pressable
                                onPress={handleCancel}
                                style={({ pressed }) => ({
                                    opacity: pressed ? 0.7 : 1,
                                })}
                            >
                                <X size={24} color={colors.text.tertiary} />
                            </Pressable>
                        )}
                    </View>

                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {/* Content */}
                        <View style={styles.content}>
                            <View style={[styles.infoBox, { backgroundColor: colors.background.secondary }]}>
                                <View style={styles.infoRow}>
                                    <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                                        Autor:
                                    </Text>
                                    <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                                        {authorName}
                                    </Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                                        Contenido:
                                    </Text>
                                    <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                                        {contentTitle}
                                    </Text>
                                </View>
                            </View>

                            {/* Rating Editor */}
                            <View style={styles.section}>
                                <Text style={[styles.sectionLabel, { color: colors.text.primary }]}>
                                    Calificación
                                </Text>
                                <View style={styles.starsContainer}>
                                    {renderStars()}
                                </View>
                                <Text style={[styles.ratingText, { color: colors.text.secondary }]}>
                                    {rating} de 5 estrellas
                                </Text>
                            </View>

                            {/* Comment Editor */}
                            <View style={styles.section}>
                                <Text style={[styles.sectionLabel, { color: colors.text.primary }]}>
                                    Comentario
                                </Text>
                                <TextInput
                                    style={[
                                        styles.commentInput,
                                        {
                                            backgroundColor: colors.background.secondary,
                                            borderColor: colors.border.medium,
                                            color: colors.text.primary,
                                        },
                                    ]}
                                    placeholder="Escribe un comentario..."
                                    placeholderTextColor={colors.text.tertiary}
                                    value={comment}
                                    onChangeText={setComment}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    editable={!isSaving}
                                />
                                <Text style={[styles.charCount, { color: colors.text.tertiary }]}>
                                    {comment.length} caracteres
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Actions */}
                    <View style={[styles.actions, { borderTopColor: colors.border.light }]}>
                        <Pressable
                            onPress={handleCancel}
                            disabled={isSaving}
                            style={({ pressed }) => [
                                styles.button,
                                styles.cancelButton,
                                {
                                    backgroundColor: colors.background.tertiary,
                                    opacity: pressed || isSaving ? 0.7 : 1,
                                },
                            ]}
                        >
                            <Text style={[styles.buttonText, { color: colors.text.primary }]}>
                                Cancelar
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={handleConfirm}
                            disabled={isSaving}
                            style={({ pressed }) => [
                                styles.button,
                                styles.saveButton,
                                {
                                    backgroundColor: colors.primary[500],
                                    opacity: pressed || isSaving ? 0.8 : 1,
                                },
                            ]}
                        >
                            {isSaving ? (
                                <ActivityIndicator size="small" color={colors.text.inverse} />
                            ) : (
                                <Text style={[styles.buttonText, { color: colors.text.inverse }]}>
                                    Guardar
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
});
