-- ============================================================
-- V3 - Script final (CREATE FROM 0) - CORREGIDO para Supabase
-- ============================================================
-- Fixes incluidos:
-- 1) Reemplazado USER-DEFINED por enums reales:
--    - public.moderation_status
--    - public.promotion_scope
--    - public.discount_type
--    - public.payment_state
-- 2) Corregido typo: "timestamp with time zona" -> "time zone"
-- 3) Asegurada extensión para gen_random_uuid(): pgcrypto
-- 4) Agregadas PK compuestas a tablas *_map (evita duplicados)
-- ============================================================

-- Requerido para gen_random_uuid()
create extension if not exists pgcrypto;

-- ============================================================
-- ENUMS
-- ============================================================

create type public.user_role as enum (
  'user',
  'seller',
  'admin',
  'premium'
);

create type public.moderation_status as enum (
  'pending',
  'approved',
  'rejected'
);

create type public.promotion_scope as enum (
  'all',
  'products',
  'categories',
  'combo'
);

create type public.discount_type as enum (
  'percentage',
  'fixed'
);

create type public.payment_state as enum (
  'pending',
  'paid',
  'rejected'
);

create type public.interaction_type as enum (
  -- views (visitas)
  'view_business',
  'view_event',
  'view_attraction',
  'view_review',

  -- CTA / Contacto
  'contact_click',
  'call_click',
  'email_click',
  'website_click',
  'map_click',
  'share_click',

  -- canales sociales
  'whatsapp_click',
  'instagram_click',
  'facebook_click',
  'tiktok_click',
  'youtube_click'
);

-- ============================================================
-- 0) PROFILES + PREMIUM
-- ============================================================

create table public.profiles (
  id_prf uuid not null,
  first_name_prf character varying,
  last_name1_prf character varying,
  last_name2_prf character varying,
  phone_number_prf character varying unique,
  role_prf public.user_role,
  is_active_prf boolean default true,

  -- Foto de perfil (V3: solo path, bucket fijo por diseño)
  profile_photo_path_prf text,

  created_at_prf timestamp with time zone default now(),
  updated_at_prf timestamp with time zone default now(),

  constraint profiles_pkey primary key (id_prf),
  constraint profiles_id_prf_fkey foreign key (id_prf) references auth.users(id)
);


create table public.profile_premium (
  profile_id_ppm uuid primary key,

  -- Suscripción
  subscribed_at_ppm timestamp with time zone not null default now(),

  -- Pago
  payment_reference_ppm character varying,
  payment_note_ppm text,

  created_at_ppm timestamp with time zone not null default now(),
  updated_at_ppm timestamp with time zone not null default now(),

  constraint profile_premium_profile_id_fkey
    foreign key (profile_id_ppm)
    references public.profiles(id_prf)
    on delete cascade
);

-- ============================================================
-- 1) CATEGORIES
-- ============================================================

create table public.categories (
  id_cat uuid not null default gen_random_uuid(),
  name_cat character varying unique,
  created_at_cat timestamp with time zone default now(),
  constraint categories_pkey primary key (id_cat)
);

-- ============================================================
-- 2) LOCATIONS V3 (normalizado)
-- ============================================================

create table public.countries (
  id_cnt uuid not null default gen_random_uuid(),
  name_cnt character varying not null,
  created_at_cnt timestamp with time zone default now(),
  constraint countries_pkey primary key (id_cnt),
  constraint countries_name_uq unique (name_cnt)
);

create table public.provinces (
  id_prv uuid not null default gen_random_uuid(),
  country_id_prv uuid not null,
  name_prv character varying not null,
  created_at_prv timestamp with time zone default now(),
  constraint provinces_pkey primary key (id_prv),
  constraint provinces_country_id_fkey foreign key (country_id_prv) references public.countries(id_cnt),
  constraint provinces_unique unique (country_id_prv, name_prv)
);

create table public.cantons (
  id_ctn uuid not null default gen_random_uuid(),
  province_id_ctn uuid not null,
  name_ctn character varying not null,
  created_at_ctn timestamp with time zone default now(),
  constraint cantons_pkey primary key (id_ctn),
  constraint cantons_province_id_fkey foreign key (province_id_ctn) references public.provinces(id_prv),
  constraint cantons_unique unique (province_id_ctn, name_ctn)
);

