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
-- ============================================================
-- Migración: Tabla de suscripciones individuales
-- ============================================================
-- Cada registro representa una suscripción individual que necesita
-- aprobación del admin. Un usuario puede tener múltiples suscripciones.
-- ============================================================

-- Paso 1: Crear enum para estado de suscripción
create type public.subscription_status as enum (
  'pending',    -- Pendiente de aprobación
  'approved',   -- Aprobada por admin
  'rejected',   -- Rechazada por admin
  'cancelled'   -- Cancelada por usuario
);

-- Paso 2: Crear tabla de suscripciones individuales
create table public.profile_subscriptions (
  id_psub uuid primary key default gen_random_uuid(),
  profile_id_psub uuid not null references public.profiles(id_prf) on delete cascade,
  subscription_type_psub public.subscription_type not null,
  payment_reference_psub text not null,
  payment_note_psub text,
  status_psub public.subscription_status not null default 'pending',
  subscribed_at_psub timestamptz not null default now(),
  approved_at_psub timestamptz,
  approved_by_psub uuid references public.profiles(id_prf) on delete set null,
  rejected_at_psub timestamptz,
  rejected_by_psub uuid references public.profiles(id_prf) on delete set null,
  rejection_reason_psub text,
  cancelled_at_psub timestamptz,
  created_at_psub timestamptz not null default now(),
  updated_at_psub timestamptz not null default now()
);

-- Paso 3: Índices para mejor rendimiento
create index idx_profile_subscriptions_profile_id on public.profile_subscriptions(profile_id_psub);
create index idx_profile_subscriptions_status on public.profile_subscriptions(status_psub);
create index idx_profile_subscriptions_type on public.profile_subscriptions(subscription_type_psub);
create index idx_profile_subscriptions_profile_status on public.profile_subscriptions(profile_id_psub, status_psub);

-- Paso 4: Trigger para actualizar updated_at
create or replace function public.update_profile_subscriptions_updated_at()
returns trigger as $$
begin
  new.updated_at_psub = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_update_profile_subscriptions_updated_at
  before update on public.profile_subscriptions
  for each row
  execute function public.update_profile_subscriptions_updated_at();

-- Paso 5: Comentarios
comment on table public.profile_subscriptions is 
'Registro individual de cada suscripción premium. Cada pago genera un nuevo registro que debe ser aprobado por un admin.';

comment on column public.profile_subscriptions.id_psub is 'ID único de la suscripción';
comment on column public.profile_subscriptions.profile_id_psub is 'ID del usuario que compró la suscripción';
comment on column public.profile_subscriptions.subscription_type_psub is 'Tipo de suscripción adquirida';
comment on column public.profile_subscriptions.payment_reference_psub is 'Número de referencia del pago (SINPE/Transferencia)';
comment on column public.profile_subscriptions.payment_note_psub is 'Nota adicional del pago';
comment on column public.profile_subscriptions.status_psub is 'Estado de la suscripción: pending, approved, rejected, cancelled';
comment on column public.profile_subscriptions.subscribed_at_psub is 'Fecha en que el usuario realizó el pago';
comment on column public.profile_subscriptions.approved_at_psub is 'Fecha en que un admin aprobó la suscripción';
comment on column public.profile_subscriptions.approved_by_psub is 'ID del admin que aprobó';
comment on column public.profile_subscriptions.rejected_at_psub is 'Fecha en que un admin rechazó la suscripción';
comment on column public.profile_subscriptions.rejected_by_psub is 'ID del admin que rechazó';
comment on column public.profile_subscriptions.rejection_reason_psub is 'Razón del rechazo';
comment on column public.profile_subscriptions.cancelled_at_psub is 'Fecha en que el usuario canceló';

-- Paso 6: Row Level Security (RLS)
alter table public.profile_subscriptions enable row level security;

-- Policy: Los usuarios pueden ver solo sus propias suscripciones
create policy "Users can view own subscriptions"
  on public.profile_subscriptions
  for select
  using (auth.uid() = profile_id_psub);

-- Policy: Los usuarios pueden crear sus propias suscripciones
create policy "Users can create own subscriptions"
  on public.profile_subscriptions
  for insert
  with check (auth.uid() = profile_id_psub);

-- Policy: Los usuarios pueden cancelar sus propias suscripciones pendientes
create policy "Users can cancel own pending subscriptions"
  on public.profile_subscriptions
  for update
  using (
    auth.uid() = profile_id_psub 
    and status_psub = 'pending'
  )
  with check (
    auth.uid() = profile_id_psub 
    and status_psub = 'cancelled'
  );

-- Policy: Los admins pueden ver todas las suscripciones
create policy "Admins can view all subscriptions"
  on public.profile_subscriptions
  for select
  using (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
      and role_prf = 'admin'
    )
  );

-- Policy: Los admins pueden aprobar/rechazar suscripciones
create policy "Admins can approve or reject subscriptions"
  on public.profile_subscriptions
  for update
  using (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
      and role_prf = 'admin'
    )
  );

-- 1) Create subscription type enum
create type public.subscription_type_new as enum (
  'promotions',
  'dashboard',
  'gallery_business',
  'package_products',
  'gallery_attractions',
  'gallery_events',
  'full_premium'
);


-- ============================================================
-- 1) CATEGORIES
-- ============================================================

create table public.categories (
  id_cat uuid not null default gen_random_uuid(),
  name_cat character varying unique,
  created_at_cat timestamp with time zone default now(),
  parent_id_cat uuid,
  sort_order_cat integer default 0,
  is_active_cat boolean default true,
  constraint categories_pkey primary key (id_cat),
  constraint categories_parent_id_fkey foreign key (parent_id_cat) 
    references public.categories(id_cat) on delete set null
);
-- Política UPDATE para profiles
create policy "profiles_update_own"
  on public.profiles for update
  using (id_prf = auth.uid())
  with check (
    id_prf = auth.uid()
    and is_active_prf = (select is_active_prf from public.profiles where id_prf = auth.uid())
    and public.is_valid_role_update(
      (select role_prf from public.profiles where id_prf = auth.uid()),
      role_prf
    )
  );
-- Índices para categorías
create index idx_categories_parent_id on public.categories(parent_id_cat);
create index idx_categories_is_active on public.categories(is_active_cat);

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
-- Crear tabla de catálogo de suscripciones
CREATE TABLE public.subscription (
  id_sub UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_sub public.subscription_type NOT NULL UNIQUE,
  name_sub VARCHAR(100) NOT NULL,
  description_sub TEXT NOT NULL,
  price_sub NUMERIC(10,2) NOT NULL DEFAULT 0,
  features_sub TEXT[] NOT NULL DEFAULT '{}',
  is_recurring_sub BOOLEAN NOT NULL DEFAULT false,
  is_active_sub BOOLEAN NOT NULL DEFAULT true,
  display_order_sub INTEGER NOT NULL DEFAULT 0,
  created_at_sub TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at_sub TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_subscription_type ON public.subscription(type_sub);
CREATE INDEX idx_subscription_active ON public.subscription(is_active_sub);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at_sub = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_subscription_updated_at
  BEFORE UPDATE ON public.subscription
  FOR EACH ROW
  EXECUTE FUNCTION public.update_subscription_updated_at();

-- RLS
ALTER TABLE public.subscription ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver planes activos
CREATE POLICY "Anyone can view active subscriptions"
  ON public.subscription
  FOR SELECT
  USING (is_active_sub = true);

-- Admins pueden ver todos
CREATE POLICY "Admins can view all subscriptions"
  ON public.subscription
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id_prf = auth.uid()
      AND role_prf = 'admin'
    )
  );

-- Admins pueden insertar/actualizar
CREATE POLICY "Admins can manage subscriptions"
  ON public.subscription
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id_prf = auth.uid()
      AND role_prf = 'admin'
    )
  );

-- Datos iniciales (opcional)
INSERT INTO public.subscription (type_sub, name_sub, description_sub, price_sub, features_sub, is_recurring_sub, is_active_sub, display_order_sub)
VALUES 
  ('promotions', 'Promociones', 'Hasta 10 promociones activas', 2500, ARRAY['Hasta 10 promociones simultáneas', 'Destacar en sección de promociones', 'Mayor visibilidad para tus ofertas'], false, true, 1),
  ('dashboard', 'Dashboard de Negocio', 'Estadísticas completas de tu negocio', 3500, ARRAY['Dashboard con métricas en tiempo real', 'Estadísticas de favoritos', 'Clicks en contacto y redes sociales', 'Interacciones con productos'], true, true, 2),
  ('gallery_business', 'Galería Empresa', 'Hasta 10 fotos para tu negocio', 1500, ARRAY['Hasta 10 fotos en galería', 'Fotos en alta resolución', 'Galería destacada'], false, true, 3),
  ('package_products', 'Paquete Productos', 'Publica hasta 20 productos por negocio', 5000, ARRAY['Hasta 20 productos por negocio', '2 fotos por producto', 'Catálogo completo'], false, true, 4),
  ('gallery_attractions', 'Galería Atracciones', 'Hasta 10 fotos para tus atracciones', 2000, ARRAY['Hasta 10 fotos por atracción', 'Mayor visibilidad', 'Destaca en búsquedas'], false, true, 5),
  ('gallery_events', 'Galería Eventos', 'Hasta 10 fotos para tus eventos', 2000, ARRAY['Hasta 10 fotos por evento', 'Mayor visibilidad', 'Destaca en búsquedas'], false, true, 6),
  ('full_premium', 'Premium Completo', 'Todas las herramientas para hacer crecer tu negocio', 10000, ARRAY['Dashboard con estadísticas completas', 'Hasta 10 promociones simultáneas', 'Galería extendida para empresas (10 fotos)', 'Hasta 20 productos con 2 fotos cada uno', 'Soporte prioritario'], true, true, 7);

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

