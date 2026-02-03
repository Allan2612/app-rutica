import { memo, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Package, Trash2, Edit3, Star, MessageSquare, Calendar, Eye, EyeOff } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { CategoryChips } from '@/components/ui';
import { ProductPrice } from '@/components/products';
import type { AdminProductListItem } from '@/types/entities/product';
import { DeleteProductDialog } from '@/components/admin/DeleteProductDialog';
import { EditProductDialog } from '@/components/admin/EditProductDialog';
import { styles } from './styles';

// Admin Product Card with 2 action buttons
interface AdminProductCardProps {
    product: AdminProductListItem;
    onDelete: (productId: string) => void;
}

export const AdminProductCard = memo<AdminProductCardProps>(function AdminProductCard({
    product,
    onDelete,
}) {
    const colors = useThemedColors();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const handleDeletePress = () => {
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(product.id);
            setShowDeleteDialog(false);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        if (!isDeleting) {
            setShowDeleteDialog(false);
        }
    };



    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const isLoading = isDeleting;

    return (
        <>
            <View
                style={[
                    styles.card,
                    {
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.medium,
                        opacity: isLoading ? 0.6 : 1,
                    },
                ]}
            >
                {/* Top Row: Image + Main Info */}
                <View style={styles.topRow}>
                    {/* Product Image */}
                    {product.mainImageUrl ? (
                        <Image source={{ uri: product.mainImageUrl }} style={styles.image} />
                    ) : (
                        <View style={[styles.imagePlaceholder, { backgroundColor: colors.background.tertiary }]}>
                            <Package size={28} color={colors.text.tertiary} />
                        </View>
                    )}

                    {/* Main Info */}
                    <View style={styles.mainInfo}>
                        {/* Title + Status Badge */}
                        <View style={styles.titleRow}>
                            <Text style={[styles.productName, { color: colors.text.primary }]} numberOfLines={2}>
                                {product.name}
                            </Text>
                            <View
                                style={[
                                    styles.statusBadge,
                                    {
                                        backgroundColor: product.isActive
                                            ? colors.success
                                            : colors.error,
                                    },
                                ]}
                            >
                                {product.isActive ? (
                                    <Eye size={12} color={colors.text.inverse} strokeWidth={2.5} />
                                ) : (
                                    <EyeOff size={12} color={colors.text.inverse} strokeWidth={2.5} />
                                )}
                            </View>
                        </View>

                        {/* Price + Categories */}
                        <View style={styles.priceRow}>
                            <ProductPrice price={product.price} currency={product.currency} />
                            {product.categoryNames.length > 0 && (
                                <CategoryChips
                                    categoryNames={product.categoryNames}
                                    categoryIds={product.categoryIds}
                                    maxVisible={2}
                                />
                            )}
                        </View>

                        {/* Business + Owner */}
                        <View style={styles.businessRow}>
                            <Text style={[styles.businessText, { color: colors.text.primary }]} numberOfLines={1}>
                                {product.businessName}
                            </Text>
                            <Text style={[styles.divider, { color: colors.text.tertiary }]}>·</Text>
                            <Text style={[styles.ownerText, { color: colors.text.secondary }]} numberOfLines={1}>
                                {product.businessOwnerName}
                            </Text>
                        </View>

                        {/* Stats Row */}
                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <Star size={14} color={colors.rating.star} fill={colors.rating.star} />
                                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                                    {product.avgRating ? product.avgRating.toFixed(1) : '-'}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <MessageSquare size={14} color={colors.text.tertiary} />
                                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                                    {product.reviewsCount}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Calendar size={13} color={colors.text.tertiary} />
                                <Text style={[styles.dateText, { color: colors.text.tertiary }]}>
                                    {formatDate(product.createdAt)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Description */}
                {product.description && (
                    <Text
                        style={[
                            styles.description,
                            {
                                color: colors.text.secondary,
                                backgroundColor: colors.background.secondary,
                            },
                        ]}
                        numberOfLines={2}
                    >
                        {product.description}
                    </Text>
                )}

                {/* Actions */}
                <View style={styles.actions}>
                    <Pressable
                        onPress={() => setShowEditDialog(true)}
                        disabled={isLoading}
                        style={({ pressed }) => [
                            styles.actionButton,
                            {
                                backgroundColor: colors.primary[500] + '15',
                                borderColor: colors.primary[500],
                                opacity: pressed || isLoading ? 0.7 : 1,
                            },
                        ]}
                    >
                        <Edit3 size={16} color={colors.primary[500]} />
                        <Text style={[styles.actionButtonText, { color: colors.primary[500] }]}>Editar</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleDeletePress}
                        disabled={isLoading}
                        style={({ pressed }) => [
                            styles.actionButton,
                            {
                                backgroundColor: colors.error + '15',
                                borderColor: colors.error,
                                opacity: pressed || isLoading ? 0.7 : 1,
                            },
                        ]}
                    >
                        <Trash2 size={16} color={colors.error} />
                        <Text style={[styles.actionButtonText, { color: colors.error }]}>Eliminar</Text>
                    </Pressable>
                </View>
            </View>

            <DeleteProductDialog
                visible={showDeleteDialog}
                productName={product.name}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isDeleting={isDeleting}
            />

            <EditProductDialog
                visible={showEditDialog}
                product={product}
                onClose={() => setShowEditDialog(false)}
            />
        </>
    );
});
