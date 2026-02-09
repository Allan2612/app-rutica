import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SingleImagePicker, MultipleImagePicker } from '@/components/ui';
import { useThemedColors } from '@/hooks';
import { formSectionStyles } from '@/styles/form-section-styles';
import { styles } from './styles';

interface ImageSectionProps {
  logoUri?: string | null;
  coverUri?: string | null;
  galleryUris: string[];
  onLogoChange?: (uri: string | null) => void;
  onCoverChange?: (uri: string | null) => void;
  onGalleryChange: (uris: string[]) => void;
  showLogo?: boolean;
  showCover?: boolean;
  sectionTitle?: string;
  coverLabel?: string;
  coverHelperText?: string;
  galleryLabel?: string;
  galleryHelperText?: string;
  maxGalleryImages?: number;
  /** Mostrar banner de upsell para galería premium */
  showGalleryPremiumUpsell?: boolean;
  /** Callback cuando se presiona el botón de comprar premium */
  onGalleryPremiumPress?: () => void;
  /** Nombre del paquete premium para el upsell */
  premiumPackageName?: string;
  /** Mensaje personalizado para el banner de upsell */
  upsellMessage?: string;
  /** Alias para showGalleryPremiumUpsell */
  showPremiumUpsell?: boolean;
  /** Alias para onGalleryPremiumPress */
  onPremiumPress?: () => void;
}

export const ImageSection = memo(function ImageSection({
  logoUri,
  coverUri,
  galleryUris,
  onLogoChange,
  onCoverChange,
  onGalleryChange,
  showLogo = true,
  showCover = true,
  sectionTitle = 'Imágenes',
  coverLabel = 'Imagen de Portada',
  coverHelperText = 'Imagen principal que se mostrará en la cabecera',
  galleryLabel = 'Galería (Opcional)',
  galleryHelperText = 'Hasta 3 imágenes adicionales del lugar o comercio',
  maxGalleryImages = 3,
  showGalleryPremiumUpsell = false,
  onGalleryPremiumPress,
  premiumPackageName = 'Galería Empresa',
  upsellMessage,
  showPremiumUpsell,
  onPremiumPress,
}: ImageSectionProps) {
  const colors = useThemedColors();

  // Soportar ambos nombres de props para compatibilidad
  const shouldShowUpsell = showPremiumUpsell ?? showGalleryPremiumUpsell;
  const handlePremiumPress = onPremiumPress ?? onGalleryPremiumPress;

  // Mensaje por defecto si no se proporciona uno
  const defaultMessage = `Ya usaste tus 3 fotos gratuitas. Con el paquete ${premiumPackageName} puedes añadir 10 fotos más a tu galería.`;
  const displayMessage = upsellMessage || defaultMessage;

  return (
    <View style={styles.section}>
      {sectionTitle && (
        <Text style={[formSectionStyles.sectionTitle, { color: colors.text.primary }]}>
          {sectionTitle}
        </Text>
      )}

      {showLogo && logoUri !== undefined && onLogoChange && (
        <SingleImagePicker
          imageUri={logoUri}
          onImageChange={onLogoChange}
          label="Logo"
          helperText="Imagen cuadrada que representa tu negocio"
          aspectRatio={[1, 1]}
          cropShape="rect"
        />
      )}

      {showCover && onCoverChange && (
        <SingleImagePicker
          imageUri={coverUri ?? null}
          onImageChange={onCoverChange}
          label={coverLabel}
          helperText={coverHelperText}
          aspectRatio={[16, 9]}
        />
      )}

      <MultipleImagePicker
        images={galleryUris}
        onImagesChange={onGalleryChange}
        maxImages={maxGalleryImages}
        label={galleryLabel}
        helperText={galleryHelperText}
      />

      {/* Banner de upsell para galería premium */}
      {shouldShowUpsell && handlePremiumPress && (
        <LinearGradient
          colors={
            colors.isDark
              ? [colors.primary[800], colors.primary[600]]
              : [colors.primary[700], colors.primary[500]]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 12,
            padding: 16,
            marginTop: 12,
            borderWidth: 1,
            borderColor: colors.primary[400],
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons
              name="images"
              size={24}
              color={colors.isDark ? colors.text.primary : colors.text.inverse}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.isDark ? colors.text.primary : colors.text.inverse,
                marginLeft: 8,
              }}
            >
              ¡Amplía tu galería!
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: colors.isDark ? colors.text.primary : colors.text.inverse,
              marginBottom: 12,
              lineHeight: 20,
            }}
          >
            {displayMessage}
          </Text>
          <Pressable
            onPress={handlePremiumPress}
            style={({ pressed }) => ({
              backgroundColor: pressed
                ? colors.isDark
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(255, 255, 255, 0.3)'
                : colors.isDark
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'rgba(255, 255, 255, 0.25)',
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: colors.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.4)',
            })}
          >
            <Ionicons name="star" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>
              Comprar {premiumPackageName}
            </Text>
          </Pressable>
        </LinearGradient>
      )}
    </View>
  );
});