create table public.districts (
  id_dst uuid not null default gen_random_uuid(),
  canton_id_dst uuid not null,
  name_dst character varying not null,
  created_at_dst timestamp with time zone default now(),
  constraint districts_pkey primary key (id_dst),
  constraint districts_canton_id_fkey foreign key (canton_id_dst) references public.cantons(id_ctn),
  constraint districts_unique unique (canton_id_dst, name_dst)
);

create table public.locations (
  id_loc uuid not null default gen_random_uuid(),
  district_id_loc uuid not null,

  address_loc character varying,
  latitude_loc numeric,
  longitude_loc numeric,

  created_at_loc timestamp with time zone default now(),

  constraint locations_pkey primary key (id_loc),
  constraint locations_district_id_fkey foreign key (district_id_loc) references public.districts(id_dst)
);

-- ============================================================
-- 3) FEATURES
-- ============================================================

create table public.businesses (
  id_bus uuid not null default gen_random_uuid(),
  owner_id_bus uuid,
  name_bus character varying,
  description_bus text,
  location_id_bus uuid,
  social_links_bus json,
  contact_phone_bus character varying,
  contact_email_bus character varying,
  website_bus character varying,
  moderation_status_bus public.moderation_status,
  reviewed_by_bus uuid,
  reviewed_at_bus timestamp with time zone,
  moderation_note_bus text,
  avg_rating_bus numeric default 0,
  reviews_count_bus integer default 0,
  is_active_bus boolean default true,
  created_at_bus timestamp with time zone default now(),
  updated_at_bus timestamp with time zone default now(),
  constraint businesses_pkey primary key (id_bus),
  constraint businesses_owner_id_bus_fkey foreign key (owner_id_bus) references public.profiles(id_prf),
  constraint businesses_location_id_bus_fkey foreign key (location_id_bus) references public.locations(id_loc),
  constraint businesses_reviewed_by_bus_fkey foreign key (reviewed_by_bus) references public.profiles(id_prf)
);

create table public.events (
  id_evt uuid not null default gen_random_uuid(),
  created_by_evt uuid,
  name_evt character varying,
  description_evt text,
  location_id_evt uuid,
  start_at_evt timestamp with time zone,
  end_at_evt timestamp with time zone,
  price_evt numeric,
  currency_evt character varying,
  capacity_evt integer,
  is_free_evt boolean default false,
  social_links_evt json,
  contact_phone_evt character varying,
  contact_email_evt character varying,
  website_evt character varying,
  ticket_url_evt character varying,
  moderation_status_evt public.moderation_status,
  reviewed_by_evt uuid,
  reviewed_at_evt timestamp with time zone,
  moderation_note_evt text,
  avg_rating_evt numeric default 0,
  reviews_count_evt integer default 0,
  is_active_evt boolean default true,
  created_at_evt timestamp with time zone default now(),
  updated_at_evt timestamp with time zone default now(),
  constraint events_pkey primary key (id_evt),
  constraint events_created_by_evt_fkey foreign key (created_by_evt) references public.profiles(id_prf),
  constraint events_location_id_evt_fkey foreign key (location_id_evt) references public.locations(id_loc),
  constraint events_reviewed_by_evt_fkey foreign key (reviewed_by_evt) references public.profiles(id_prf)
);

create table public.attractions (
  id_atr uuid not null default gen_random_uuid(),
  submitted_by_atr uuid,
  name_atr character varying,
  description_atr text,
  location_id_atr uuid,
  moderation_status_atr public.moderation_status,
  reviewed_by_atr uuid,
  reviewed_at_atr timestamp with time zone,
  moderation_note_atr text,
  avg_rating_atr numeric default 0,
  reviews_count_atr integer default 0,
  is_active_atr boolean default true,
  created_at_atr timestamp with time zone default now(),
  updated_at_atr timestamp with time zone default now(),
  constraint attractions_pkey primary key (id_atr),
  constraint attractions_submitted_by_atr_fkey foreign key (submitted_by_atr) references public.profiles(id_prf),
  constraint attractions_location_id_atr_fkey foreign key (location_id_atr) references public.locations(id_loc),
  constraint attractions_reviewed_by_atr_fkey foreign key (reviewed_by_atr) references public.profiles(id_prf)
);

