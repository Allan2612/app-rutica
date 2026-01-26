import { memo, useState, useEffect, useMemo } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { ConfirmExitDialog } from '@/components/manage';
import { BusinessInfoCard } from './BusinessInfoCard';
import { StarRatingInput } from './StarRatingInput';
import { CommentInput } from './CommentInput';
import { ModalButtons } from './ModalButtons';
import { styles } from './styles';

interface ReviewModalProps {
    visible: boolean;
    businessName: string;
    businessLogo?: string | null;
    existingRating?: number;
    existingComment?: string | null;
    isLoading?: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
    isEditMode?: boolean;
}

export const ReviewModal = memo(function ReviewModal({
    visible,
    businessName,
    businessLogo,
    existingRating = 0,
    existingComment = '',
    isLoading = false,
    onClose,
    onSubmit,
    isEditMode = false,
}: ReviewModalProps) {
    const colors = useThemedColors();
    const [rating, setRating] = useState(existingRating);
    const [comment, setComment] = useState(existingComment || '');
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    useEffect(() => {
        if (visible) {
            setRating(existingRating);
            setComment(existingComment || '');
            setShowExitConfirm(false);
        }
    }, [visible, existingRating, existingComment]);

    const hasChanges = useMemo(() => {
        if (!isEditMode) return rating > 0 || comment.trim().length > 0;
        return rating !== existingRating || comment !== (existingComment || '');
    }, [isEditMode, rating, existingRating, comment, existingComment]);

    const handleSubmit = () => {
        if (rating === 0) return;
        onSubmit(rating, comment);
    };

    const handleCancel = () => {
        if (hasChanges) {
            setShowExitConfirm(true);
        } else {
            onClose();
        }
    };

    return (
        <>
            <Modal visible={visible} transparent animationType="fade">
                <Pressable style={styles.overlay} onPress={handleCancel}>
                    <Pressable
                        style={[styles.container, {
                            backgroundColor: colors.background.primary,
                            borderColor: colors.border.light,
                        }]}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={styles.header}>
                            <Text style={[styles.title, { color: colors.text.primary }]}>
                                {isEditMode ? 'Editar reseña' : 'Escribir reseña'}
                            </Text>
                            <Pressable onPress={handleCancel} style={styles.closeButton}>
                                <X size={24} color={colors.text.tertiary} />
                            </Pressable>
                        </View>

                        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                            Comparte tu experiencia para ayudar a otros usuarios
                        </Text>

                        <BusinessInfoCard businessName={businessName} businessLogo={businessLogo} />
                        <StarRatingInput rating={rating} onRatingChange={setRating} disabled={isLoading} />
                        <CommentInput comment={comment} onCommentChange={setComment} disabled={isLoading} />
                        <ModalButtons
                            isEditMode={isEditMode}
                            isLoading={isLoading}
                            isSubmitDisabled={rating === 0}
                            onCancel={handleCancel}
                            onSubmit={handleSubmit}
                        />
                    </Pressable>
                </Pressable>
            </Modal>

            <ConfirmExitDialog
                visible={showExitConfirm}
                onConfirm={() => { setShowExitConfirm(false); onClose(); }}
                onCancel={() => setShowExitConfirm(false)}
                title="Cambios sin guardar"
                description="Tienes cambios en tu reseña que no se han guardado. Si sales ahora, perderás el progreso."
                cancelLabel="Continuar editando"
                confirmLabel="Descartar cambios"
            />
        </>
    );
});
