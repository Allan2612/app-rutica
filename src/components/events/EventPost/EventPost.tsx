import { useState } from 'react';
import { Image, Pressable, Text, View, Dimensions, Linking, Platform } from 'react-native';
import { MapPin, Calendar, Phone, Mail, Globe, PartyPopper, Star, Facebook, Instagram, Users, Coins } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { ImageCarousel, TikTokIcon } from '@/components/ui';
import { styles } from './styles';
import { getCategoryColorScheme } from '@/utils/categoryColors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_VISIBLE_CATEGORIES = 3;

export interface EventPostProps {
    name: string;
    description?: string | null;
    startAt: string;
    endAt: string;
    isFree?: boolean;
    price?: number | null;
    currency?: string | null;
    capacity?: number | null;
    categoryNames?: string[];
    categoryIds?: string[];
    locationLabel?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    imageUrls?: string[];
    authorName?: string | null;
    isApproved?: boolean;
    createdAt?: string;
    contactPhone?: string | null;
    contactEmail?: string | null;
    website?: string | null;
    socialLinks?: Record<string, string> | null;
    rating?: number;
    reviewCount?: number;
    onPress?: () => void;
}

function formatEventDate(startAt: string, endAt: string): string {
    const start = new Date(startAt);
    const end = new Date(endAt);
    const now = new Date();

    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };

    // Si el evento es hoy
    if (start.toDateString() === now.toDateString()) {
        return `Hoy, ${start.toLocaleTimeString('es-CR', timeOptions)}`;
    }

    // Si comienza mañana
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (start.toDateString() === tomorrow.toDateString()) {
        return `Mañana, ${start.toLocaleTimeString('es-CR', timeOptions)}`;
    }

    // Si es el mismo día
    if (start.toDateString() === end.toDateString()) {
        return `${capitalizeFirst(start.toLocaleDateString('es-CR', dateOptions))}, ${start.toLocaleTimeString('es-CR', timeOptions)}`;
    }

    // Múltiples días - incluir horas de inicio y fin
    const startDate = capitalizeFirst(start.toLocaleDateString('es-CR', { day: 'numeric', month: 'long' }));
    const endDate = capitalizeFirst(end.toLocaleDateString('es-CR', { day: 'numeric', month: 'long' }));
    const startTime = start.toLocaleTimeString('es-CR', timeOptions);
    const endTime = end.toLocaleTimeString('es-CR', timeOptions);
    return `${startDate} - ${startTime} a ${endDate} - ${endTime}`;
}

function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatPrice(isFree: boolean, price?: number | null, currency?: string | null): string {
    if (isFree) return 'Gratis';
    if (!price) return 'Consultar';
    const currencyCode = currency ?? 'CRC';
    return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
    }).format(price);
}

function getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-CR', { day: 'numeric', month: 'short' });
}

function getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