create table public.products (
  id_prd uuid not null default gen_random_uuid(),
  business_id_prd uuid,
  name_prd character varying,
  description_prd text,
  price_prd numeric,
  currency_prd character varying,
  is_active_prd boolean default true,
  avg_rating_prd numeric default 0,
  reviews_count_prd integer default 0,
  created_at_prd timestamp with time zone default now(),
  updated_at_prd timestamp with time zone default now(),
  constraint products_pkey primary key (id_prd),
  constraint products_business_id_prd_fkey foreign key (business_id_prd) references public.businesses(id_bus)
);

create table public.promotions (
  id_prm uuid not null default gen_random_uuid(),
  business_id_prm uuid,
  created_by_prm uuid,
  scope_prm public.promotion_scope,
  title_prm character varying,
  description_prm text,
  discount_type_prm public.discount_type,
  start_at_prm timestamp with time zone,
  end_at_prm timestamp with time zone,
  moderation_status_prm public.moderation_status,
  reviewed_by_prm uuid,
  reviewed_at_prm timestamp with time zone,
  moderation_note_prm text,
  payment_state_prm public.payment_state,

  -- Pago (V3: 2 notas)
  payment_reference_prm character varying,
  payment_note_admin_prm text,
  payment_note_seller_prm text,

  -- Activo/Inactivo (V3)
  is_active_prm boolean default true,

  created_at_prm timestamp with time zone default now(),
  updated_at_prm timestamp with time zone default now(),
  discount_value_prm numeric default 0,

  constraint promotions_pkey primary key (id_prm),
  constraint promotions_business_id_prm_fkey foreign key (business_id_prm) references public.businesses(id_bus),
  constraint promotions_created_by_prm_fkey foreign key (created_by_prm) references public.profiles(id_prf),
  constraint promotions_reviewed_by_prm_fkey foreign key (reviewed_by_prm) references public.profiles(id_prf)
);

-- ============================================================
-- 4) MAPS (categorías y productos/promos)
-- ============================================================

create table public.business_category_map (
  business_id_bcm uuid not null,
  category_id_bcm uuid not null,
  constraint business_category_map_pkey primary key (business_id_bcm, category_id_bcm),
  constraint business_category_map_business_id_bcm_fkey foreign key (business_id_bcm) references public.businesses(id_bus) on delete cascade,
  constraint business_category_map_category_id_bcm_fkey foreign key (category_id_bcm) references public.categories(id_cat) on delete cascade
);

create table public.event_category_map (
  event_id_ecm uuid not null,
  category_id_ecm uuid not null,
  constraint event_category_map_pkey primary key (event_id_ecm, category_id_ecm),
  constraint event_category_map_event_id_ecm_fkey foreign key (event_id_ecm) references public.events(id_evt) on delete cascade,
  constraint event_category_map_category_id_ecm_fkey foreign key (category_id_ecm) references public.categories(id_cat) on delete cascade
);

create table public.attraction_category_map (
  attraction_id_acm uuid not null,
  category_id_acm uuid not null,
  constraint attraction_category_map_pkey primary key (attraction_id_acm, category_id_acm),
  constraint attraction_category_map_attraction_id_acm_fkey foreign key (attraction_id_acm) references public.attractions(id_atr) on delete cascade,
  constraint attraction_category_map_category_id_acm_fkey foreign key (category_id_acm) references public.categories(id_cat) on delete cascade
);

create table public.product_category_map (
  product_id_pcm uuid not null,
  category_id_pcm uuid not null,
  constraint product_category_map_pkey primary key (product_id_pcm, category_id_pcm),
  constraint product_category_map_product_id_pcm_fkey foreign key (product_id_pcm) references public.products(id_prd) on delete cascade,
  constraint product_category_map_category_id_pcm_fkey foreign key (category_id_pcm) references public.categories(id_cat) on delete cascade
);

create table public.promotion_category_map (
  promotion_id_pcr uuid not null,
  category_id_pcr uuid not null,
  constraint promotion_category_map_pkey primary key (promotion_id_pcr, category_id_pcr),
  constraint promotion_category_map_promotion_id_pcr_fkey foreign key (promotion_id_pcr) references public.promotions(id_prm) on delete cascade,
  constraint promotion_category_map_category_id_pcr_fkey foreign key (category_id_pcr) references public.categories(id_cat) on delete cascade
);

