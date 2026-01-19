import { memo } from 'react';
import { Modal, View, Image, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { styles } from './styles';

interface ImageViewerModalProps {
    visible: boolean;
    imageUri?: string | null;
    onClose: () => void;
}

export const ImageViewerModal = memo(({ visible, imageUri, onClose }: ImageViewerModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <Pressable style={styles.closeButton} onPress={onClose}>
                    <X size={32} color="#fff" strokeWidth={2.5} />
                </Pressable>

                {imageUri && (
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.fullImage}
                        resizeMode="contain"
                    />
                )}
            </View>
        </Modal>
    );
});

ImageViewerModal.displayName = 'ImageViewerModal';
