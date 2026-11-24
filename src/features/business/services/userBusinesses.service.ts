import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import type { UserBusinessListItem, BusinessDetailForEdit } from '@/types/entities/business';
import { getImageUrl, generateUUID, isNewImage, uploadImage } from './userBusinesses.helpers';
import { canUserEdit } from '@/utils/permissionHelpers';

const BUCKET_NAME = 'business-images';

export async function getUserBusinesses(userId: string): Promise<UserBusinessListItem[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select(
      `
      id_bus,
      name_bus,
      description_bus,
      moderation_status_bus,
      moderation_note_bus,
      is_active_bus,
      created_at_bus,
      locations!location_id_bus (
        districts!district_id_loc (
          name_dst,
          cantons!canton_id_dst (
            name_ctn,
            provinces!province_id_ctn (
              name_prv
            )
          )
        )
      ),
      business_images (
        path_bim,
        sort_order_bim
      ),
      business_category_map (
        categories (
          id_cat,
          name_cat
        )
      )
    `,
    )
    .eq('owner_id_bus', userId)
    .order('created_at_bus', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item) => {
    const sortedImages = [...(item.business_images ?? [])].sort(
      (a, b) => (a?.sort_order_bim ?? 0) - (b?.sort_order_bim ?? 0),
    );

    // sort_order: 0=logo, 1=cover, 2+=gallery
    const logoImage = sortedImages.find((img) => img.sort_order_bim === 0);
    const coverImage = sortedImages.find((img) => img.sort_order_bim === 1);
    const galleryImage = sortedImages.find((img) => (img.sort_order_bim ?? 0) > 1);

    const primaryImage = coverImage ?? galleryImage ?? logoImage ?? sortedImages[0];

    const imageUrl = primaryImage?.path_bim ? getImageUrl(primaryImage.path_bim) : null;
    const logoUrl = logoImage?.path_bim ? getImageUrl(logoImage.path_bim) : null;
    const coverUrl = coverImage?.path_bim ? getImageUrl(coverImage.path_bim) : null;

    // V3: location con joins normalizados
    const location = Array.isArray(item.locations) ? item.locations[0] : item.locations;
    const district = location?.districts;
    const canton = district?.cantons;
    const province = canton?.provinces;
    const country = province?.countries;

    const locationParts = [
      country?.name_cnt,
      province?.name_prv,
      canton?.name_ctn,
      district?.name_dst,
    ].filter(Boolean);

    const categoryNames = (item.business_category_map ?? [])
      .map((bcm) => bcm.categories?.name_cat)
      .filter((name): name is string => !!name);

    const categoryIds = (item.business_category_map ?? [])
      .map((bcm) => bcm.categories?.id_cat)
      .filter((id): id is string => !!id);

    return {
      id: item.id_bus,
      name: item.name_bus ?? '',
      description: item.description_bus,
      categoryNames,
      categoryIds,
      locationLabel: locationParts.length ? locationParts.join(', ') : null,
      imageUrl,
      logoUrl,
      coverUrl,
      avgRating: null,
      reviewsCount: null,
      moderationStatus: item.moderation_status_bus as 'pending' | 'approved' | 'rejected',
      moderationNote: item.moderation_note_bus,
      isActive: item.is_active_bus ?? false,
      createdAt: item.created_at_bus ?? '',
    };
  });
}

export async function deleteUserBusiness(businessId: string, userId: string): Promise<void> {
  // 1. Verificar permisos
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('owner_id_bus, location_id_bus')
    .eq('id_bus', businessId)
    .single();

  if (businessError) throw businessError;
  if (!business || business.owner_id_bus !== userId) {
    throw new Error('No tienes permiso para eliminar este negocio');
  }

  try {
    // 2. Obtener imágenes de business_images
    const { data: images } = await supabase
      .from('business_images')
      .select('path_bim')
      .eq('business_id_bim', businessId);

    // 3. Eliminar imágenes del bucket
    if (images && images.length > 0) {
      const imagePaths = images.map((img) => img.path_bim);
      const { error: storageError } = await supabase.storage.from(BUCKET_NAME).remove(imagePaths);

      if (storageError) {
        console.error('Error eliminando imágenes:', storageError);
      }
    }

    // 4. Eliminar registros de business_images
    await supabase.from('business_images').delete().eq('business_id_bim', businessId);

    // 5. Eliminar categorías asociadas
    const { error: categoriesError } = await supabase
      .from('business_category_map')
      .delete()
      .eq('business_id_bcm', businessId);

    if (categoriesError) {
      console.error('Error eliminando categorías:', categoriesError);
    }

    // 6. Eliminar el negocio
    const { error: deleteError } = await supabase
      .from('businesses')
      .delete()
      .eq('id_bus', businessId);

    if (deleteError) throw deleteError;

    // 7. Eliminar la ubicación si existe (solo si no está siendo usada por otros negocios)
    if (business.location_id_bus) {
      const { data: otherBusinesses } = await supabase
        .from('businesses')
        .select('id_bus')
        .eq('location_id_bus', business.location_id_bus)
        .limit(1);

      // Si no hay otros negocios usando esta ubicación, eliminarla
      if (!otherBusinesses || otherBusinesses.length === 0) {
        await supabase.from('locations').delete().eq('id_loc', business.location_id_bus);
      }
    }
  } catch (error) {
    throw error;
  }
}