create table public.promotion_products (
  promotion_id_ppr uuid not null,
  product_id_ppr uuid not null,
  constraint promotion_products_pkey primary key (promotion_id_ppr, product_id_ppr),
  constraint promotion_products_promotion_id_ppr_fkey foreign key (promotion_id_ppr) references public.promotions(id_prm) on delete cascade,
  constraint promotion_products_product_id_ppr_fkey foreign key (product_id_ppr) references public.products(id_prd) on delete cascade
);

create table public.promotion_scope_categories (
  promotion_id_psc uuid not null,
  category_id_psc uuid not null,
  created_at_psc timestamp with time zone default now(),
  constraint promotion_scope_categories_pkey primary key (promotion_id_psc, category_id_psc),
  constraint promotion_scope_categories_promotion_id_psc_fkey foreign key (promotion_id_psc) references public.promotions(id_prm) on delete cascade,
  constraint promotion_scope_categories_category_id_psc_fkey foreign key (category_id_psc) references public.categories(id_cat) on delete cascade
);

create table public.promotion_combo_items (
  id_pci uuid not null default gen_random_uuid(),
  promotion_id_pci uuid not null,
  product_id_pci uuid not null,
  quantity_pci integer not null default 1 check (quantity_pci > 0),
  created_at_pci timestamp with time zone default now(),
  paid_quantity_pci integer check (paid_quantity_pci is null or paid_quantity_pci > 0),
  constraint promotion_combo_items_pkey primary key (id_pci),
  constraint promotion_combo_items_promotion_id_pci_fkey foreign key (promotion_id_pci) references public.promotions(id_prm) on delete cascade,
  constraint promotion_combo_items_product_id_pci_fkey foreign key (product_id_pci) references public.products(id_prd) on delete cascade
);

-- ============================================================
-- 5) REVIEWS
-- ============================================================

create table public.business_reviews (
  id_brv uuid not null default gen_random_uuid(),
  business_id_brv uuid,
  user_id_brv uuid,
  rating_brv integer,
  comment_brv text,
  created_at_brv timestamp with time zone default now(),
  constraint business_reviews_pkey primary key (id_brv),
  constraint business_reviews_business_id_brv_fkey foreign key (business_id_brv) references public.businesses(id_bus) on delete cascade,
  constraint business_reviews_user_id_brv_fkey foreign key (user_id_brv) references public.profiles(id_prf) on delete cascade
);

create table public.event_reviews (
  id_erv uuid not null default gen_random_uuid(),
  event_id_erv uuid,
  user_id_erv uuid,
  rating_erv integer,
  comment_erv text,
  created_at_erv timestamp with time zone default now(),
  constraint event_reviews_pkey primary key (id_erv),
  constraint event_reviews_event_id_erv_fkey foreign key (event_id_erv) references public.events(id_evt) on delete cascade,
  constraint event_reviews_user_id_erv_fkey foreign key (user_id_erv) references public.profiles(id_prf) on delete cascade
);

create table public.attraction_reviews (
  id_arv uuid not null default gen_random_uuid(),
  attraction_id_arv uuid,
  user_id_arv uuid,
  rating_arv integer,
  comment_arv text,
  created_at_arv timestamp with time zone default now(),
  constraint attraction_reviews_pkey primary key (id_arv),
  constraint attraction_reviews_attraction_id_arv_fkey foreign key (attraction_id_arv) references public.attractions(id_atr) on delete cascade,
  constraint attraction_reviews_user_id_arv_fkey foreign key (user_id_arv) references public.profiles(id_prf) on delete cascade
);

create table public.product_reviews (
  id_prv uuid not null default gen_random_uuid(),
  product_id_prv uuid,
  user_id_prv uuid,
  rating_prv integer,
  comment_prv text,
  created_at_prv timestamp with time zone default now(),
  constraint product_reviews_pkey primary key (id_prv),
  constraint product_reviews_product_id_prv_fkey foreign key (product_id_prv) references public.products(id_prd) on delete cascade,
  constraint product_reviews_user_id_prv_fkey foreign key (user_id_prv) references public.profiles(id_prf) on delete cascade
);

-- ============================================================
-- 6) HELPERS + IMAGES V3 (solo path)
-- ============================================================

create or replace function public.storage_folder_from_path(p_path text)
returns text
language sql
immutable
as $$
  select split_part(coalesce(p_path,''), '/', 1);
$$;

create or replace function public.storage_filename_from_path(p_path text)
returns text
language sql
immutable
as $$
  select split_part(coalesce(p_path,''), '/', 2);
