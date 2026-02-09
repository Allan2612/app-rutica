/**
 * ImageCropModal - Versión Móvil (iOS/Android)
 * En móvil, expo-image-picker ya maneja el cropping nativo,
 * por lo que este componente simplemente retorna null.
 * 
 * La versión web está en ImageCropModal.web.tsx
 */

import { memo } from 'react';

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
 * En móvil, no necesitamos el modal de crop porque
 * expo-image-picker tiene allowsEditing nativo.
 * Este componente existe solo para satisfacer los imports.
 */
export const ImageCropModal = memo(function ImageCropModal(
    _props: ImageCropModalProps,
) {
    // En móvil, el cropping se hace con el editor nativo de expo-image-picker
    return null;
});