--Control de ecxpiración de suscripciones mensuales (nuevo campo + función)
-- Paso 1: Agregar 'expired' al enum subscription_status
ALTER TYPE public.subscription_status ADD VALUE IF NOT EXISTS 'expired';

-- Paso 2: Agregar campo de expiración a profile_subscriptions
ALTER TABLE public.profile_subscriptions 
ADD COLUMN IF NOT EXISTS expires_at_psub timestamptz;

-- Paso 3: Agregar índice para búsquedas de expiración
CREATE INDEX IF NOT EXISTS idx_profile_subscriptions_expires_at 
ON public.profile_subscriptions(expires_at_psub) 
WHERE expires_at_psub IS NOT NULL AND status_psub = 'approved';

-- Paso 4: Comentario del nuevo campo
COMMENT ON COLUMN public.profile_subscriptions.expires_at_psub IS 
'Fecha de expiración para suscripciones mensuales. NULL para paquetes de pago único.';

-- Paso 5: Función que expira las suscripciones mensuales vencidas
CREATE OR REPLACE FUNCTION public.expire_monthly_subscriptions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expired_count integer;
BEGIN
  -- Actualizar suscripciones que han expirado
  UPDATE public.profile_subscriptions
  SET 
    status_psub = 'expired',
    updated_at_psub = now()
  WHERE 
    status_psub = 'approved'
    AND expires_at_psub IS NOT NULL
    AND expires_at_psub <= now();
  
  -- Obtener cantidad de filas afectadas
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  -- Log opcional (puedes ver en los logs de Supabase)
  RAISE NOTICE 'Expired % monthly subscriptions at %', expired_count, now();
  
  RETURN expired_count;
END;
$$;

-- Paso 6: Grant para que la función pueda ser llamada por service_role
GRANT EXECUTE ON FUNCTION public.expire_monthly_subscriptions() TO service_role;

-- Paso 7: Función para establecer fecha de expiración al aprobar (helper)
-- Esta función calcula 1 mes desde la fecha de aprobación
CREATE OR REPLACE FUNCTION public.calculate_subscription_expiry(
  subscription_type text,
  approval_date timestamptz DEFAULT now()
)
RETURNS timestamptz
LANGUAGE plpgsql
AS $$
BEGIN
  -- Solo los tipos mensuales tienen expiración
  IF subscription_type IN ('dashboard', 'full_premium') THEN
    RETURN approval_date + INTERVAL '1 month';
  ELSE
    -- Paquetes de pago único no expiran
    RETURN NULL;
  END IF;
END;
$$;


 SELECT cron.schedule(
  'expire-monthly-subscriptions',  -- nombre del job
   '0 0 * * *',                     -- cron: cada día a medianoche
   $$SELECT public.expire_monthly_subscriptions()$$
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

-- =============================================
-- TABLA: business_contact_clicks
-- Registra cada click en botones de contacto
-- =============================================

create table public.business_contact_clicks (
  id_bcc uuid not null default gen_random_uuid(),
  business_id_bcc uuid not null,
  user_id_bcc uuid, -- puede ser null para usuarios no autenticados
  contact_type_bcc character varying(50) not null, -- 'phone', 'email', 'website', 'whatsapp', 'facebook', 'instagram', 'tiktok', etc.
  created_at_bcc timestamp with time zone not null default now(),
  constraint business_contact_clicks_pkey primary key (id_bcc),
  constraint business_contact_clicks_business_id_fkey foreign key (business_id_bcc) 
    references public.businesses(id_bus) on delete cascade
);

-- Índices para consultas eficientes
create index idx_business_contact_clicks_business on public.business_contact_clicks(business_id_bcc);
create index idx_business_contact_clicks_created on public.business_contact_clicks(created_at_bcc);
create index idx_business_contact_clicks_type on public.business_contact_clicks(contact_type_bcc);

-- Habilitar RLS
alter table public.business_contact_clicks enable row level security;

-- Políticas RLS
create policy "business_contact_clicks_insert_all"
  on public.business_contact_clicks for insert
  to authenticated, anon
  with check (true);

create policy "business_contact_clicks_select_owner"
  on public.business_contact_clicks for select
  to authenticated
  using (
    exists (
      select 1 from public.businesses 
      where id_bus = business_id_bcc 
      and owner_id_bus = auth.uid()
    )
  );

create policy "business_contact_clicks_select_admin"
  on public.business_contact_clicks for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles 
      where id_prf = auth.uid() 
      and role_prf = 'admin'
    )
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

-- Control de consumo de suscripciones 
-- ============================================================

-- ============================================================
-- 1) Agregar columna quota_sub a tabla subscription
-- ============================================================

ALTER TABLE public.subscription 
ADD COLUMN IF NOT EXISTS quota_sub INTEGER NOT NULL DEFAULT 0;

-- Actualizar cuotas por tipo de suscripción
UPDATE public.subscription SET quota_sub = 20 WHERE type_sub = 'package_products';
UPDATE public.subscription SET quota_sub = 10 WHERE type_sub = 'gallery_business';
UPDATE public.subscription SET quota_sub = 10 WHERE type_sub = 'gallery_attractions';
UPDATE public.subscription SET quota_sub = 10 WHERE type_sub = 'promotions';
UPDATE public.subscription SET quota_sub = 0 WHERE type_sub = 'dashboard'; -- No consume recursos
UPDATE public.subscription SET quota_sub = 999 WHERE type_sub = 'full_premium'; -- Prácticamente ilimitado

COMMENT ON COLUMN public.subscription.quota_sub IS 'Cantidad de recursos que otorga esta suscripción (ej: 20 productos, 10 fotos)';

-- ============================================================
-- 2) Crear enum para tipos de recursos
-- ============================================================

CREATE TYPE public.resource_type AS ENUM (
  'product',           -- Productos de negocio
  'photo_business',    -- Fotos de galería de negocio
  'photo_attraction',  -- Fotos de galería de atracción
  'photo_event',       -- Fotos de galería de evento
  'promotion'          -- Promociones
);

-- ============================================================
-- 3) Crear tabla subscription_usage
-- ============================================================
-- Esta tabla trackea cuántos recursos ha consumido cada suscripción
-- por entidad específica (negocio, atracción, evento)

CREATE TABLE public.subscription_usage (
  id_sus UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relación con la suscripción comprada y aprobada
  profile_subscription_id_sus UUID NOT NULL 
    REFERENCES public.profile_subscriptions(id_psub) ON DELETE CASCADE,
  
  -- Usuario dueño (denormalizado para consultas rápidas)
  profile_id_sus UUID NOT NULL 
    REFERENCES public.profiles(id_prf) ON DELETE CASCADE,
  
  -- Tipo de recurso que se está consumiendo
  resource_type_sus public.resource_type NOT NULL,
  
  -- Entidad a la que aplica el consumo
  -- Solo uno de estos debe estar poblado según resource_type
  business_id_sus UUID REFERENCES public.businesses(id_bus) ON DELETE CASCADE,
  attraction_id_sus UUID REFERENCES public.attractions(id_atr) ON DELETE CASCADE,
  event_id_sus UUID REFERENCES public.events(id_evt) ON DELETE CASCADE,
  
  -- Control de cuota
  max_quota_sus INTEGER NOT NULL,      -- Cuota máxima de esta suscripción
  used_count_sus INTEGER NOT NULL DEFAULT 0,  -- Cantidad usada actualmente
  
  -- Timestamps
  created_at_sus TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at_sus TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraint: Solo una entrada por suscripción + tipo + entidad
  CONSTRAINT subscription_usage_unique UNIQUE (
    profile_subscription_id_sus, 
    resource_type_sus, 
    business_id_sus,
    attraction_id_sus,
    event_id_sus
  ),
  
  -- Constraint: used_count no puede exceder max_quota
  CONSTRAINT subscription_usage_quota_check 
    CHECK (used_count_sus >= 0 AND used_count_sus <= max_quota_sus),
    
  -- Constraint: Debe tener exactamente una entidad según el tipo
  CONSTRAINT subscription_usage_entity_check CHECK (
    (resource_type_sus IN ('product', 'photo_business', 'promotion') AND business_id_sus IS NOT NULL AND attraction_id_sus IS NULL AND event_id_sus IS NULL) OR
    (resource_type_sus = 'photo_attraction' AND attraction_id_sus IS NOT NULL AND business_id_sus IS NULL AND event_id_sus IS NULL) OR
    (resource_type_sus = 'photo_event' AND event_id_sus IS NOT NULL AND business_id_sus IS NULL AND attraction_id_sus IS NULL)
  )
);

-- ============================================================
-- 4) Índices para mejor rendimiento
-- ============================================================

CREATE INDEX idx_subscription_usage_profile_sub 
  ON public.subscription_usage(profile_subscription_id_sus);
  
CREATE INDEX idx_subscription_usage_profile 
  ON public.subscription_usage(profile_id_sus);
  
CREATE INDEX idx_subscription_usage_business 
  ON public.subscription_usage(business_id_sus) 
  WHERE business_id_sus IS NOT NULL;
  
CREATE INDEX idx_subscription_usage_attraction 
  ON public.subscription_usage(attraction_id_sus) 
  WHERE attraction_id_sus IS NOT NULL;
  
CREATE INDEX idx_subscription_usage_event 
  ON public.subscription_usage(event_id_sus) 
  WHERE event_id_sus IS NOT NULL;

CREATE INDEX idx_subscription_usage_type_business 
  ON public.subscription_usage(resource_type_sus, business_id_sus) 
  WHERE business_id_sus IS NOT NULL;

-- ============================================================
-- 5) Trigger para updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_subscription_usage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at_sus = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_subscription_usage_updated_at
  BEFORE UPDATE ON public.subscription_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_subscription_usage_updated_at();