$$;

create or replace function public.image_prefix_from_path(p_path text)
returns text
language sql
immutable
as $$
  select split_part(public.storage_filename_from_path(p_path), '-', 1);
$$;

-- ATTRACTION IMAGES: <attraction_id>/cover-* | gallery-*
create table public.attraction_images (
  id_aim uuid not null default gen_random_uuid(),
  attraction_id_aim uuid not null,
  path_aim text not null,
  sort_order_aim integer,
  created_at_aim timestamp with time zone default now(),

  constraint attraction_images_pkey primary key (id_aim),
  constraint attraction_images_attraction_id_fkey
    foreign key (attraction_id_aim) references public.attractions(id_atr) on delete cascade,

  constraint attraction_images_folder_chk
    check (public.storage_folder_from_path(path_aim) = attraction_id_aim::text),

  constraint attraction_images_prefix_chk
    check (public.image_prefix_from_path(path_aim) in ('cover','gallery')),

  constraint attraction_images_path_uq unique (path_aim)
);

-- BUSINESS IMAGES: <business_id>/logo-* | cover-* | gallery-*
create table public.business_images (
  id_bim uuid not null default gen_random_uuid(),
  business_id_bim uuid not null,
  path_bim text not null,
  sort_order_bim integer,
  created_at_bim timestamp with time zone default now(),

  constraint business_images_pkey primary key (id_bim),
  constraint business_images_business_id_fkey
    foreign key (business_id_bim) references public.businesses(id_bus) on delete cascade,

  constraint business_images_folder_chk
    check (public.storage_folder_from_path(path_bim) = business_id_bim::text),

  constraint business_images_prefix_chk
    check (public.image_prefix_from_path(path_bim) in ('logo','cover','gallery')),

  constraint business_images_path_uq unique (path_bim)
);

-- EVENT IMAGES: <event_id>/cover-* | gallery-*
create table public.event_images (
  id_eim uuid not null default gen_random_uuid(),
  event_id_eim uuid not null,
  path_eim text not null,
  sort_order_eim integer,
  created_at_eim timestamp with time zone default now(),

  constraint event_images_pkey primary key (id_eim),
  constraint event_images_event_id_fkey
    foreign key (event_id_eim) references public.events(id_evt) on delete cascade,

  constraint event_images_folder_chk
    check (public.storage_folder_from_path(path_eim) = event_id_eim::text),

  constraint event_images_prefix_chk
    check (public.image_prefix_from_path(path_eim) in ('cover','gallery')),

  constraint event_images_path_uq unique (path_eim)
);

-- PRODUCT IMAGES: <product_id>/main-* | secondary-*
create table public.product_images (
  id_pim uuid not null default gen_random_uuid(),
  product_id_pim uuid not null,
  path_pim text not null,
  sort_order_pim integer,
  created_at_pim timestamp with time zone default now(),

  constraint product_images_pkey primary key (id_pim),
  constraint product_images_product_id_fkey
    foreign key (product_id_pim) references public.products(id_prd) on delete cascade,

  constraint product_images_folder_chk
    check (public.storage_folder_from_path(path_pim) = product_id_pim::text),

  constraint product_images_prefix_chk
    check (public.image_prefix_from_path(path_pim) in ('main','secondary')),

  constraint product_images_path_uq unique (path_pim)
);

-- PROMOTION IMAGES: <promotion_id>/flyer-*
create table public.promotion_images (
  id_pim uuid not null default gen_random_uuid(),
  promotion_id_pim uuid not null,
  path_pim text not null,
  created_at_pim timestamp with time zone default now(),

  constraint promotion_images_pkey primary key (id_pim),
  constraint promotion_images_promotion_id_fkey
    foreign key (promotion_id_pim) references public.promotions(id_prm) on delete cascade,

  constraint promotion_images_folder_chk
    check (public.storage_folder_from_path(path_pim) = promotion_id_pim::text),

  constraint promotion_images_prefix_chk
    check (public.image_prefix_from_path(path_pim) in ('flyer')),

  constraint promotion_images_path_uq unique (path_pim)
);

-- ============================================================
-- 7) LIKES (entidades + likes en reviews)
-- ============================================================

