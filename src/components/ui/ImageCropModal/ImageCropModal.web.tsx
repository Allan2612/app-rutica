/**
 * ImageCropModal - Versión Web
 * Modal para recortar imágenes usando react-easy-crop
 */

import { memo, useState, useCallback } from 'react';
import { View, Text, Pressable, Modal, ActivityIndicator } from 'react-native';
import { X, Check, RotateCw } from 'lucide-react-native';
import Cropper from 'react-easy-crop';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ImageCropModalProps {
    visible: boolean;
    imageUri: string | null;
    aspectRatio?: number;
    onCropComplete: (croppedUri: string) => void;
    onCancel: () => void;
    cropShape?: 'rect' | 'round';
    title?: string;
}

/**
 * Crea una imagen recortada a partir de las coordenadas del crop
 */
async function getCroppedImage(
    imageSrc: string,
    pixelCrop: CropArea,
): Promise<string> {
    const image = new Image();
    image.crossOrigin = 'anonymous';

    return new Promise((resolve, reject) => {
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('No se pudo obtener el contexto del canvas'));
                return;
            }

            // Establecer el tamaño del canvas al tamaño del crop
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;

            // Dibujar la imagen recortada
            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height,
            );

            // Convertir a base64/data URL
            const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            resolve(croppedDataUrl);
        };

        image.onerror = () => {
            reject(new Error('Error al cargar la imagen'));
        };

        image.src = imageSrc;
    });
}

export const ImageCropModal = memo(function ImageCropModal({
    visible,
    imageUri,
    aspectRatio = 16 / 9,
    onCropComplete,
    onCancel,
    cropShape = 'rect',
    title = 'Recortar imagen',
}: ImageCropModalProps) {
    const colors = useThemedColors();
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropChange = useCallback((location: { x: number; y: number }) => {
        setCrop(location);
    }, []);

    const onZoomChange = useCallback((newZoom: number) => {
        setZoom(newZoom);
    }, []);

    const onRotationChange = useCallback((newRotation: number) => {
        setRotation(newRotation);
    }, []);

    const onCropAreaChange = useCallback(
        (_croppedArea: CropArea, croppedAreaPixels: CropArea) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        [],
    );

    const handleRotate = useCallback(() => {
        setRotation((prev) => (prev + 90) % 360);
    }, []);

    const handleConfirm = useCallback(async () => {
        if (!imageUri || !croppedAreaPixels) return;

        setIsProcessing(true);
        try {
            const croppedUri = await getCroppedImage(imageUri, croppedAreaPixels);
            onCropComplete(croppedUri);
            // Reset state
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
        } catch (error) {
            console.error('Error al recortar imagen:', error);
        } finally {
            setIsProcessing(false);
        }
    }, [imageUri, croppedAreaPixels, onCropComplete]);

    const handleCancel = useCallback(() => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        onCancel();
    }, [onCancel]);

    if (!imageUri) {
        return null;
    }

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={handleCancel}
        >
            <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.9)' }]}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: colors.background.primary }]}>
                    <Pressable
                        onPress={handleCancel}
                        style={styles.headerButton}
                        disabled={isProcessing}
                    >
                        <X color={colors.text.primary} size={24} strokeWidth={2} />
                    </Pressable>

                    <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>

                    <Pressable
                        onPress={handleConfirm}
                        style={[styles.headerButton, styles.confirmButton]}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <ActivityIndicator size="small" color={colors.primary[500]} />
                        ) : (
                            <Check color={colors.primary[500]} size={24} strokeWidth={2.5} />
                        )}
                    </Pressable>
                </View>

                {/* Crop Area */}
                <View style={styles.cropContainer}>
                    <Cropper
                        image={imageUri}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspectRatio}
                        cropShape={cropShape}
                        showGrid={true}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onRotationChange={onRotationChange}
                        onCropComplete={onCropAreaChange}
                        style={{
                            containerStyle: {
                                backgroundColor: '#000',
                            },
                            cropAreaStyle: {
                                border: `2px solid ${colors.primary[500]}`,
                            },
                        }}
                    />
                </View>

                {/* Controls */}
                <View style={[styles.controls, { backgroundColor: colors.background.primary }]}>
                    {/* Zoom Slider */}
                    <View style={styles.sliderContainer}>
                        <Text style={[styles.sliderLabel, { color: colors.text.secondary }]}>Zoom</Text>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            style={{
                                flex: 1,
                                accentColor: colors.primary[500],
                                height: 4,
                            }}
                        />
                    </View>

                    {/* Rotation Button */}
                    <Pressable
                        onPress={handleRotate}
                        style={[styles.rotateButton, { backgroundColor: colors.background.secondary }]}
                    >
                        <RotateCw color={colors.text.primary} size={20} strokeWidth={2} />
                        <Text style={[styles.rotateText, { color: colors.text.primary }]}>Rotar</Text>
                    </Pressable>
                </View>

                {/* Helper Text */}
                <View style={[styles.footer, { backgroundColor: colors.background.primary }]}>
                    <Text style={[styles.helperText, { color: colors.text.tertiary }]}>
                        Arrastra para mover, usa el slider o scroll para hacer zoom
                    </Text>
                </View>
            </View>
        </Modal>
    );
});