-- ============================================================
-- 6) Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.subscription_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Los usuarios pueden ver su propio consumo
CREATE POLICY "Users can view own usage"
  ON public.subscription_usage
  FOR SELECT
  USING (auth.uid() = profile_id_sus);

-- Policy: Los usuarios pueden insertar su propio consumo
CREATE POLICY "Users can insert own usage"
  ON public.subscription_usage
  FOR INSERT
  WITH CHECK (auth.uid() = profile_id_sus);

-- Policy: Los usuarios pueden actualizar su propio consumo
CREATE POLICY "Users can update own usage"
  ON public.subscription_usage
  FOR UPDATE
  USING (auth.uid() = profile_id_sus)
  WITH CHECK (auth.uid() = profile_id_sus);

-- Policy: Los admins pueden ver todo
CREATE POLICY "Admins can view all usage"
  ON public.subscription_usage
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id_prf = auth.uid()
      AND role_prf = 'admin'
    )
  );

-- Policy: Los admins pueden gestionar todo
CREATE POLICY "Admins can manage all usage"
  ON public.subscription_usage
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id_prf = auth.uid()
      AND role_prf = 'admin'
    )
  );

-- ============================================================
-- 7) Comentarios de documentación
-- ============================================================

COMMENT ON TABLE public.subscription_usage IS 
'Trackea el consumo de recursos de cada suscripción aprobada por entidad (negocio/atracción/evento)';

COMMENT ON COLUMN public.subscription_usage.profile_subscription_id_sus IS 
'FK a la suscripción aprobada que otorga la cuota';

COMMENT ON COLUMN public.subscription_usage.profile_id_sus IS 
'Usuario dueño de la suscripción (denormalizado para consultas rápidas)';

COMMENT ON COLUMN public.subscription_usage.resource_type_sus IS 
'Tipo de recurso: product, photo_business, photo_attraction, photo_event, promotion';

COMMENT ON COLUMN public.subscription_usage.business_id_sus IS 
'Negocio al que aplica (para productos, fotos de negocio, promociones)';

COMMENT ON COLUMN public.subscription_usage.attraction_id_sus IS 
'Atracción a la que aplica (para fotos de atracción)';

COMMENT ON COLUMN public.subscription_usage.event_id_sus IS 
'Evento al que aplica (para fotos de evento)';

COMMENT ON COLUMN public.subscription_usage.max_quota_sus IS 
'Cuota máxima que otorga esta suscripción';

COMMENT ON COLUMN public.subscription_usage.used_count_sus IS 
'Cantidad de recursos actualmente en uso (aumenta al crear, disminuye al eliminar)';

-- ============================================================
-- 8) Función helper para obtener cuota disponible
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_available_quota(
  p_profile_id UUID,
  p_resource_type public.resource_type,
  p_entity_id UUID
)
RETURNS TABLE (
  total_quota INTEGER,
  total_used INTEGER,
  available INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_subscription_type public.subscription_type;
BEGIN
  -- Determinar qué tipo de suscripción corresponde al recurso
  CASE p_resource_type
    WHEN 'product' THEN v_subscription_type := 'package_products';
    WHEN 'photo_business' THEN v_subscription_type := 'gallery_business';
    WHEN 'photo_attraction' THEN v_subscription_type := 'gallery_attractions';
    WHEN 'photo_event' THEN v_subscription_type := 'gallery_attractions';
    WHEN 'promotion' THEN v_subscription_type := 'promotions';
  END CASE;

  -- Calcular cuota total y usada
  RETURN QUERY
  SELECT 
    COALESCE(SUM(su.max_quota_sus), 0)::INTEGER as total_quota,
    COALESCE(SUM(su.used_count_sus), 0)::INTEGER as total_used,
    (COALESCE(SUM(su.max_quota_sus), 0) - COALESCE(SUM(su.used_count_sus), 0))::INTEGER as available
  FROM public.subscription_usage su
  JOIN public.profile_subscriptions ps ON ps.id_psub = su.profile_subscription_id_sus
  JOIN public.subscription s ON s.type_sub = v_subscription_type
  WHERE su.profile_id_sus = p_profile_id
    AND su.resource_type_sus = p_resource_type
    AND ps.status_psub = 'approved'
    AND (
      (p_resource_type IN ('product', 'photo_business', 'promotion') AND su.business_id_sus = p_entity_id) OR
      (p_resource_type = 'photo_attraction' AND su.attraction_id_sus = p_entity_id) OR
      (p_resource_type = 'photo_event' AND su.event_id_sus = p_entity_id)
    );
END;
$$;

COMMENT ON FUNCTION public.get_available_quota IS 
'Retorna la cuota total, usada y disponible para un tipo de recurso y entidad específica';


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
-- 11) Indices
-- ============================================================

-- ============================================================
-- 11.1) LOCATIONS (jerarquía geográfica)
-- ============================================================
create index idx_provinces_country_id on public.provinces(country_id_prv);
create index idx_cantons_province_id on public.cantons(province_id_ctn);
create index idx_districts_canton_id on public.districts(canton_id_dst);
create index idx_locations_district_id on public.locations(district_id_loc);

-- Índice para búsquedas por coordenadas (consultas de mapa)
create index idx_locations_coords on public.locations(latitude_loc, longitude_loc)
  where latitude_loc is not null and longitude_loc is not null;

-- ============================================================
-- 11.2) BUSINESSES
-- ============================================================
create index idx_businesses_owner_id on public.businesses(owner_id_bus);
create index idx_businesses_location_id on public.businesses(location_id_bus);
create index idx_businesses_reviewed_by on public.businesses(reviewed_by_bus)
  where reviewed_by_bus is not null;

-- Filtros de moderación y estado activo (consultas de listado)
create index idx_businesses_moderation_status on public.businesses(moderation_status_bus);
create index idx_businesses_is_active on public.businesses(is_active_bus);

-- Índice compuesto para listados públicos (aprobados y activos)
create index idx_businesses_public_listing on public.businesses(moderation_status_bus, is_active_bus)
  where moderation_status_bus = 'approved'::public.moderation_status and is_active_bus = true;

-- Ordenamiento por rating y fecha
create index idx_businesses_avg_rating on public.businesses(avg_rating_bus desc);
create index idx_businesses_created_at on public.businesses(created_at_bus desc);

-- ============================================================
-- 11.3) EVENTS
-- ============================================================
create index idx_events_created_by on public.events(created_by_evt);
create index idx_events_location_id on public.events(location_id_evt);
create index idx_events_reviewed_by on public.events(reviewed_by_evt)
  where reviewed_by_evt is not null;

-- Filtros de moderación y estado
create index idx_events_moderation_status on public.events(moderation_status_evt);
create index idx_events_is_active on public.events(is_active_evt);

-- Índice compuesto para listados públicos
create index idx_events_public_listing on public.events(moderation_status_evt, is_active_evt)
  where moderation_status_evt = 'approved'::public.moderation_status and is_active_evt = true;

-- Filtros por fechas (eventos próximos, pasados, en curso)
create index idx_events_start_at on public.events(start_at_evt);
create index idx_events_end_at on public.events(end_at_evt);
create index idx_events_date_range on public.events(start_at_evt, end_at_evt);

-- Eventos gratuitos
create index idx_events_is_free on public.events(is_free_evt)
  where is_free_evt = true;

-- Ordenamiento
create index idx_events_avg_rating on public.events(avg_rating_evt desc);
create index idx_events_created_at on public.events(created_at_evt desc);

-- ============================================================
-- 11.4) ATTRACTIONS
-- ============================================================
create index idx_attractions_submitted_by on public.attractions(submitted_by_atr);
create index idx_attractions_location_id on public.attractions(location_id_atr);
create index idx_attractions_reviewed_by on public.attractions(reviewed_by_atr)
  where reviewed_by_atr is not null;

-- Filtros de moderación y estado
create index idx_attractions_moderation_status on public.attractions(moderation_status_atr);
create index idx_attractions_is_active on public.attractions(is_active_atr);

-- Índice compuesto para listados públicos
create index idx_attractions_public_listing on public.attractions(moderation_status_atr, is_active_atr)
  where moderation_status_atr = 'approved'::public.moderation_status and is_active_atr = true;

-- Ordenamiento
create index idx_attractions_avg_rating on public.attractions(avg_rating_atr desc);
create index idx_attractions_created_at on public.attractions(created_at_atr desc);

-- ============================================================
-- 11.5) PRODUCTS
-- ============================================================
create index idx_products_business_id on public.products(business_id_prd);
create index idx_products_is_active on public.products(is_active_prd);

-- Productos activos de un negocio
create index idx_products_business_active on public.products(business_id_prd, is_active_prd)
  where is_active_prd = true;

-- Ordenamiento
create index idx_products_avg_rating on public.products(avg_rating_prd desc);
create index idx_products_price on public.products(price_prd);
create index idx_products_created_at on public.products(created_at_prd desc);

-- ============================================================
-- 11.6) PROMOTIONS
-- ============================================================
create index idx_promotions_business_id on public.promotions(business_id_prm);
create index idx_promotions_created_by on public.promotions(created_by_prm);
create index idx_promotions_reviewed_by on public.promotions(reviewed_by_prm)
  where reviewed_by_prm is not null;

-- Filtros de estado
create index idx_promotions_moderation_status on public.promotions(moderation_status_prm);
create index idx_promotions_payment_state on public.promotions(payment_state_prm);
create index idx_promotions_is_active on public.promotions(is_active_prm);
create index idx_promotions_scope on public.promotions(scope_prm);

-- Promociones activas y aprobadas (listado público)
create index idx_promotions_public_listing on public.promotions(moderation_status_prm, payment_state_prm, is_active_prm)
  where moderation_status_prm = 'approved'::public.moderation_status 
    and payment_state_prm = 'paid'::public.payment_state 
    and is_active_prm = true;