create table public.event_likes (
  event_id_elk uuid not null,
  user_id_elk uuid not null,
  created_at_elk timestamp with time zone not null default now(),
  constraint event_likes_pkey primary key (event_id_elk, user_id_elk),
  constraint event_likes_event_id_fkey foreign key (event_id_elk) references public.events(id_evt) on delete cascade,
  constraint event_likes_user_id_fkey foreign key (user_id_elk) references public.profiles(id_prf) on delete cascade
);

create table public.attraction_likes (
  attraction_id_alk uuid not null,
  user_id_alk uuid not null,
  created_at_alk timestamp with time zone not null default now(),
  constraint attraction_likes_pkey primary key (attraction_id_alk, user_id_alk),
  constraint attraction_likes_attraction_id_fkey foreign key (attraction_id_alk) references public.attractions(id_atr) on delete cascade,
  constraint attraction_likes_user_id_fkey foreign key (user_id_alk) references public.profiles(id_prf) on delete cascade
);

create table public.business_likes (
  business_id_blk uuid not null,
  user_id_blk uuid not null,
  created_at_blk timestamp with time zone not null default now(),
  constraint business_likes_pkey primary key (business_id_blk, user_id_blk),
  constraint business_likes_business_id_fkey foreign key (business_id_blk) references public.businesses(id_bus) on delete cascade,
  constraint business_likes_user_id_fkey foreign key (user_id_blk) references public.profiles(id_prf) on delete cascade
);

create table public.event_review_likes (
  review_id_erl uuid not null,
  user_id_erl uuid not null,
  created_at_erl timestamp with time zone not null default now(),
  constraint event_review_likes_pkey primary key (review_id_erl, user_id_erl),
  constraint event_review_likes_review_id_fkey foreign key (review_id_erl) references public.event_reviews(id_erv) on delete cascade,
  constraint event_review_likes_user_id_fkey foreign key (user_id_erl) references public.profiles(id_prf) on delete cascade
);

create table public.attraction_review_likes (
  review_id_arl uuid not null,
  user_id_arl uuid not null,
  created_at_arl timestamp with time zone not null default now(),
  constraint attraction_review_likes_pkey primary key (review_id_arl, user_id_arl),
  constraint attraction_review_likes_review_id_fkey foreign key (review_id_arl) references public.attraction_reviews(id_arv) on delete cascade,
  constraint attraction_review_likes_user_id_fkey foreign key (user_id_arl) references public.profiles(id_prf) on delete cascade
);

create table public.business_review_likes (
  review_id_brl uuid not null,
  user_id_brl uuid not null,
  created_at_brl timestamp with time zone not null default now(),
  constraint business_review_likes_pkey primary key (review_id_brl, user_id_brl),
  constraint business_review_likes_review_id_fkey foreign key (review_id_brl) references public.business_reviews(id_brv) on delete cascade,
  constraint business_review_likes_user_id_fkey foreign key (user_id_brl) references public.profiles(id_prf) on delete cascade
);

-- ============================================================
-- 9.2) INTERACTIONS: ENTIDADES
-- ============================================================

create table public.business_interactions (
  id_bin uuid not null default gen_random_uuid(),
  business_id_bin uuid not null,
  user_id_bin uuid, -- NULL = visitante anónimo
  interaction_type_bin public.interaction_type not null,
  ip_address_bin inet,
  user_agent_bin text,
  created_at_bin timestamp with time zone not null default now(),

  constraint business_interactions_pkey primary key (id_bin),
  constraint business_interactions_business_fkey
    foreign key (business_id_bin) references public.businesses(id_bus) on delete cascade,
  constraint business_interactions_user_fkey
    foreign key (user_id_bin) references public.profiles(id_prf) on delete set null
);

create table public.event_interactions (
  id_ein uuid not null default gen_random_uuid(),
  event_id_ein uuid not null,
  user_id_ein uuid,
  interaction_type_ein public.interaction_type not null,
  ip_address_ein inet,
  user_agent_ein text,
  created_at_ein timestamp with time zone not null default now(),

  constraint event_interactions_pkey primary key (id_ein),
  constraint event_interactions_event_fkey
    foreign key (event_id_ein) references public.events(id_evt) on delete cascade,
  constraint event_interactions_user_fkey
    foreign key (user_id_ein) references public.profiles(id_prf) on delete set null
);