export async function getBusinessById(
  businessId: string,
  userId: string,
): Promise<BusinessDetailForEdit> {
  const { data: businessData, error: businessError } = await supabase
    .from('businesses')
    .select(
      `
      id_bus,
      name_bus,
      description_bus,
      contact_phone_bus,
      contact_email_bus,
      website_bus,
      social_links_bus,
      owner_id_bus,
      location_id_bus
    `,
    )
    .eq('id_bus', businessId)
    .single();

  if (businessError) throw businessError;
  if (!businessData) throw new Error('No se encontró el negocio');

  // Verificar permisos: debe ser el propietario O admin
  const hasPermission = await canUserEdit(userId, businessData.owner_id_bus);
  if (!hasPermission) {
    throw new Error('No tienes permiso para editar este negocio');
  }

  // Cargar ubicación con jerarquía completa
  let locationData = null;
  let districtId = null;
  let countryName = '';
  let provinceName = '';
  let cantonName = '';
  let districtName = '';

  if (businessData.location_id_bus) {
    const { data: loc } = await supabase
      .from('locations')
      .select('district_id_loc, address_loc, latitude_loc, longitude_loc')
      .eq('id_loc', businessData.location_id_bus)
      .single();
    locationData = loc;
    districtId = loc?.district_id_loc ?? null;

    // Cargar jerarquía de ubicación
    if (districtId) {
      const { data: district } = await supabase
        .from('districts')
        .select('name_dst, canton_id_dst')
        .eq('id_dst', districtId)
        .single();

      if (district) {
        districtName = district.name_dst;

        const { data: canton } = await supabase
          .from('cantons')
          .select('name_ctn, province_id_ctn')
          .eq('id_ctn', district.canton_id_dst)
          .single();

        if (canton) {
          cantonName = canton.name_ctn;

          const { data: province } = await supabase
            .from('provinces')
            .select('name_prv, country_id_prv')
            .eq('id_prv', canton.province_id_ctn)
            .single();

          if (province) {
            provinceName = province.name_prv;

            const { data: country } = await supabase
              .from('countries')
              .select('name_cnt')
              .eq('id_cnt', province.country_id_prv)
              .single();

            if (country) {
              countryName = country.name_cnt;
            }
          }
        }
      }
    }
  }

  const { data: images } = await supabase
    .from('business_images')
    .select('id_bim, path_bim, sort_order_bim')
    .eq('business_id_bim', businessId)
    .order('sort_order_bim', { ascending: true });

  const { data: categoryMaps } = await supabase
    .from('business_category_map')
    .select('category_id_bcm')
    .eq('business_id_bcm', businessId);

  const sortedImages = (images ?? []).sort(
    (a, b) => (a?.sort_order_bim ?? 0) - (b?.sort_order_bim ?? 0),
  );

  // sort_order=0 es logo, sort_order=1 es cover, >1 es gallery
  const logoImage = sortedImages.find((img) => img.sort_order_bim === 0);
  const coverImage = sortedImages.find((img) => img.sort_order_bim === 1);
  const galleryImages = sortedImages.filter((img) => (img.sort_order_bim ?? 0) > 1);

  const logoUrl = logoImage?.path_bim ? getImageUrl(logoImage.path_bim) : null;
  const coverUrl = coverImage?.path_bim ? getImageUrl(coverImage.path_bim) : null;
  const galleryUrls = galleryImages.map((img) => getImageUrl(img.path_bim));

  const categoryIds = (categoryMaps ?? [])
    .map((bcm) => bcm.category_id_bcm)
    .filter((id: string) => !!id);

  const socialLinks = (businessData.social_links_bus ?? {}) as {
    facebook?: string | null;
    instagram?: string | null;
    tiktok?: string | null;
  };

  return {
    id: businessData.id_bus,
    name: businessData.name_bus ?? '',
    description: businessData.description_bus,
    categoryIds,
    districtId,
    country: countryName,
    province: provinceName,
    canton: cantonName,
    district: districtName,
    address: locationData?.address_loc ?? null,
    latitude: locationData?.latitude_loc ?? 0,
    longitude: locationData?.longitude_loc ?? 0,
    phone: businessData.contact_phone_bus,
    email: businessData.contact_email_bus,
    website: businessData.website_bus,
    facebook: socialLinks.facebook ?? null,
    instagram: socialLinks.instagram ?? null,
    tiktok: socialLinks.tiktok ?? null,
    logoUrl,
    coverUrl,
    galleryUrls,
  };
}