-- Filtros por fechas (promociones vigentes)
create index idx_promotions_start_at on public.promotions(start_at_prm);
create index idx_promotions_end_at on public.promotions(end_at_prm);
create index idx_promotions_date_range on public.promotions(start_at_prm, end_at_prm);

create index idx_promotions_created_at on public.promotions(created_at_prm desc);

-- ============================================================
-- 11.7) CATEGORY MAPS (FKs para JOINs)
-- ============================================================
-- Nota: Las PKs compuestas ya indexan (entity_id, category_id)
-- Estos índices adicionales optimizan búsquedas por categoría
create index idx_business_category_map_category on public.business_category_map(category_id_bcm);
create index idx_event_category_map_category on public.event_category_map(category_id_ecm);
create index idx_attraction_category_map_category on public.attraction_category_map(category_id_acm);
create index idx_product_category_map_category on public.product_category_map(category_id_pcm);
create index idx_promotion_category_map_category on public.promotion_category_map(category_id_pcr);

-- ============================================================
-- 11.8) PROMOTION RELATIONS
-- ============================================================
create index idx_promotion_products_product on public.promotion_products(product_id_ppr);
create index idx_promotion_scope_categories_category on public.promotion_scope_categories(category_id_psc);
create index idx_promotion_combo_items_promotion on public.promotion_combo_items(promotion_id_pci);
create index idx_promotion_combo_items_product on public.promotion_combo_items(product_id_pci);

-- ============================================================
-- 11.9) REVIEWS
-- ============================================================
create index idx_business_reviews_business on public.business_reviews(business_id_brv);
create index idx_business_reviews_user on public.business_reviews(user_id_brv);
create index idx_business_reviews_created_at on public.business_reviews(created_at_brv desc);

create index idx_event_reviews_event on public.event_reviews(event_id_erv);
create index idx_event_reviews_user on public.event_reviews(user_id_erv);
create index idx_event_reviews_created_at on public.event_reviews(created_at_erv desc);

create index idx_attraction_reviews_attraction on public.attraction_reviews(attraction_id_arv);
create index idx_attraction_reviews_user on public.attraction_reviews(user_id_arv);
create index idx_attraction_reviews_created_at on public.attraction_reviews(created_at_arv desc);

create index idx_product_reviews_product on public.product_reviews(product_id_prv);
create index idx_product_reviews_user on public.product_reviews(user_id_prv);
create index idx_product_reviews_created_at on public.product_reviews(created_at_prv desc);

-- ============================================================
-- 11.10) IMAGES (búsqueda por entidad)
-- ============================================================
create index idx_attraction_images_attraction on public.attraction_images(attraction_id_aim);
create index idx_attraction_images_sort on public.attraction_images(attraction_id_aim, sort_order_aim);

create index idx_business_images_business on public.business_images(business_id_bim);
create index idx_business_images_sort on public.business_images(business_id_bim, sort_order_bim);

create index idx_event_images_event on public.event_images(event_id_eim);
create index idx_event_images_sort on public.event_images(event_id_eim, sort_order_eim);

create index idx_product_images_product on public.product_images(product_id_pim);
create index idx_product_images_sort on public.product_images(product_id_pim, sort_order_pim);

create index idx_promotion_images_promotion on public.promotion_images(promotion_id_pim);

-- ============================================================
-- 11.11) LIKES
-- ============================================================
-- Nota: PKs compuestas ya indexan (entity_id, user_id)
-- Estos índices optimizan "mis likes" por usuario
create index idx_event_likes_user on public.event_likes(user_id_elk);
create index idx_attraction_likes_user on public.attraction_likes(user_id_alk);
create index idx_business_likes_user on public.business_likes(user_id_blk);

-- Review likes
create index idx_event_review_likes_user on public.event_review_likes(user_id_erl);
create index idx_attraction_review_likes_user on public.attraction_review_likes(user_id_arl);
create index idx_business_review_likes_user on public.business_review_likes(user_id_brl);

-- ============================================================
-- 11.12) INTERACTIONS (analytics)
-- ============================================================
-- Índices para análisis por entidad
create index idx_business_interactions_business on public.business_interactions(business_id_bin);
create index idx_business_interactions_type on public.business_interactions(interaction_type_bin);
create index idx_business_interactions_created_at on public.business_interactions(created_at_bin desc);
create index idx_business_interactions_user on public.business_interactions(user_id_bin)
  where user_id_bin is not null;

create index idx_event_interactions_event on public.event_interactions(event_id_ein);
create index idx_event_interactions_type on public.event_interactions(interaction_type_ein);
create index idx_event_interactions_created_at on public.event_interactions(created_at_ein desc);
create index idx_event_interactions_user on public.event_interactions(user_id_ein)
  where user_id_ein is not null;

create index idx_attraction_interactions_attraction on public.attraction_interactions(attraction_id_ain);
create index idx_attraction_interactions_type on public.attraction_interactions(interaction_type_ain);
create index idx_attraction_interactions_created_at on public.attraction_interactions(created_at_ain desc);
create index idx_attraction_interactions_user on public.attraction_interactions(user_id_ain)
  where user_id_ain is not null;

-- Review interactions
create index idx_business_review_interactions_review on public.business_review_interactions(review_id_bri);
create index idx_event_review_interactions_review on public.event_review_interactions(review_id_eri);
create index idx_attraction_review_interactions_review on public.attraction_review_interactions(review_id_ari);
create index idx_product_review_interactions_review on public.product_review_interactions(review_id_pri);

-- ============================================================
-- 12) ROW LEVEL SECURITY (RLS) - POLÍTICAS
-- ============================================================

-- ============================================================
-- 12.0) FUNCIONES HELPER PARA RLS
-- ============================================================
-- IMPORTANTE: Estas funciones usan SECURITY DEFINER para bypass RLS
-- y set search_path para prevenir ataques de path injection.

-- Obtener el rol del usuario autenticado
create or replace function public.get_my_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role_prf from public.profiles where id_prf = auth.uid();
$$;

-- Verificar si el usuario es admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role_prf = 'admin' and is_active_prf = true
     from public.profiles
     where id_prf = auth.uid()),
    false
  );
$$;

-- Verificar si el usuario es seller o admin
create or replace function public.is_seller_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role_prf in ('seller', 'admin') and is_active_prf = true
     from public.profiles
     where id_prf = auth.uid()),
    false
  );
$$;

-- Verificar si el usuario es premium
create or replace function public.is_premium()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role_prf = 'premium' and is_active_prf = true
     from public.profiles
     where id_prf = auth.uid()),
    false
  );
$$;

-- Verificar si el usuario está activo
create or replace function public.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_active_prf from public.profiles where id_prf = auth.uid()),
    false
  );
$$;

-- Verificar si el usuario es dueño de un negocio específico
create or replace function public.owns_business(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select owner_id_bus = auth.uid()
     from public.businesses
     where id_bus = p_business_id),
    false
  );
$$;

-- Verificar si el usuario creó un evento específico
create or replace function public.owns_event(p_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select created_by_evt = auth.uid()
     from public.events
     where id_evt = p_event_id),
    false
  );
$$;

-- Verificar si el usuario envió una atracción específica
create or replace function public.owns_attraction(p_attraction_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select submitted_by_atr = auth.uid()
     from public.attractions
     where id_atr = p_attraction_id),
    false
  );
$$;

-- Verificar si un producto pertenece a un negocio del usuario
create or replace function public.owns_product(p_product_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select b.owner_id_bus = auth.uid()
     from public.products p
     join public.businesses b on b.id_bus = p.business_id_prd
     where p.id_prd = p_product_id),
    false
  );
$$;

-- Verificar si una promoción pertenece al usuario
create or replace function public.owns_promotion(p_promotion_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select created_by_prm = auth.uid()
     from public.promotions
     where id_prm = p_promotion_id),
    false
  );
$$;

-- ============================================================
-- 12.1) HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.countries enable row level security;
alter table public.provinces enable row level security;
alter table public.cantons enable row level security;
alter table public.districts enable row level security;
alter table public.locations enable row level security;
alter table public.businesses enable row level security;
alter table public.events enable row level security;
alter table public.attractions enable row level security;
alter table public.products enable row level security;
alter table public.promotions enable row level security;
alter table public.business_category_map enable row level security;
alter table public.event_category_map enable row level security;
alter table public.attraction_category_map enable row level security;
alter table public.product_category_map enable row level security;
alter table public.promotion_category_map enable row level security;
alter table public.promotion_products enable row level security;
alter table public.promotion_scope_categories enable row level security;
alter table public.promotion_combo_items enable row level security;
alter table public.business_reviews enable row level security;
alter table public.event_reviews enable row level security;
alter table public.attraction_reviews enable row level security;
alter table public.product_reviews enable row level security;
alter table public.attraction_images enable row level security;
alter table public.business_images enable row level security;
alter table public.event_images enable row level security;
alter table public.product_images enable row level security;
alter table public.promotion_images enable row level security;
alter table public.event_likes enable row level security;
alter table public.attraction_likes enable row level security;
alter table public.business_likes enable row level security;
alter table public.event_review_likes enable row level security;
alter table public.attraction_review_likes enable row level security;
alter table public.business_review_likes enable row level security;
alter table public.business_interactions enable row level security;
alter table public.event_interactions enable row level security;
alter table public.attraction_interactions enable row level security;
alter table public.business_review_interactions enable row level security;
alter table public.event_review_interactions enable row level security;
alter table public.attraction_review_interactions enable row level security;
alter table public.product_review_interactions enable row level security;

-- ============================================================
-- 12.2) PROFILES
-- ============================================================

-- SELECT: Usuarios pueden ver perfiles activos (info pública básica)
create policy "profiles_select_public"
  on public.profiles for select
  using (is_active_prf = true);

-- SELECT: Usuario ve su propio perfil completo (aunque esté inactivo)
create policy "profiles_select_own"
  on public.profiles for select
  using (id_prf = auth.uid());