create table public.attraction_interactions (
  id_ain uuid not null default gen_random_uuid(),
  attraction_id_ain uuid not null,
  user_id_ain uuid,
  interaction_type_ain public.interaction_type not null,
  ip_address_ain inet,
  user_agent_ain text,
  created_at_ain timestamp with time zone not null default now(),

  constraint attraction_interactions_pkey primary key (id_ain),
  constraint attraction_interactions_attraction_fkey
    foreign key (attraction_id_ain) references public.attractions(id_atr) on delete cascade,
  constraint attraction_interactions_user_fkey
    foreign key (user_id_ain) references public.profiles(id_prf) on delete set null
);

-- ============================================================
-- 9.3) INTERACTIONS: REVIEWS
-- ============================================================

create table public.business_review_interactions (
  id_bri uuid not null default gen_random_uuid(),
  review_id_bri uuid not null,
  user_id_bri uuid,
  interaction_type_bri public.interaction_type not null,
  created_at_bri timestamp with time zone not null default now(),

  constraint business_review_interactions_pkey primary key (id_bri),
  constraint business_review_interactions_review_fkey
    foreign key (review_id_bri) references public.business_reviews(id_brv) on delete cascade,
  constraint business_review_interactions_user_fkey
    foreign key (user_id_bri) references public.profiles(id_prf) on delete set null
);

create table public.event_review_interactions (
  id_eri uuid not null default gen_random_uuid(),
  review_id_eri uuid not null,
  user_id_eri uuid,
  interaction_type_eri public.interaction_type not null,
  created_at_eri timestamp with time zone not null default now(),

  constraint event_review_interactions_pkey primary key (id_eri),
  constraint event_review_interactions_review_fkey
    foreign key (review_id_eri) references public.event_reviews(id_erv) on delete cascade,
  constraint event_review_interactions_user_fkey
    foreign key (user_id_eri) references public.profiles(id_prf) on delete set null
);

create table public.attraction_review_interactions (
  id_ari uuid not null default gen_random_uuid(),
  review_id_ari uuid not null,
  user_id_ari uuid,
  interaction_type_ari public.interaction_type not null,
  created_at_ari timestamp with time zone not null default now(),

  constraint attraction_review_interactions_pkey primary key (id_ari),
  constraint attraction_review_interactions_review_fkey
    foreign key (review_id_ari) references public.attraction_reviews(id_arv) on delete cascade,
  constraint attraction_review_interactions_user_fkey
    foreign key (user_id_ari) references public.profiles(id_prf) on delete set null
);

create table public.product_review_interactions (
  id_pri uuid not null default gen_random_uuid(),
  review_id_pri uuid not null,
  user_id_pri uuid,
  interaction_type_pri public.interaction_type not null,
  created_at_pri timestamp with time zone not null default now(),

  constraint product_review_interactions_pkey primary key (id_pri),
  constraint product_review_interactions_review_fkey
    foreign key (review_id_pri) references public.product_reviews(id_prv) on delete cascade,
  constraint product_review_interactions_user_fkey
    foreign key (user_id_pri) references public.profiles(id_prf) on delete set null
);
-- ============================================================
-- 10) BUCKETS
-- ============================================================

insert into storage.buckets (
  id,
  name,
  owner,
  created_at,
  updated_at,
  public,
  avif_autodetection,
  file_size_limit,
  allowed_mime_types,
  owner_id,
  type
)
values
  (
    'profiles-images',
    'profiles-images',
    null,
    now(),
    now(),
    true,
    false,
    null,
    null,
    null,
    'STANDARD'
  ),
  (
    'attractions-images',
    'attractions-images',
    null,
    now(),
    now(),
    true,
    false,
    null,
    null,
    null,
    'STANDARD'
  ),
  (
    'business-images',
    'business-images',
    null,
    now(),
    now(),
    true,
    false,
    null,
    null,
    null,
    'STANDARD'
  ),
  (
    'events-images',
    'events-images',
    null,
    now(),
    now(),
    true,
    false,
    null,
    null,
    null,
    'STANDARD'
  ),
  (
    'product-images',
    'product-images',
    null,
    now(),
    now(),
    true,
    false,
    null,
    null,
    null,
    'STANDARD'
  ),
  (
    'promotions-images',
    'promotions-images',
    null,
    now(),
    now(),
    true,
    false,
    null,
    null,
    null,
    'STANDARD'
  )
on conflict (id) do nothing;

-- ============================================================
-- 9) ÍNDICES
-- 11) Políticas
-- (pendientes según tu comentario)
-- ============================================================