function openMaps(latitude: number, longitude: number, label?: string) {
    const encodedLabel = encodeURIComponent(label ?? 'Ubicación');
    const url = Platform.select({
        ios: `http://maps.apple.com/?q=${encodedLabel}&ll=${latitude},${longitude}`,
        android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedLabel})`,
        default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });
    Linking.openURL(url);
}

function extractSocialUsername(url: string): string {
    // Eliminar protocolo y www
    let cleaned = url.replace(/^https?:\/\/(www\.)?/, '');
    // Eliminar dominio y obtener lo que sigue después de /
    const parts = cleaned.split('/');
    if (parts.length > 1) {
        // Obtener el username (segunda parte después del dominio)
        const username = parts[1].replace('@', '');
        return username ? `@${username}` : url;
    }
    // Si no hay /, asumimos que es solo el username
    return cleaned.replace('@', '') ? `@${cleaned.replace('@', '')}` : url;
}

export function EventPost({
    name,
    description,
    startAt,
    endAt,
    isFree = false,
    price,
    currency,
    capacity,
    categoryNames = [],
    categoryIds = [],
    locationLabel,
    latitude,
    longitude,
    imageUrls = [],
    authorName,
    isApproved = false,
    createdAt,
    contactPhone,
    contactEmail,
    website,
    socialLinks,
    rating = 0,
    reviewCount = 0,
    onPress,
}: EventPostProps) {
    const colors = useThemedColors();
    const [showAllCategories, setShowAllCategories] = useState(false);

    const handleLocationPress = () => {
        if (latitude && longitude) {
            openMaps(latitude, longitude, locationLabel ?? name);
        }
    };

    const hasLocation = latitude !== null && latitude !== undefined && longitude !== null && longitude !== undefined;
    // Carrusel ocupa todo el ancho - está fuera del contenedor con padding
    const carouselWidth = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH, 600) : SCREEN_WIDTH;
    const eventDateLabel = formatEventDate(startAt, endAt);
    const priceLabel = formatPrice(isFree, price, currency);
    
    // Categorías visibles y extra - depende del estado showAllCategories
    const categoriesToShow = showAllCategories ? categoryNames : categoryNames.slice(0, MAX_VISIBLE_CATEGORIES);
    const extraCategoriesCount = showAllCategories ? 0 : categoryNames.length - MAX_VISIBLE_CATEGORIES;
    
    // Verificar si hay redes sociales
    const hasSocialLinks = socialLinks && Object.keys(socialLinks).length > 0;

    return (
        <Pressable
            style={[styles.post, { backgroundColor: colors.background.primary, borderColor: colors.border.medium }]}
            onPress={onPress}
            disabled={!onPress}
        >
            {/* Header con autor */}
            <View style={styles.header}>
                <View style={[styles.avatar, { backgroundColor: colors.primary[100] }]}>
                    {authorName ? (
                        <Text style={[styles.avatarText, { color: colors.primary[700] }]}>
                            {getInitials(authorName)}
                        </Text>
                    ) : (
                        <PartyPopper size={20} color={colors.primary[600]} />
                    )}
                </View>
                <View style={styles.headerInfo}>
                    <Text style={[styles.authorName, { color: colors.text.primary }]}>
                        {authorName ?? 'Rutica'}
                    </Text>
                    <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                        {createdAt ? getTimeAgo(createdAt) : ''}
                    </Text>
                </View>
            </View>

            {/* Carrusel de imágenes */}
            <View style={{ width: carouselWidth, alignSelf: 'center' }}>
                {imageUrls.length > 0 ? (
                    <ImageCarousel
                        images={imageUrls}
                        imageWidth={carouselWidth}
                        aspectRatio={16 / 9}
                    />
                ) : (
                    <View style={[styles.imagePlaceholder, { backgroundColor: colors.background.tertiary }]}>
                        <PartyPopper size={48} color={colors.text.tertiary} />
                    </View>
                )}
            </View>

            {/* Contenido */}
            <View style={styles.content}>
                {/* Título con check de verificación */}
                <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: colors.text.primary }]}>{name}</Text>
                    {isApproved && (
                        <Image
                            source={require('../../../../assets/verification.png')}
                            style={{ width: 18, height: 18, marginLeft: 6 }}
                            resizeMode="contain"
                        />
                    )}
                </View>

                {/* Descripción */}
                {description && (
                    <Text style={[styles.description, { color: colors.text.secondary }]} numberOfLines={3}>
                        {description}
                    </Text>
                )}

                {/* Categorías con límite */}
                {categoryNames.length > 0 && (
                    <View style={styles.categoriesRow}>
                        {categoriesToShow.map((catName, index) => {
                            const categoryId = categoryIds[index];
                            const colorScheme = getCategoryColorScheme(categoryId);
                            return (
                                <View
                                    key={categoryId ?? index}
                                    style={[styles.categoryChip, { backgroundColor: colorScheme.backgroundColor }]}
                                >
                                    <Text style={[styles.categoryText, { color: colorScheme.textColor }]}>
                                        {catName}
                                    </Text>
                                </View>
                            );
                        })}
                        {extraCategoriesCount > 0 && (
                            <Pressable 
                                onPress={() => setShowAllCategories(true)}
                                style={[styles.categoryChip, { backgroundColor: colors.background.tertiary }]}
                            >
                                <Text style={[styles.categoryText, { color: colors.text.secondary }]}>
                                    +{extraCategoriesCount}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                )}

                {/* Fecha y hora del evento */}
                <View style={styles.eventInfoRow}>
                    <Calendar size={16} color={colors.primary[500]} />
                    <Text style={[styles.eventInfoText, { color: colors.text.primary }]}>
                        {eventDateLabel}
                    </Text>
                </View>

                {/* Precio */}
                <View style={styles.eventInfoRow}>
                    <Coins size={16} color={isFree ? '#10b981' : colors.primary[500]} />
                    <Text style={[
                        styles.eventInfoText,
                        styles.priceText,
                        { color: isFree ? '#10b981' : colors.text.primary }
                    ]}>
                        {priceLabel}
                    </Text>
                </View>

                {/* Cupos disponibles */}
                {capacity && capacity > 0 && (
                    <View style={styles.eventInfoRow}>
                        <Users size={16} color={colors.primary[500]} />
                        <Text style={[styles.eventInfoText, { color: colors.text.primary }]}>
                            {capacity} cupos disponibles
                        </Text>
                    </View>
                )}

                {/* Rating */}
                {rating > 0 && (
                    <View style={styles.ratingRow}>
                        <Star size={16} color="#fbbf24" fill="#fbbf24" />
                        <Text style={[styles.ratingText, { color: colors.text.primary }]}>
                            {rating.toFixed(1)} ({reviewCount})
                        </Text>
                    </View>
                )}

                {/* Información de contacto y redes sociales */}
                {(contactPhone || contactEmail || website || hasSocialLinks) && (
                    <View style={styles.contactSection}>
                        {contactPhone && (
                            <Pressable 
                                style={styles.contactRow}
                                onPress={() => Linking.openURL(`tel:${contactPhone}`)}
                            >
                                <Phone size={14} color={colors.primary[500]} />
                                <Text style={[styles.contactText, { color: colors.primary[500] }]}>
                                    {contactPhone}
                                </Text>
                            </Pressable>
                        )}
                              {socialLinks?.facebook && (
                            <Pressable 
                                style={styles.contactRow}
                                onPress={() => Linking.openURL(socialLinks.facebook.startsWith('http') ? socialLinks.facebook : `https://facebook.com/${socialLinks.facebook}`)}
                            >
                                <Facebook size={14} color="#1877F2" />
                                <Text style={[styles.contactText, { color: '#1877F2' }]} numberOfLines={1}>
                                    {extractSocialUsername(socialLinks.facebook)}
                                </Text>
                            </Pressable>
                        )}
                        {website && (
                            <Pressable 
                                style={styles.contactRow}
                                onPress={() => Linking.openURL(website.startsWith('http') ? website : `https://${website}`)}
                            >
                                <Globe size={14} color={colors.primary[500]} />
                                <Text style={[styles.contactText, { color: colors.primary[500] }]} numberOfLines={1}>
                                    {website.replace(/^https?:\/\//, '')}
                                </Text>
                            </Pressable>
                        )}
                        {/* Redes sociales */}
                  
                        {socialLinks?.instagram && (
                            <Pressable 
                                style={styles.contactRow}
                                onPress={() => Linking.openURL(socialLinks.instagram.startsWith('http') ? socialLinks.instagram : `https://instagram.com/${socialLinks.instagram}`)}
                            >
                                <Instagram size={14} color="#E4405F" />
                                <Text style={[styles.contactText, { color: '#E4405F' }]} numberOfLines={1}>
                                    {extractSocialUsername(socialLinks.instagram)}
                                </Text>
                            </Pressable>
                        )}
                        {contactEmail && (
                            <Pressable 
                                style={styles.contactRow}
                                onPress={() => Linking.openURL(`mailto:${contactEmail}`)}
                            >
                                <Mail size={14} color={colors.primary[500]} />
                                <Text style={[styles.contactText, { color: colors.primary[500] }]}>
                                    {contactEmail}
                                </Text>
                            </Pressable>
                        )}
                        {socialLinks?.tiktok && (
                            <Pressable 
                                style={styles.contactRow}
                                onPress={() => Linking.openURL(socialLinks.tiktok.startsWith('http') ? socialLinks.tiktok : `https://tiktok.com/@${socialLinks.tiktok}`)}
                            >
                                <TikTokIcon size={14} color={colors.text.primary} />
                                <Text style={[styles.contactText, { color: colors.text.primary }]} numberOfLines={1}>
                                    {extractSocialUsername(socialLinks.tiktok)}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                )}
            </View>

            {/* Footer con ubicación */}
            {hasLocation && locationLabel && (
                <Pressable
                    style={[styles.footer, { borderTopColor: colors.border.light }]}
                    onPress={handleLocationPress}
                >
                    <View style={styles.footerItem}>
                        <MapPin size={16} color={colors.primary[500]} />
                        <Text style={[styles.footerText, { color: colors.primary[500] }]}>
                            {locationLabel}
                        </Text>
                    </View>
                </Pressable>
            )}
        </Pressable>
    );
}