-- INSERT: Usuario puede crear su propio perfil al registrarse
-- El id debe coincidir con auth.uid() y rol inicial debe ser 'user'
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (
    auth.uid() is not null
    and id_prf = auth.uid()
    and role_prf = 'user'
  );

-- UPDATE: Usuario solo puede actualizar su propio perfil (sin cambiar rol)
create policy "profiles_update_own"
  on public.profiles for update
  using (id_prf = auth.uid())
  with check (
    id_prf = auth.uid()
    -- No puede cambiar su propio rol ni is_active (solo admin puede)
    and role_prf = (select p.role_prf from public.profiles p where p.id_prf = auth.uid())
    and is_active_prf = (select p.is_active_prf from public.profiles p where p.id_prf = auth.uid())
  );

-- UPDATE: Admin puede actualizar cualquier perfil
create policy "profiles_update_admin"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());


-- ============================================================
-- 12.4) CATEGORIES (lookup table - read only para usuarios)
-- ============================================================

-- SELECT: Público (todos pueden ver categorías)
create policy "categories_select_all"
  on public.categories for select
  using (true);

-- INSERT/UPDATE/DELETE: Solo admin
create policy "categories_insert_admin"
  on public.categories for insert
  with check (public.is_admin());

create policy "categories_update_admin"
  on public.categories for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "categories_delete_admin"
  on public.categories for delete
  using (public.is_admin());

-- ============================================================
-- 12.5) LOCATIONS (countries, provinces, cantons, districts, locations)
-- ============================================================

-- COUNTRIES: Read-only público, admin gestiona
create policy "countries_select_all"
  on public.countries for select
  using (true);

create policy "countries_insert_admin"
  on public.countries for insert
  with check (public.is_admin());

create policy "countries_update_admin"
  on public.countries for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "countries_delete_admin"
  on public.countries for delete
  using (public.is_admin());

-- PROVINCES: Read-only público, admin gestiona
create policy "provinces_select_all"
  on public.provinces for select
  using (true);

create policy "provinces_insert_admin"
  on public.provinces for insert
  with check (public.is_admin());

create policy "provinces_update_admin"
  on public.provinces for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "provinces_delete_admin"
  on public.provinces for delete
  using (public.is_admin());

-- CANTONS: Read-only público, admin gestiona
create policy "cantons_select_all"
  on public.cantons for select
  using (true);

create policy "cantons_insert_admin"
  on public.cantons for insert
  with check (public.is_admin());

create policy "cantons_update_admin"
  on public.cantons for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "cantons_delete_admin"
  on public.cantons for delete
  using (public.is_admin());

-- DISTRICTS: Read-only público, admin gestiona
create policy "districts_select_all"
  on public.districts for select
  using (true);

create policy "districts_insert_admin"
  on public.districts for insert
  with check (public.is_admin());

create policy "districts_update_admin"
  on public.districts for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "districts_delete_admin"
  on public.districts for delete
  using (public.is_admin());

-- LOCATIONS: Usuarios autenticados pueden crear, leer público
create policy "locations_select_all"
  on public.locations for select
  using (true);

-- Sellers/admin pueden crear locations (para sus negocios/eventos)
create policy "locations_insert_authenticated"
  on public.locations for insert
  with check (
    auth.uid() is not null
    and public.is_active_user()
  );

-- UPDATE: Solo admin (locations son referenciadas, no se editan normalmente)
create policy "locations_update_admin"
  on public.locations for update
  using (public.is_admin())
  with check (public.is_admin());

-- DELETE: Solo admin
create policy "locations_delete_admin"
  on public.locations for delete
  using (public.is_admin());

-- ============================================================
-- 12.6) BUSINESSES
-- ============================================================

-- SELECT: Público ve negocios aprobados y activos
create policy "businesses_select_public"
  on public.businesses for select
  using (
    moderation_status_bus = 'approved'
    and is_active_bus = true
  );

-- SELECT: Owner ve sus propios negocios (cualquier estado)
create policy "businesses_select_own"
  on public.businesses for select
  using (owner_id_bus = auth.uid());

-- SELECT: Admin ve todos los negocios
create policy "businesses_select_admin"
  on public.businesses for select
  using (public.is_admin());

-- INSERT: Solo sellers/admin pueden crear negocios
create policy "businesses_insert_seller"
  on public.businesses for insert
  with check (
    public.is_seller_or_admin()
    and owner_id_bus = auth.uid()
    -- Nuevos negocios siempre inician en pending
    and moderation_status_bus = 'pending'
    -- No puede auto-aprobar
    and reviewed_by_bus is null
    and reviewed_at_bus is null
  );

-- UPDATE: Owner puede actualizar su negocio (campos limitados)
-- Nota: En Supabase RLS, no hay acceso directo a OLD. Usamos subquery con el id.
create policy "businesses_update_own"
  on public.businesses for update
  using (owner_id_bus = auth.uid() AND NOT public.is_admin())
  with check (
    -- Debe seguir siendo el owner
    owner_id_bus = auth.uid() AND NOT public.is_admin()
  );

-- Trigger para proteger campos inmutables en businesses (owner no puede modificar)
create or replace function public.protect_business_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Si no es admin, proteger campos
  if not public.is_admin() then
    -- Campos de moderación
    new.moderation_status_bus := old.moderation_status_bus;
    new.reviewed_by_bus := old.reviewed_by_bus;
    new.reviewed_at_bus := old.reviewed_at_bus;
    new.moderation_note_bus := old.moderation_note_bus;
    -- Campos de rating (solo triggers de reviews)
    new.avg_rating_bus := old.avg_rating_bus;
    new.reviews_count_bus := old.reviews_count_bus;
    -- Owner no cambia
    new.owner_id_bus := old.owner_id_bus;
  end if;
  return new;
end;
$$;

create trigger trg_protect_business_fields
  before update on public.businesses
  for each row
  execute function public.protect_business_fields();

-- UPDATE: Admin puede actualizar cualquier negocio (moderación)
create policy "businesses_update_admin"
  on public.businesses for update
  using (public.is_admin())
  with check (public.is_admin());

-- DELETE: Solo admin puede eliminar (owner hace soft delete via is_active)
create policy "businesses_delete_admin"
  on public.businesses for delete
  using (public.is_admin());

-- ============================================================
-- 12.7) EVENTS
-- ============================================================

-- SELECT: Público ve eventos aprobados y activos
create policy "events_select_public"
  on public.events for select
  using (
    moderation_status_evt = 'approved'
    and is_active_evt = true
  );

-- SELECT: Creador ve sus propios eventos
create policy "events_select_own"
  on public.events for select
  using (created_by_evt = auth.uid());

-- SELECT: Admin ve todos
create policy "events_select_admin"
  on public.events for select
  using (public.is_admin());

-- INSERT: Sellers/admin pueden crear eventos
create policy "events_insert_seller"
  on public.events for insert
  with check (
    public.is_seller_or_admin()
    and created_by_evt = auth.uid()
    and moderation_status_evt = 'pending'
    and reviewed_by_evt is null
    and reviewed_at_evt is null
  );

-- UPDATE: Creador puede actualizar (campos limitados via trigger)
create policy "events_update_own"
  on public.events for update
  using (created_by_evt = auth.uid() AND NOT public.is_admin())
  with check (created_by_evt = auth.uid() AND NOT public.is_admin());

-- Trigger para proteger campos inmutables en events
create or replace function public.protect_event_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.moderation_status_evt := old.moderation_status_evt;
    new.reviewed_by_evt := old.reviewed_by_evt;
    new.reviewed_at_evt := old.reviewed_at_evt;
    new.moderation_note_evt := old.moderation_note_evt;
    new.avg_rating_evt := old.avg_rating_evt;
    new.reviews_count_evt := old.reviews_count_evt;
    new.created_by_evt := old.created_by_evt;
  end if;
  return new;
end;
$$;

create trigger trg_protect_event_fields
  before update on public.events
  for each row
  execute function public.protect_event_fields();

-- UPDATE: Admin puede todo
create policy "events_update_admin"
  on public.events for update
  using (public.is_admin())
  with check (public.is_admin());

-- DELETE: Solo admin
create policy "events_delete_admin"
  on public.events for delete
  using (public.is_admin());
  
create policy "events_delete_owner"
  on public.events for delete
  using (created_by_evt = auth.uid());
-- ============================================================
-- 12.8) ATTRACTIONS
-- ============================================================

-- SELECT: Público ve atracciones aprobadas y activas
create policy "attractions_select_public"
  on public.attractions for select
  using (
    moderation_status_atr = 'approved'
    and is_active_atr = true
  );

-- SELECT: Quien envió ve las suyas
create policy "attractions_select_own"
  on public.attractions for select
  using (submitted_by_atr = auth.uid());

-- SELECT: Admin ve todas
create policy "attractions_select_admin"
  on public.attractions for select
  using (public.is_admin());

-- INSERT: Cualquier usuario activo puede sugerir atracciones
create policy "attractions_insert_user"
  on public.attractions for insert
  with check (
    auth.uid() is not null
    and public.is_active_user()
    and submitted_by_atr = auth.uid()
    and moderation_status_atr = 'pending'
    and reviewed_by_atr is null
    and reviewed_at_atr is null
  );

-- UPDATE: Quien envió puede actualizar (campos limitados via trigger)
create policy "attractions_update_own"
  on public.attractions for update
  using (submitted_by_atr = auth.uid() AND NOT public.is_admin())
  with check (submitted_by_atr = auth.uid() AND NOT public.is_admin());

-- Trigger para proteger campos inmutables en attractions
create or replace function public.protect_attraction_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.moderation_status_atr := old.moderation_status_atr;
    new.reviewed_by_atr := old.reviewed_by_atr;
    new.reviewed_at_atr := old.reviewed_at_atr;
    new.moderation_note_atr := old.moderation_note_atr;
    new.avg_rating_atr := old.avg_rating_atr;
    new.reviews_count_atr := old.reviews_count_atr;
    new.submitted_by_atr := old.submitted_by_atr;
  end if;
  return new;
end;
$$;

create trigger trg_protect_attraction_fields
  before update on public.attractions
  for each row
  execute function public.protect_attraction_fields();

-- UPDATE: Admin puede todo
create policy "attractions_update_admin"
  on public.attractions for update
  using (public.is_admin())
  with check (public.is_admin());

-- DELETE: Quien envió puede eliminar su atracción
create policy "attractions_delete_owner"
  on public.attractions for delete
  using (submitted_by_atr = auth.uid());

-- DELETE: Admin puede eliminar cualquier atracción
create policy "attractions_delete_admin"
  on public.attractions for delete
  using (public.is_admin());

create policy "attractions_delete_owner"
  on public.attractions for delete
  using (submitted_by_atr = auth.uid());
-- ============================================================
-- 12.9) PRODUCTS
-- ============================================================

-- SELECT: Público ve productos activos de negocios aprobados/activos
create policy "products_select_public"
  on public.products for select
  using (
    is_active_prd = true
    and exists (
      select 1 from public.businesses
      where id_bus = business_id_prd
        and moderation_status_bus = 'approved'
        and is_active_bus = true
    )
  );

-- SELECT: Owner del negocio ve todos sus productos
create policy "products_select_own"
  on public.products for select
  using (public.owns_business(business_id_prd));

-- SELECT: Admin ve todos
create policy "products_select_admin"
  on public.products for select
  using (public.is_admin());

-- INSERT: Solo dueño del negocio puede crear productos
create policy "products_insert_owner"
  on public.products for insert
  with check (
    public.owns_business(business_id_prd)
    and public.is_seller_or_admin()
  );

-- UPDATE: Solo dueño del negocio (campos limitados via trigger)
create policy "products_update_owner"
  on public.products for update
  using (public.owns_business(business_id_prd) AND NOT public.is_admin())
  with check (public.owns_business(business_id_prd) AND NOT public.is_admin());

-- Trigger para proteger campos inmutables en products
create or replace function public.protect_product_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.business_id_prd := old.business_id_prd;
    new.avg_rating_prd := old.avg_rating_prd;
    new.reviews_count_prd := old.reviews_count_prd;
  end if;
  return new;
end;
$$;

create trigger trg_protect_product_fields
  before update on public.products
  for each row
  execute function public.protect_product_fields();

-- UPDATE: Admin puede todo
create policy "products_update_admin"
  on public.products for update
  using (public.is_admin())
  with check (public.is_admin());

-- DELETE: Owner o admin
create policy "products_delete_owner"
  on public.products for delete
  using (public.owns_business(business_id_prd));

create policy "products_delete_admin"
  on public.products for delete
  using (public.is_admin());

-- ============================================================
-- 12.10) PROMOTIONS
-- ============================================================

-- SELECT: Público ve promociones aprobadas, pagadas y activas
create policy "promotions_select_public"
  on public.promotions for select
  using (
    moderation_status_prm = 'approved'
    and payment_state_prm = 'paid'
    and is_active_prm = true
    and exists (
      select 1 from public.businesses
      where id_bus = business_id_prm
        and moderation_status_bus = 'approved'
        and is_active_bus = true
    )
  );

-- SELECT: Creador ve sus promociones
create policy "promotions_select_own"
  on public.promotions for select
  using (created_by_prm = auth.uid());

-- SELECT: Admin ve todas
create policy "promotions_select_admin"
  on public.promotions for select
  using (public.is_admin());

-- INSERT: Seller crea promociones para su negocio
create policy "promotions_insert_seller"
  on public.promotions for insert
  with check (
    public.is_seller_or_admin()
    and created_by_prm = auth.uid()
    and public.owns_business(business_id_prm)
    and moderation_status_prm = 'pending'
    and payment_state_prm = 'pending'
    and reviewed_by_prm is null
    and reviewed_at_prm is null
  );

-- UPDATE: Creador puede actualizar (campos limitados via trigger)
create policy "promotions_update_own"
  on public.promotions for update
  using (created_by_prm = auth.uid() AND NOT public.is_admin())
  with check (created_by_prm = auth.uid() AND NOT public.is_admin());

-- Trigger para proteger campos inmutables en promotions
create or replace function public.protect_promotion_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.business_id_prm := old.business_id_prm;
    new.created_by_prm := old.created_by_prm;
    new.moderation_status_prm := old.moderation_status_prm;
    new.reviewed_by_prm := old.reviewed_by_prm;
    new.reviewed_at_prm := old.reviewed_at_prm;
    new.moderation_note_prm := old.moderation_note_prm;
    new.payment_state_prm := old.payment_state_prm;
    new.payment_note_admin_prm := old.payment_note_admin_prm;
  end if;
  return new;
end;
$$;

create trigger trg_protect_promotion_fields
  before update on public.promotions
  for each row
  execute function public.protect_promotion_fields();

-- UPDATE: Admin puede todo
create policy "promotions_update_admin"
  on public.promotions for update
  using (public.is_admin())
  with check (public.is_admin());

-- DELETE: Solo admin
create policy "promotions_delete_admin"
  on public.promotions for delete
  using (public.is_admin());

CREATE POLICY "promotions_delete_owner"
  ON public.promotions FOR DELETE
  USING (created_by_prm = auth.uid());
-- ============================================================
-- 12.11) CATEGORY MAPS (business, event, attraction, product, promotion)
-- ============================================================

-- BUSINESS_CATEGORY_MAP
create policy "business_category_map_select_all"
  on public.business_category_map for select
  using (true);

create policy "business_category_map_insert_owner"
  on public.business_category_map for insert
  with check (public.owns_business(business_id_bcm) or public.is_admin());

create policy "business_category_map_delete_owner"
  on public.business_category_map for delete
  using (public.owns_business(business_id_bcm) or public.is_admin());

-- EVENT_CATEGORY_MAP
create policy "event_category_map_select_all"
  on public.event_category_map for select
  using (true);

create policy "event_category_map_insert_owner"
  on public.event_category_map for insert
  with check (public.owns_event(event_id_ecm) or public.is_admin());

create policy "event_category_map_delete_owner"
  on public.event_category_map for delete
  using (public.owns_event(event_id_ecm) or public.is_admin());

-- ATTRACTION_CATEGORY_MAP
create policy "attraction_category_map_select_all"
  on public.attraction_category_map for select
  using (true);

create policy "attraction_category_map_insert_owner"
  on public.attraction_category_map for insert
  with check (public.owns_attraction(attraction_id_acm) or public.is_admin());

create policy "attraction_category_map_delete_owner"
  on public.attraction_category_map for delete
  using (public.owns_attraction(attraction_id_acm) or public.is_admin());

-- PRODUCT_CATEGORY_MAP
create policy "product_category_map_select_all"
  on public.product_category_map for select
  using (true);

create policy "product_category_map_insert_owner"
  on public.product_category_map for insert
  with check (public.owns_product(product_id_pcm) or public.is_admin());

create policy "product_category_map_delete_owner"
  on public.product_category_map for delete
  using (public.owns_product(product_id_pcm) or public.is_admin());

-- PROMOTION_CATEGORY_MAP
create policy "promotion_category_map_select_all"
  on public.promotion_category_map for select
  using (true);

create policy "promotion_category_map_insert_owner"
  on public.promotion_category_map for insert
  with check (public.owns_promotion(promotion_id_pcr) or public.is_admin());

create policy "promotion_category_map_delete_owner"
  on public.promotion_category_map for delete
  using (public.owns_promotion(promotion_id_pcr) or public.is_admin());

-- ============================================================
-- 12.12) PROMOTION RELATIONS (products, scope_categories, combo_items)
-- ============================================================

-- PROMOTION_PRODUCTS
create policy "promotion_products_select_all"
  on public.promotion_products for select
  using (true);

create policy "promotion_products_insert_owner"
  on public.promotion_products for insert
  with check (public.owns_promotion(promotion_id_ppr) or public.is_admin());

create policy "promotion_products_delete_owner"
  on public.promotion_products for delete
  using (public.owns_promotion(promotion_id_ppr) or public.is_admin());

-- PROMOTION_SCOPE_CATEGORIES
create policy "promotion_scope_categories_select_all"
  on public.promotion_scope_categories for select
  using (true);

create policy "promotion_scope_categories_insert_owner"
  on public.promotion_scope_categories for insert
  with check (public.owns_promotion(promotion_id_psc) or public.is_admin());

create policy "promotion_scope_categories_delete_owner"
  on public.promotion_scope_categories for delete
  using (public.owns_promotion(promotion_id_psc) or public.is_admin());

-- PROMOTION_COMBO_ITEMS
create policy "promotion_combo_items_select_all"
  on public.promotion_combo_items for select
  using (true);

create policy "promotion_combo_items_insert_owner"
  on public.promotion_combo_items for insert
  with check (public.owns_promotion(promotion_id_pci) or public.is_admin());

create policy "promotion_combo_items_update_owner"
  on public.promotion_combo_items for update
  using (public.owns_promotion(promotion_id_pci) or public.is_admin())
  with check (public.owns_promotion(promotion_id_pci) or public.is_admin());

create policy "promotion_combo_items_delete_owner"
  on public.promotion_combo_items for delete
  using (public.owns_promotion(promotion_id_pci) or public.is_admin());

-- ============================================================
-- 12.13) REVIEWS
-- ============================================================

-- BUSINESS_REVIEWS
create policy "business_reviews_select_all"
  on public.business_reviews for select
  using (true);

create policy "business_reviews_insert_auth"
  on public.business_reviews for insert
  with check (
    auth.uid() is not null
    and public.is_active_user()
    and user_id_brv = auth.uid()
    -- Verificar que el negocio existe y está activo (sin importar estado de aprobación)
    and exists (
      select 1 from public.businesses
      where id_bus = business_id_brv
        and is_active_bus = true
    )
    -- No puede reviewear su propio negocio
    and not exists (
      select 1 from public.businesses
      where id_bus = business_id_brv
        and owner_id_bus = auth.uid()
    )
  );

create policy "business_reviews_update_own"
  on public.business_reviews for update
  using (user_id_brv = auth.uid())
  with check (user_id_brv = auth.uid());

create policy "business_reviews_admin_update"
  on public.business_reviews for update
  using (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  );

create policy "business_reviews_admin_update"
  on public.business_reviews for update
  using (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  );

-- Trigger para proteger campos inmutables en business_reviews
create or replace function public.protect_business_review_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.business_id_brv := old.business_id_brv;
  new.user_id_brv := old.user_id_brv;
  new.created_at_brv := old.created_at_brv;
  return new;
end;
$$;

create trigger trg_protect_business_review_fields
  before update on public.business_reviews
  for each row
  execute function public.protect_business_review_fields();

create policy "business_reviews_delete_own"
  on public.business_reviews for delete
  using (user_id_brv = auth.uid());

create policy "business_reviews_delete_admin"
  on public.business_reviews for delete
  using (public.is_admin());

-- EVENT_REVIEWS
create policy "event_reviews_select_all"
  on public.event_reviews for select
  using (true);

create policy "event_reviews_insert_auth"
  on public.event_reviews for insert
  with check (
    auth.uid() is not null
    and public.is_active_user()
    and user_id_erv = auth.uid()
    -- Verificar que el evento existe y está activo (sin importar estado de aprobación)
    and exists (
      select 1 from public.events
      where id_evt = event_id_erv
        and is_active_evt = true
    )
  );

create policy "event_reviews_update_own"
  on public.event_reviews for update
  using (user_id_erv = auth.uid())
  with check (user_id_erv = auth.uid());

create policy "event_reviews_admin_update"
  on public.event_reviews for update
  using (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  );

create policy "event_reviews_admin_update"
  on public.event_reviews for update
  using (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  );

-- Trigger para proteger campos inmutables en event_reviews
create or replace function public.protect_event_review_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.event_id_erv := old.event_id_erv;
  new.user_id_erv := old.user_id_erv;
  new.created_at_erv := old.created_at_erv;
  return new;
end;
$$;

create trigger trg_protect_event_review_fields
  before update on public.event_reviews
  for each row
  execute function public.protect_event_review_fields();

create policy "event_reviews_delete_own"
  on public.event_reviews for delete
  using (user_id_erv = auth.uid());

create policy "event_reviews_delete_admin"
  on public.event_reviews for delete
  using (public.is_admin());

-- ATTRACTION_REVIEWS
create policy "attraction_reviews_select_all"
  on public.attraction_reviews for select
  using (true);

create policy "attraction_reviews_insert_auth"
  on public.attraction_reviews for insert
  with check (
    auth.uid() is not null
    and public.is_active_user()
    and user_id_arv = auth.uid()
    -- Verificar que la atracción existe y está activa (sin importar estado de aprobación)
    and exists (
      select 1 from public.attractions
      where id_atr = attraction_id_arv
        and is_active_atr = true
    )
  );

create policy "attraction_reviews_update_own"
  on public.attraction_reviews for update
  using (user_id_arv = auth.uid())
  with check (user_id_arv = auth.uid());

create policy "attraction_reviews_admin_update"
  on public.attraction_reviews for update
  using (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  );

create policy "attraction_reviews_admin_update"
  on public.attraction_reviews for update
  using (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  );

-- Trigger para proteger campos inmutables en attraction_reviews
create or replace function public.protect_attraction_review_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.attraction_id_arv := old.attraction_id_arv;
  new.user_id_arv := old.user_id_arv;
  new.created_at_arv := old.created_at_arv;
  return new;
end;
$$;

create trigger trg_protect_attraction_review_fields
  before update on public.attraction_reviews
  for each row
  execute function public.protect_attraction_review_fields();

create policy "attraction_reviews_delete_own"
  on public.attraction_reviews for delete
  using (user_id_arv = auth.uid());

create policy "attraction_reviews_delete_admin"
  on public.attraction_reviews for delete
  using (public.is_admin());

-- PRODUCT_REVIEWS
create policy "product_reviews_select_all"
  on public.product_reviews for select
  using (true);

create policy "product_reviews_insert_auth"
  on public.product_reviews for insert
  with check (
    auth.uid() is not null
    and public.is_active_user()
    and user_id_prv = auth.uid()
    and exists (
      select 1 from public.products p
      join public.businesses b on b.id_bus = p.business_id_prd
      where p.id_prd = product_id_prv
        and p.is_active_prd = true
        and b.moderation_status_bus = 'approved'
        and b.is_active_bus = true
    )
    -- No puede reviewear productos de su propio negocio
    and not exists (
      select 1 from public.products p
      join public.businesses b on b.id_bus = p.business_id_prd
      where p.id_prd = product_id_prv
        and b.owner_id_bus = auth.uid()
    )
  );

create policy "product_reviews_update_own"
  on public.product_reviews for update
  using (user_id_prv = auth.uid())
  with check (user_id_prv = auth.uid());

create policy "product_reviews_admin_update"
  on public.product_reviews for update
  using (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  );

create policy "product_reviews_admin_update"
  on public.product_reviews for update
  using (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id_prf = auth.uid()
        and role_prf = 'admin'
        and is_active_prf = true
    )
  );

-- Trigger para proteger campos inmutables en product_reviews
create or replace function public.protect_product_review_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.product_id_prv := old.product_id_prv;
  new.user_id_prv := old.user_id_prv;
  new.created_at_prv := old.created_at_prv;
  return new;
end;
$$;

create trigger trg_protect_product_review_fields
  before update on public.product_reviews
  for each row
  execute function public.protect_product_review_fields();

create policy "product_reviews_delete_own"
  on public.product_reviews for delete
  using (user_id_prv = auth.uid());

create policy "product_reviews_delete_admin"
  on public.product_reviews for delete
  using (public.is_admin());

-- ============================================================
-- 12.14) IMAGES
-- ============================================================

-- ATTRACTION_IMAGES
create policy "attraction_images_select_all"
  on public.attraction_images for select
  using (true);

create policy "attraction_images_insert_owner"
  on public.attraction_images for insert
  with check (public.owns_attraction(attraction_id_aim) or public.is_admin());

create policy "attraction_images_update_owner"
  on public.attraction_images for update
  using (public.owns_attraction(attraction_id_aim) or public.is_admin())
  with check (public.owns_attraction(attraction_id_aim) or public.is_admin());

create policy "attraction_images_delete_owner"
  on public.attraction_images for delete
  using (public.owns_attraction(attraction_id_aim) or public.is_admin());

-- BUSINESS_IMAGES
create policy "business_images_select_all"
  on public.business_images for select
  using (true);

create policy "business_images_insert_owner"
  on public.business_images for insert
  with check (public.owns_business(business_id_bim) or public.is_admin());

create policy "business_images_update_owner"
  on public.business_images for update
  using (public.owns_business(business_id_bim) or public.is_admin())
  with check (public.owns_business(business_id_bim) or public.is_admin());

create policy "business_images_delete_owner"
  on public.business_images for delete
  using (public.owns_business(business_id_bim) or public.is_admin());

-- EVENT_IMAGES
create policy "event_images_select_all"
  on public.event_images for select
  using (true);

create policy "event_images_insert_owner"
  on public.event_images for insert
  with check (public.owns_event(event_id_eim) or public.is_admin());

create policy "event_images_update_owner"
  on public.event_images for update
  using (public.owns_event(event_id_eim) or public.is_admin())
  with check (public.owns_event(event_id_eim) or public.is_admin());

create policy "event_images_delete_owner"
  on public.event_images for delete
  using (public.owns_event(event_id_eim) or public.is_admin());

-- PRODUCT_IMAGES
create policy "product_images_select_all"
  on public.product_images for select
  using (true);

create policy "product_images_insert_owner"
  on public.product_images for insert
  with check (public.owns_product(product_id_pim) or public.is_admin());

create policy "product_images_update_owner"
  on public.product_images for update
  using (public.owns_product(product_id_pim) or public.is_admin())
  with check (public.owns_product(product_id_pim) or public.is_admin());

create policy "product_images_delete_owner"
  on public.product_images for delete
  using (public.owns_product(product_id_pim) or public.is_admin());

-- PROMOTION_IMAGES
create policy "promotion_images_select_all"
  on public.promotion_images for select
  using (true);

create policy "promotion_images_insert_owner"
  on public.promotion_images for insert
  with check (public.owns_promotion(promotion_id_pim) or public.is_admin());

create policy "promotion_images_update_owner"
  on public.promotion_images for update
  using (public.owns_promotion(promotion_id_pim) or public.is_admin())
  with check (public.owns_promotion(promotion_id_pim) or public.is_admin());

create policy "promotion_images_delete_owner"
  on public.promotion_images for delete
  using (public.owns_promotion(promotion_id_pim) or public.is_admin());

-- ============================================================
-- 12.15) LIKES (entidades)
-- ============================================================

-- EVENT_LIKES
create policy "event_likes_select_all"
  on public.event_likes for select
  using (true);

create policy "event_likes_insert_auth"
  on public.event_likes for insert
  with check (
    auth.uid() is not null
    and public.is_active_user()
    and user_id_elk = auth.uid()
  );

create policy "event_likes_delete_own"
  on public.event_likes for delete
  using (user_id_elk = auth.uid());

-- ATTRACTION_LIKES
create policy "attraction_likes_select_all"
  on public.attraction_likes for select
  using (true);

create policy "attraction_likes_insert_auth"
  on public.attraction_likes for insert
  with check (
    auth.uid() is not null
    and public.is_active_user()
    and user_id_alk = auth.uid()
  );

create policy "attraction_likes_delete_own"
  on public.attraction_likes for delete
  using (user_id_alk = auth.uid());

-- BUSINESS_LIKES
create policy "business_likes_select_all"
  on public.business_likes for select
  using (true);

create policy "business_likes_insert_auth"
  on public.business_likes for insert
  with check (
    auth.uid() is not null
    and public.is_active_user()
    and user_id_blk = auth.uid()
  );

create policy "business_likes_delete_own"
  on public.business_likes for delete
  using (user_id_blk = auth.uid());

-- ============================================================
-- 12.16) REVIEW LIKES
-- ============================================================

-- EVENT_REVIEW_LIKES
create policy "event_review_likes_select_all"
  on public.event_review_likes for select
  using (true);

create policy "event_review_likes_insert_auth"
  on public.event_review_likes for insert
  with check (
    auth.uid() is not null
    and public.is_active_user()
    and user_id_erl = auth.uid()
  );

create policy "event_review_likes_delete_own"
  on public.event_review_likes for delete
  using (user_id_erl = auth.uid());

-- ATTRACTION_REVIEW_LIKES
create policy "attraction_review_likes_select_all"
  on public.attraction_review_likes for select
  using (true);

create policy "attraction_review_likes_insert_auth"
  on public.attraction_review_likes for insert
  with check (
    auth.uid() is not null
    and public.is_active_user()
    and user_id_arl = auth.uid()
  );

create policy "attraction_review_likes_delete_own"
  on public.attraction_review_likes for delete
  using (user_id_arl = auth.uid());

-- BUSINESS_REVIEW_LIKES
create policy "business_review_likes_select_all"
  on public.business_review_likes for select
  using (true);

create policy "business_review_likes_insert_auth"
  on public.business_review_likes for insert
  with check (
    auth.uid() is not null
    and public.is_active_user()
    and user_id_brl = auth.uid()
  );

create policy "business_review_likes_delete_own"
  on public.business_review_likes for delete
  using (user_id_brl = auth.uid());

-- ============================================================
-- 12.17) INTERACTIONS (analytics - insert only, read by owner/admin)
-- ============================================================

-- BUSINESS_INTERACTIONS
create policy "business_interactions_select_owner"
  on public.business_interactions for select
  using (public.owns_business(business_id_bin) or public.is_admin());

create policy "business_interactions_insert_all"
  on public.business_interactions for insert
  with check (true); -- Cualquiera puede registrar interacción (incluso anon)

-- No update/delete permitido (audit trail)

-- EVENT_INTERACTIONS
create policy "event_interactions_select_owner"
  on public.event_interactions for select
  using (public.owns_event(event_id_ein) or public.is_admin());

create policy "event_interactions_insert_all"
  on public.event_interactions for insert
  with check (true);

-- ATTRACTION_INTERACTIONS
create policy "attraction_interactions_select_owner"
  on public.attraction_interactions for select
  using (public.owns_attraction(attraction_id_ain) or public.is_admin());

create policy "attraction_interactions_insert_all"
  on public.attraction_interactions for insert
  with check (true);

-- BUSINESS_REVIEW_INTERACTIONS
create policy "business_review_interactions_select_admin"
  on public.business_review_interactions for select
  using (public.is_admin());

create policy "business_review_interactions_insert_all"
  on public.business_review_interactions for insert
  with check (true);

-- EVENT_REVIEW_INTERACTIONS
create policy "event_review_interactions_select_admin"
  on public.event_review_interactions for select
  using (public.is_admin());

create policy "event_review_interactions_insert_all"
  on public.event_review_interactions for insert
  with check (true);

-- ATTRACTION_REVIEW_INTERACTIONS
create policy "attraction_review_interactions_select_admin"
  on public.attraction_review_interactions for select
  using (public.is_admin());

create policy "attraction_review_interactions_insert_all"
  on public.attraction_review_interactions for insert
  with check (true);

-- PRODUCT_REVIEW_INTERACTIONS
create policy "product_review_interactions_select_admin"
  on public.product_review_interactions for select
  using (public.is_admin());

create policy "product_review_interactions_insert_all"
  on public.product_review_interactions for insert
  with check (true);

-- ============================================================
-- 12.18) STORAGE POLICIES (buckets)
-- ============================================================

-- Función helper para validar UUID en storage paths
create or replace function public.is_valid_uuid(p_text text)
returns boolean
language plpgsql
immutable
as $$
begin
  if p_text is null then
    return false;
  end if;
  perform p_text::uuid;
  return true;
exception
  when invalid_text_representation then
    return false;
end;
$$;

-- PROFILES-IMAGES: Usuario sube/elimina su propia foto
create policy "profiles_images_select_all"
  on storage.objects for select
  using (bucket_id = 'profiles-images');

create policy "profiles_images_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'profiles-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "profiles_images_update_own"
  on storage.objects for update
  using (
    bucket_id = 'profiles-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "profiles_images_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'profiles-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ATTRACTIONS-IMAGES
create policy "attractions_images_select_all"
  on storage.objects for select
  using (bucket_id = 'attractions-images');

create policy "attractions_images_insert_owner"
  on storage.objects for insert
  with check (
    bucket_id = 'attractions-images'
    and public.is_valid_uuid((storage.foldername(name))[1])
    and (
      public.owns_attraction((storage.foldername(name))[1]::uuid)
      or public.is_admin()
    )
  );

create policy "attractions_images_update_owner"
  on storage.objects for update
  using (
    bucket_id = 'attractions-images'
    and public.is_valid_uuid((storage.foldername(name))[1])
    and (
      public.owns_attraction((storage.foldername(name))[1]::uuid)
      or public.is_admin()
    )
  );

create policy "attractions_images_delete_owner"
  on storage.objects for delete
  using (
    bucket_id = 'attractions-images'
    and public.is_valid_uuid((storage.foldername(name))[1])
    and (
      public.owns_attraction((storage.foldername(name))[1]::uuid)
      or public.is_admin()
    )
  );

-- BUSINESS-IMAGES
create policy "business_images_storage_select_all"
  on storage.objects for select
  using (bucket_id = 'business-images');

create policy "business_images_storage_insert_owner"
  on storage.objects for insert
  with check (
    bucket_id = 'business-images'
    and public.is_valid_uuid((storage.foldername(name))[1])
    and (
      public.owns_business((storage.foldername(name))[1]::uuid)
      or public.is_admin()
    )
  );

create policy "business_images_storage_update_owner"
  on storage.objects for update
  using (
    bucket_id = 'business-images'
    and public.is_valid_uuid((storage.foldername(name))[1])
    and (
      public.owns_business((storage.foldername(name))[1]::uuid)
      or public.is_admin()
    )
  );

create policy "business_images_storage_delete_owner"
  on storage.objects for delete
  using (
    bucket_id = 'business-images'
    and public.is_valid_uuid((storage.foldername(name))[1])
    and (
      public.owns_business((storage.foldername(name))[1]::uuid)
      or public.is_admin()
    )
  );

-- EVENTS-IMAGES
create policy "events_images_storage_select_all"
  on storage.objects for select
  using (bucket_id = 'events-images');

create policy "events_images_storage_insert_owner"
  on storage.objects for insert
  with check (
    bucket_id = 'events-images'
    and public.is_valid_uuid((storage.foldername(name))[1])
    and (
      public.owns_event((storage.foldername(name))[1]::uuid)
      or public.is_admin()
    )
  );

create policy "events_images_storage_update_owner"
  on storage.objects for update
  using (
    bucket_id = 'events-images'
    and public.is_valid_uuid((storage.foldername(name))[1])
    and (
      public.owns_event((storage.foldername(name))[1]::uuid)
      or public.is_admin()
    )
  );

create policy "events_images_storage_delete_owner"
  on storage.objects for delete
  using (
    bucket_id = 'events-images'
    and public.is_valid_uuid((storage.foldername(name))[1])
    and (
      public.owns_event((storage.foldername(name))[1]::uuid)
      or public.is_admin()
    )
  );

-- PRODUCT-IMAGES
create policy "product_images_storage_select_all"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product_images_storage_insert_owner"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and public.is_valid_uuid((storage.foldername(name))[1])
    and (
      public.owns_product((storage.foldername(name))[1]::uuid)
      or public.is_admin()
    )
  );

create policy "product_images_storage_update_owner"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and public.is_valid_uuid((storage.foldername(name))[1])
    and (
      public.owns_product((storage.foldername(name))[1]::uuid)
      or public.is_admin()
    )
  );

create policy "product_images_storage_delete_owner"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and public.is_valid_uuid((storage.foldername(name))[1])
    and (
      public.owns_product((storage.foldername(name))[1]::uuid)
      or public.is_admin()
    )
  );

-- PROMOTIONS-IMAGES
create policy "promotions_images_storage_select_all"
  on storage.objects for select
  using (bucket_id = 'promotions-images');

create policy "promotions_images_storage_insert_owner"
  on storage.objects for insert
  with check (
    bucket_id = 'promotions-images'
    and public.is_valid_uuid((storage.foldername(name))[1])
    and (
      public.owns_promotion((storage.foldername(name))[1]::uuid)
      or public.is_admin()
    )
  );

create policy "promotions_images_storage_update_owner"
  on storage.objects for update
  using (
    bucket_id = 'promotions-images'
    and public.is_valid_uuid((storage.foldername(name))[1])
    and (
      public.owns_promotion((storage.foldername(name))[1]::uuid)
      or public.is_admin()
    )
  );

create policy "promotions_images_storage_delete_owner"
  on storage.objects for delete
  using (
    bucket_id = 'promotions-images'
    and public.is_valid_uuid((storage.foldername(name))[1])
    and (
      public.owns_promotion((storage.foldername(name))[1]::uuid)
      or public.is_admin()
    )
  );
-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
