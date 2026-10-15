-- ============================================================================
-- RUTICA · Migración de correcciones de la auditoría (2026-10-15)
-- ============================================================================
-- Script ÚNICO con todos los cambios de modelo, seguridad y rendimiento que
-- salieron de docs/auditoria/. Ver el plan en docs/auditoria/09-plan-de-correccion.md
--
-- Cómo correrlo:
--   1. Supabase → SQL Editor → pegar el archivo completo → Run.
--      (Probar primero en un proyecto de staging si existe.)
--   2. Es idempotente: se puede correr más de una vez.
--   3. Corre en UNA transacción: si algo falla, no se aplica nada.
--
-- Diseño:
--   * No asume columnas que no están en docs/base-de-datos/esquema-v3.sql:
--     las protecciones de campos usan to_jsonb()/jsonb_populate_record(), así
--     que ignoran columnas que no existan en producción.
--   * "Privilegiado" = admin activo, conexión sin JWT (SQL Editor / service_role)
--     o una función interna que activa el flag `rutica.bypass_protect`.
--   * Los datos existentes no se borran, salvo las reseñas duplicadas (sección
--     9), que se respaldan antes en una tabla.
--
-- Referencias entre corchetes: [S-01] = docs/auditoria/05-seguridad.md, etc.
-- ============================================================================

begin;

-- ============================================================================
-- 0. HELPERS GENÉRICOS
-- ============================================================================

-- ¿La operación actual puede saltarse las protecciones de campos?
create or replace function public._is_privileged()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() is null
      or coalesce(current_setting('rutica.bypass_protect', true), '') = 'on'
      or public.is_admin();
$$;

-- ¿Cambió alguna de estas columnas entre old y new? (ignora columnas inexistentes)
create or replace function public._cols_changed(p_old jsonb, p_new jsonb, p_cols text[])
returns boolean
language sql
immutable
as $$
  select exists (
    select 1 from unnest(p_cols) c
    where p_old ? c and (p_old -> c) is distinct from (p_new -> c)
  );
$$;

-- Devuelve p_new con los valores de p_old en las columnas indicadas
create or replace function public._restore_cols(p_new anyelement, p_old anyelement, p_cols text[])
returns anyelement
language plpgsql
immutable
as $$
declare
  v_old jsonb := to_jsonb(p_old);
  v_patch jsonb;
begin
  select coalesce(jsonb_object_agg(c, v_old -> c), '{}'::jsonb)
    into v_patch
    from unnest(p_cols) c
   where v_old ? c;
  return jsonb_populate_record(p_new, v_patch);
end;
$$;

-- Asigna valores (jsonb) a p_new, ignorando columnas inexistentes
create or replace function public._set_cols(p_new anyelement, p_values jsonb)
returns anyelement
language plpgsql
immutable
as $$
declare
  v_cur jsonb := to_jsonb(p_new);
  v_patch jsonb;
begin
  select coalesce(jsonb_object_agg(k, v), '{}'::jsonb)
    into v_patch
    from jsonb_each(p_values) as e(k, v)
   where v_cur ? k;
  return jsonb_populate_record(p_new, v_patch);
end;
$$;

-- ============================================================================
-- 1. COLUMNAS NUEVAS Y DEFAULTS
-- ============================================================================

-- [S-07] Bloqueo por admin, separado de is_active (que maneja el dueño)
alter table public.businesses  add column if not exists is_blocked_bus boolean not null default false;
alter table public.events      add column if not exists is_blocked_evt boolean not null default false;
alter table public.attractions add column if not exists is_blocked_atr boolean not null default false;
alter table public.products    add column if not exists is_blocked_prd boolean not null default false;
alter table public.promotions  add column if not exists is_blocked_prm boolean not null default false;

-- [colaterales 05] Nuevas entidades arrancan en 'pending'
alter table public.businesses  alter column moderation_status_bus set default 'pending';
alter table public.events      alter column moderation_status_evt set default 'pending';
alter table public.attractions alter column moderation_status_atr set default 'pending';
alter table public.promotions  alter column moderation_status_prm set default 'pending';

-- [L-04] Consentimiento de términos
alter table public.profiles add column if not exists terms_version_prf text;
alter table public.profiles add column if not exists terms_accepted_at_prf timestamptz;

-- [L-07] Marca de edición por moderación en reseñas
alter table public.business_reviews   add column if not exists moderated_at_brv timestamptz;
alter table public.event_reviews      add column if not exists moderated_at_erv timestamptz;
alter table public.attraction_reviews add column if not exists moderated_at_arv timestamptz;
alter table public.product_reviews    add column if not exists moderated_at_prv timestamptz;

-- ============================================================================
-- 2. PROTECCIÓN GENÉRICA DE ENTIDADES  [S-06] [S-07] [S-08]
-- ============================================================================
-- Argumentos del trigger:
--   TG_ARGV[0] columnas protegidas (csv): el no-admin no puede cambiarlas
--   TG_ARGV[1] columnas de contenido (csv): cambiarlas re-envía a moderación
--   TG_ARGV[2] columna de estado de moderación ('' si no tiene)
--   TG_ARGV[3] columna is_active
--   TG_ARGV[4] columna is_blocked

create or replace function public.protect_entity_fields()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_protected text[] := string_to_array(nullif(TG_ARGV[0], ''), ',');
  v_content   text[] := string_to_array(nullif(TG_ARGV[1], ''), ',');
  v_status    text   := nullif(TG_ARGV[2], '');
  v_active    text   := nullif(TG_ARGV[3], '');
  v_blocked   text   := nullif(TG_ARGV[4], '');
  v_old jsonb := to_jsonb(old);
  v_new jsonb;
begin
  if public._is_privileged() then
    -- Admin: si cambia is_active, eso define el bloqueo
    if v_active is not null and v_blocked is not null
       and auth.uid() is not null
       and coalesce(current_setting('rutica.bypass_protect', true), '') <> 'on'
       and (v_old -> v_active) is distinct from (to_jsonb(new) -> v_active) then
      new := public._set_cols(new, jsonb_build_object(
        v_blocked, not coalesce((to_jsonb(new) ->> v_active)::boolean, false)));
    end if;
    return new;
  end if;

  -- 1) Columnas protegidas vuelven a su valor anterior
  new := public._restore_cols(new, old, coalesce(v_protected, '{}') ||
           case when v_blocked is not null then array[v_blocked] else '{}'::text[] end);

  -- 2) Si el admin lo bloqueó, el dueño no puede reactivarlo
  if v_blocked is not null and coalesce((v_old ->> v_blocked)::boolean, false) then
    new := public._restore_cols(new, old, array[v_active]);
  end if;

  -- 3) Contenido modificado de algo aprobado o rechazado → vuelve a 'pending'
  v_new := to_jsonb(new);
  if v_status is not null
     and v_content is not null
     and (v_old ->> v_status) in ('approved', 'rejected')
     and public._cols_changed(v_old, v_new, v_content) then
    new := public._set_cols(new, jsonb_build_object(v_status, 'pending'));
  end if;

  return new;
end;
$$;

-- Reemplazar los triggers anteriores (protect_*_fields) por el genérico
drop trigger if exists trg_protect_business_fields on public.businesses;
create trigger trg_protect_business_fields
  before update on public.businesses
  for each row execute function public.protect_entity_fields(
    'moderation_status_bus,reviewed_by_bus,reviewed_at_bus,moderation_note_bus,avg_rating_bus,reviews_count_bus,owner_id_bus',
    'name_bus,description_bus,social_links_bus,contact_phone_bus,contact_email_bus,website_bus,whatsapp_phone_bus,location_id_bus',
    'moderation_status_bus', 'is_active_bus', 'is_blocked_bus');

drop trigger if exists trg_protect_event_fields on public.events;
create trigger trg_protect_event_fields
  before update on public.events
  for each row execute function public.protect_entity_fields(
    'moderation_status_evt,reviewed_by_evt,reviewed_at_evt,moderation_note_evt,avg_rating_evt,reviews_count_evt,created_by_evt',
    'name_evt,description_evt,start_at_evt,end_at_evt,price_evt,currency_evt,capacity_evt,is_free_evt,social_links_evt,contact_phone_evt,contact_email_evt,website_evt,ticket_url_evt,location_id_evt',
    'moderation_status_evt', 'is_active_evt', 'is_blocked_evt');

drop trigger if exists trg_protect_attraction_fields on public.attractions;
create trigger trg_protect_attraction_fields
  before update on public.attractions
  for each row execute function public.protect_entity_fields(
    'moderation_status_atr,reviewed_by_atr,reviewed_at_atr,moderation_note_atr,avg_rating_atr,reviews_count_atr,submitted_by_atr',
    'name_atr,description_atr,location_id_atr',
    'moderation_status_atr', 'is_active_atr', 'is_blocked_atr');

drop trigger if exists trg_protect_product_fields on public.products;
create trigger trg_protect_product_fields
  before update on public.products
  for each row execute function public.protect_entity_fields(
    'business_id_prd,avg_rating_prd,reviews_count_prd',
    '', '', 'is_active_prd', 'is_blocked_prd');

drop trigger if exists trg_protect_promotion_fields on public.promotions;
create trigger trg_protect_promotion_fields
  before update on public.promotions
  for each row execute function public.protect_entity_fields(
    'business_id_prm,created_by_prm,moderation_status_prm,reviewed_by_prm,reviewed_at_prm,moderation_note_prm,payment_state_prm,payment_note_admin_prm',
    'title_prm,description_prm,discount_type_prm,discount_value_prm,start_at_prm,end_at_prm,scope_prm',
    'moderation_status_prm', 'is_active_prm', 'is_blocked_prm');

-- Lo bloqueado no se muestra al público
drop policy if exists "businesses_select_public" on public.businesses;
create policy "businesses_select_public" on public.businesses for select
  using (moderation_status_bus = 'approved' and is_active_bus = true and is_blocked_bus = false);

drop policy if exists "events_select_public" on public.events;
create policy "events_select_public" on public.events for select
  using (moderation_status_evt = 'approved' and is_active_evt = true and is_blocked_evt = false);

drop policy if exists "attractions_select_public" on public.attractions;
create policy "attractions_select_public" on public.attractions for select
  using (moderation_status_atr = 'approved' and is_active_atr = true and is_blocked_atr = false);

drop policy if exists "products_select_public" on public.products;
create policy "products_select_public" on public.products for select
  using (
    is_active_prd = true and is_blocked_prd = false
    and exists (select 1 from public.businesses b
                 where b.id_bus = business_id_prd
                   and b.moderation_status_bus = 'approved'
                   and b.is_active_bus = true and b.is_blocked_bus = false)
  );

drop policy if exists "promotions_select_public" on public.promotions;
create policy "promotions_select_public" on public.promotions for select
  using (
    moderation_status_prm = 'approved' and payment_state_prm = 'paid'
    and is_active_prm = true and is_blocked_prm = false
    and exists (select 1 from public.businesses b
                 where b.id_bus = business_id_prm
                   and b.moderation_status_bus = 'approved'
                   and b.is_active_bus = true and b.is_blocked_bus = false)
  );

-- ============================================================================
-- 3. RE-MODERACIÓN DESDE TABLAS HIJAS (imágenes, categorías, partes de promo)  [S-06] [S-08]
-- ============================================================================
-- TG_ARGV[0] tabla padre, [1] pk del padre, [2] fk en la tabla hija, [3] columna de estado del padre

create or replace function public.mark_parent_pending()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_row jsonb := to_jsonb(coalesce(new, old));
  v_parent_id uuid := (v_row ->> TG_ARGV[2])::uuid;
  v_prev text := coalesce(current_setting('rutica.bypass_protect', true), '');
begin
  if public._is_privileged() or v_parent_id is null then
    return coalesce(new, old);
  end if;
  perform set_config('rutica.bypass_protect', 'on', true);
  execute format(
    'update public.%I set %I = ''pending'' where %I = $1 and %I in (''approved'', ''rejected'')',
    TG_ARGV[0], TG_ARGV[3], TG_ARGV[1], TG_ARGV[3]) using v_parent_id;
  perform set_config('rutica.bypass_protect', v_prev, true);
  return coalesce(new, old);
end;
$$;

do $$
declare
  r record;
begin
  for r in select * from (values
    ('business_images',            'businesses',  'id_bus', 'business_id_bim',    'moderation_status_bus'),
    ('business_category_map',      'businesses',  'id_bus', 'business_id_bcm',    'moderation_status_bus'),
    ('event_images',               'events',      'id_evt', 'event_id_eim',       'moderation_status_evt'),
    ('event_category_map',         'events',      'id_evt', 'event_id_ecm',       'moderation_status_evt'),
    ('attraction_images',          'attractions', 'id_atr', 'attraction_id_aim',  'moderation_status_atr'),
    ('attraction_category_map',    'attractions', 'id_atr', 'attraction_id_acm',  'moderation_status_atr'),
    ('promotion_images',           'promotions',  'id_prm', 'promotion_id_pim',   'moderation_status_prm'),
    ('promotion_products',         'promotions',  'id_prm', 'promotion_id_ppr',   'moderation_status_prm'),
    ('promotion_combo_items',      'promotions',  'id_prm', 'promotion_id_pci',   'moderation_status_prm'),
    ('promotion_scope_categories', 'promotions',  'id_prm', 'promotion_id_psc',   'moderation_status_prm')
  ) as t(child, parent, pk, fk, status)
  loop
    execute format('drop trigger if exists trg_mark_parent_pending on public.%I', r.child);
    execute format(
      'create trigger trg_mark_parent_pending after insert or update or delete on public.%I
         for each row execute function public.mark_parent_pending(%L, %L, %L, %L)',
      r.child, r.parent, r.pk, r.fk, r.status);
  end loop;
end $$;

-- ============================================================================
-- 4. SUSCRIPCIONES  [S-01]
-- ============================================================================

create or replace function public.protect_profile_subscription()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if public._is_privileged() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new := public._set_cols(new, jsonb_build_object(
      'status_psub', 'pending',
      'approved_at_psub', null, 'approved_by_psub', null,
      'rejected_at_psub', null, 'rejected_by_psub', null,
      'rejection_reason_psub', null, 'cancelled_at_psub', null,
      'expires_at_psub', null,
      'profile_id_psub', auth.uid()));
    return new;
  end if;

  -- UPDATE de usuario: solo puede cancelar una pendiente
  if old.status_psub = 'pending' and new.status_psub = 'cancelled' then
    new := public._restore_cols(new, old, array[
      'profile_id_psub', 'subscription_id_psub', 'subscription_type_psub',
      'payment_reference_psub', 'payment_note_psub', 'approved_at_psub', 'approved_by_psub',
      'rejected_at_psub', 'rejected_by_psub', 'rejection_reason_psub', 'expires_at_psub',
      'subscribed_at_psub', 'created_at_psub']);
    new := public._set_cols(new, jsonb_build_object('cancelled_at_psub', now()));
    return new;
  end if;

  raise exception 'No puedes modificar esta suscripción' using errcode = '42501';
end;
$$;

drop trigger if exists trg_protect_profile_subscription on public.profile_subscriptions;
create trigger trg_protect_profile_subscription
  before insert or update on public.profile_subscriptions
  for each row execute function public.protect_profile_subscription();

-- ============================================================================
-- 5. CUOTAS EN EL SERVIDOR  [S-02] [S2] [S3] [S-21]
-- ============================================================================

-- Tipo de plan de una profile_subscription (soporta subscription_id_psub o subscription_type_psub)
create or replace function public._psub_plan_type(p_psub_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v jsonb;
  v_type text;
begin
  select to_jsonb(ps) into v from public.profile_subscriptions ps where ps.id_psub = p_psub_id;
  if v is null then return null; end if;
  if v ? 'subscription_id_psub' and v ->> 'subscription_id_psub' is not null then
    select s.type_sub::text into v_type from public.subscription s
     where s.id_sub = (v ->> 'subscription_id_psub')::uuid;
    if v_type is not null then return v_type; end if;
  end if;
  return v ->> 'subscription_type_psub';
end;
$$;

-- Cuota que otorga un plan para un tipo de recurso (espejo de subscription.service.ts)
create or replace function public._plan_resource_quota(p_plan text, p_resource text)
returns integer
language sql
immutable
as $$
  select case
    when p_plan = 'package_products'    and p_resource = 'product'          then 20
    when p_plan = 'gallery_business'    and p_resource = 'photo_business'   then 10
    when p_plan = 'promotions'          and p_resource = 'promotion'        then 10
    when p_plan = 'gallery_attractions' and p_resource = 'photo_attraction' then 10
    when p_plan = 'gallery_events'      and p_resource = 'photo_event'      then 10
    when p_plan = 'full_premium' and p_resource = 'product'        then 20
    when p_plan = 'full_premium' and p_resource = 'photo_business' then 10
    when p_plan = 'full_premium' and p_resource = 'promotion'      then 10
    else null
  end;
$$;

-- Límite gratuito por recurso (espejo de DEFAULT_RESOURCE_LIMITS en types/entities/subscription.ts)
create or replace function public._free_resource_limit(p_resource text)
returns integer
language sql
immutable
as $$
  select case p_resource
    when 'product' then 5
    when 'photo_business' then 3
    when 'photo_attraction' then 3
    when 'photo_event' then 3
    when 'promotion' then 5
    else 0
  end;
$$;

-- El usuario no fija su propia cuota ni la vincula a suscripciones o entidades ajenas
create or replace function public.protect_subscription_usage()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_owner uuid;
  v_plan text;
  v_quota integer;
begin
  if public._is_privileged() then
    return new;
  end if;

  if tg_op = 'UPDATE' then
    -- Solo puede tocar used_count_sus (informativo; el límite real lo calcula la BD)
    new := public._restore_cols(new, old, array[
      'profile_subscription_id_sus', 'profile_id_sus', 'resource_type_sus',
      'business_id_sus', 'attraction_id_sus', 'event_id_sus', 'max_quota_sus']);
    return new;
  end if;

  select ps.profile_id_psub into v_owner
    from public.profile_subscriptions ps where ps.id_psub = new.profile_subscription_id_sus;
  if v_owner is distinct from auth.uid() or new.profile_id_sus is distinct from auth.uid() then
    raise exception 'Suscripción inválida' using errcode = '42501';
  end if;

  if (new.business_id_sus is not null and not public.owns_business(new.business_id_sus))
     or (new.attraction_id_sus is not null and not public.owns_attraction(new.attraction_id_sus))
     or (new.event_id_sus is not null and not public.owns_event(new.event_id_sus)) then
    raise exception 'La entidad no te pertenece' using errcode = '42501';
  end if;

  v_plan := public._psub_plan_type(new.profile_subscription_id_sus);
  v_quota := public._plan_resource_quota(v_plan, new.resource_type_sus::text);
  if v_quota is null then
    raise exception 'El plan % no incluye el recurso %', v_plan, new.resource_type_sus using errcode = '42501';
  end if;
  new.max_quota_sus := v_quota;
  new.used_count_sus := least(greatest(coalesce(new.used_count_sus, 0), 0), v_quota);
  return new;
end;
$$;

drop trigger if exists trg_protect_subscription_usage on public.subscription_usage;
create trigger trg_protect_subscription_usage
  before insert or update on public.subscription_usage
  for each row execute function public.protect_subscription_usage();

-- [S2] UNIQUE efectivo con NULLs (PG15+). Si ya hay duplicados, se avisa y se omite.
do $$
begin
  alter table public.subscription_usage drop constraint if exists subscription_usage_unique;
  begin
    alter table public.subscription_usage add constraint subscription_usage_unique
      unique nulls not distinct (profile_subscription_id_sus, resource_type_sus,
                                 business_id_sus, attraction_id_sus, event_id_sus);
  exception when others then
    raise notice 'subscription_usage_unique NO creada (hay duplicados?): %', sqlerrm;
  end;
end $$;

-- Límite total de un recurso para una entidad (gratis + cuotas aprobadas vigentes)
create or replace function public.resource_limit(p_resource text, p_entity_id uuid)
returns integer
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public._free_resource_limit(p_resource) + coalesce((
    select sum(su.max_quota_sus)
      from public.subscription_usage su
      join public.profile_subscriptions ps on ps.id_psub = su.profile_subscription_id_sus
     where su.resource_type_sus::text = p_resource
       and ps.status_psub = 'approved'
       and (ps.expires_at_psub is null or ps.expires_at_psub > now())
       and p_entity_id in (su.business_id_sus, su.attraction_id_sus, su.event_id_sus)
  ), 0)::integer;
$$;

-- Trigger BEFORE INSERT que hace cumplir el límite
-- TG_ARGV: [0] recurso, [1] columna entidad, [2] tabla, [3] filtro extra SQL ('' = ninguno)
create or replace function public.enforce_resource_limit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_resource text := TG_ARGV[0];
  v_entity_col text := TG_ARGV[1];
  v_filter text := nullif(TG_ARGV[3], '');
  v_entity uuid := (to_jsonb(new) ->> v_entity_col)::uuid;
  v_applies boolean := true;
  v_count integer;
  v_limit integer;
begin
  if public._is_privileged() or v_entity is null then
    return new;
  end if;

  -- ¿La fila nueva cuenta para el límite? (p. ej. solo fotos de galería)
  if v_filter is not null then
    execute format('select (%s) from (select ($1).*) t', v_filter) into v_applies using new;
    if not coalesce(v_applies, false) then return new; end if;
  end if;

  execute format('select count(*) from public.%I t where %I = $1 %s',
                 TG_ARGV[2], v_entity_col,
                 case when v_filter is not null then 'and (' || v_filter || ')' else '' end)
    into v_count using v_entity;

  v_limit := public.resource_limit(v_resource, v_entity);
  if v_count >= v_limit then
    raise exception 'Alcanzaste el límite de % (%/%). Adquiere un plan para agregar más.',
      v_resource, v_count, v_limit using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_limit_products on public.products;
create trigger trg_limit_products before insert on public.products
  for each row execute function public.enforce_resource_limit('product', 'business_id_prd', 'products', '');

drop trigger if exists trg_limit_promotions on public.promotions;
create trigger trg_limit_promotions before insert on public.promotions
  for each row execute function public.enforce_resource_limit('promotion', 'business_id_prm', 'promotions', '');

drop trigger if exists trg_limit_business_gallery on public.business_images;
create trigger trg_limit_business_gallery before insert on public.business_images
  for each row execute function public.enforce_resource_limit('photo_business', 'business_id_bim', 'business_images',
    'public.image_prefix_from_path(path_bim) = ''gallery''');

drop trigger if exists trg_limit_attraction_gallery on public.attraction_images;
create trigger trg_limit_attraction_gallery before insert on public.attraction_images
  for each row execute function public.enforce_resource_limit('photo_attraction', 'attraction_id_aim', 'attraction_images',
    'public.image_prefix_from_path(path_aim) = ''gallery''');

drop trigger if exists trg_limit_event_gallery on public.event_images;
create trigger trg_limit_event_gallery before insert on public.event_images
  for each row execute function public.enforce_resource_limit('photo_event', 'event_id_eim', 'event_images',
    'public.image_prefix_from_path(path_eim) = ''gallery''');

-- [S3][S-21] get_available_quota: mapeo correcto, sin consultar perfiles ajenos
create or replace function public.get_available_quota(
  p_profile_id uuid,
  p_resource_type public.resource_type,
  p_entity_id uuid
)
returns table (total_quota integer, total_used integer, available integer)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is not null and p_profile_id is distinct from auth.uid() and not public.is_admin() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  return query
  select coalesce(sum(su.max_quota_sus), 0)::integer,
         coalesce(sum(su.used_count_sus), 0)::integer,
         (coalesce(sum(su.max_quota_sus), 0) - coalesce(sum(su.used_count_sus), 0))::integer
    from public.subscription_usage su
    join public.profile_subscriptions ps on ps.id_psub = su.profile_subscription_id_sus
   where su.profile_id_sus = p_profile_id
     and su.resource_type_sus = p_resource_type
     and ps.status_psub = 'approved'
     and p_entity_id in (su.business_id_sus, su.attraction_id_sus, su.event_id_sus);
end;
$$;

do $$
begin
  revoke execute on function public.expire_monthly_subscriptions() from public, anon, authenticated;
  grant execute on function public.expire_monthly_subscriptions() to service_role;
exception when undefined_function then
  raise notice 'expire_monthly_subscriptions no existe; se omite';
end $$;

-- ============================================================================
-- 6. PERFILES Y ROLES  [S-05] [S-13] [S-10] [L-04]
-- ============================================================================

create or replace function public._default_user_role()
returns text
language sql
stable
as $$
  select case when exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
     where t.typname = 'user_role' and e.enumlabel = 'buyer'
  ) then 'buyer' else 'user' end;
$$;

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_meta jsonb;
  v_from_signup boolean := session_user = 'supabase_auth_admin';
begin
  if tg_op = 'INSERT' then
    -- Registro: solo user/buyer/seller, nunca admin ni premium desde el cliente
    if (v_from_signup or (auth.uid() is not null and not public.is_admin()))
       and coalesce(new.role_prf::text, '') not in ('user', 'buyer', 'seller') then
      new := public._set_cols(new, jsonb_build_object('role_prf', public._default_user_role()));
    end if;
    if v_from_signup or auth.uid() is not null then
      new.is_active_prf := true;
    end if;
    -- Consentimiento enviado en el registro (options.data.terms_version)
    select u.raw_user_meta_data into v_meta from auth.users u where u.id = new.id_prf;
    if v_meta ? 'terms_version' and new.terms_version_prf is null then
      new.terms_version_prf := v_meta ->> 'terms_version';
      new.terms_accepted_at_prf := now();
    end if;
    return new;
  end if;

  if public._is_privileged() then
    return new;
  end if;

  -- UPDATE de usuario
  new.is_active_prf := old.is_active_prf;
  new.id_prf := old.id_prf;
  if new.role_prf is distinct from old.role_prf
     and not (old.role_prf::text in ('user', 'buyer') and new.role_prf::text = 'seller') then
    new.role_prf := old.role_prf;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_fields on public.profiles;
create trigger trg_protect_profile_fields
  before insert or update on public.profiles
  for each row execute function public.protect_profile_fields();

-- [S-10] El teléfono deja de ser legible públicamente.
-- Lectura del perfil propio completo: rpc('get_my_profile').
revoke select on public.profiles from anon, authenticated;
grant select (id_prf, first_name_prf, last_name1_prf, last_name2_prf, role_prf, is_active_prf,
              profile_photo_path_prf, created_at_prf, updated_at_prf)
  on public.profiles to anon, authenticated;

create or replace function public.get_my_profile()
returns setof public.profiles
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select * from public.profiles where id_prf = auth.uid();
$$;
revoke execute on function public.get_my_profile() from public, anon;
grant execute on function public.get_my_profile() to authenticated;

-- ============================================================================
-- 7. LOCATIONS: el dueño puede actualizar la ubicación de lo suyo  [B25]
-- ============================================================================

drop policy if exists "locations_update_owner" on public.locations;
create policy "locations_update_owner" on public.locations for update
  using (
    exists (select 1 from public.businesses  b where b.location_id_bus = id_loc and b.owner_id_bus     = auth.uid())
    or exists (select 1 from public.events      e where e.location_id_evt = id_loc and e.created_by_evt   = auth.uid())
    or exists (select 1 from public.attractions a where a.location_id_atr = id_loc and a.submitted_by_atr = auth.uid())
  )
  with check (
    exists (select 1 from public.businesses  b where b.location_id_bus = id_loc and b.owner_id_bus     = auth.uid())
    or exists (select 1 from public.events      e where e.location_id_evt = id_loc and e.created_by_evt   = auth.uid())
    or exists (select 1 from public.attractions a where a.location_id_atr = id_loc and a.submitted_by_atr = auth.uid())
  );

-- ============================================================================
-- 8. RESEÑAS: integridad, ratings y moderación  [S-09] [S-25] [Q5] [L-07]
-- ============================================================================

-- 8.1 Respaldar y eliminar duplicados (se queda la más reciente por usuario y entidad)
create table if not exists public._backup_reviews_duplicadas_20261015 (
  review_table text not null,
  row_data jsonb not null,
  backed_up_at timestamptz not null default now()
);
alter table public._backup_reviews_duplicadas_20261015 enable row level security;

do $$
declare
  r record;
begin
  for r in select * from (values
    ('business_reviews',   'id_brv', 'business_id_brv',   'user_id_brv', 'created_at_brv'),
    ('event_reviews',      'id_erv', 'event_id_erv',      'user_id_erv', 'created_at_erv'),
    ('attraction_reviews', 'id_arv', 'attraction_id_arv', 'user_id_arv', 'created_at_arv'),
    ('product_reviews',    'id_prv', 'product_id_prv',    'user_id_prv', 'created_at_prv')
  ) as t(tbl, pk, ent, usr, created)
  loop
    execute format($f$
      with ranked as (
        select %1$I as id, row_number() over (partition by %2$I, %3$I order by %4$I desc nulls last, %1$I) as rn
          from public.%5$I where %2$I is not null and %3$I is not null
      ), dup as (select id from ranked where rn > 1),
      saved as (
        insert into public._backup_reviews_duplicadas_20261015 (review_table, row_data)
        select %5$L, to_jsonb(x) from public.%5$I x where x.%1$I in (select id from dup)
        returning 1
      )
      delete from public.%5$I where %1$I in (select id from dup)
    $f$, r.pk, r.ent, r.usr, r.created, r.tbl);

    execute format('alter table public.%I drop constraint if exists %I', r.tbl, r.tbl || '_user_entity_uq');
    execute format('alter table public.%I add constraint %I unique (%I, %I)', r.tbl, r.tbl || '_user_entity_uq', r.ent, r.usr);
  end loop;
end $$;

-- 8.2 Rating 1..5 (NOT VALID: no falla por datos viejos; se intenta validar)
do $$
declare
  r record;
begin
  for r in select * from (values
    ('business_reviews', 'rating_brv'), ('event_reviews', 'rating_erv'),
    ('attraction_reviews', 'rating_arv'), ('product_reviews', 'rating_prv')
  ) as t(tbl, col)
  loop
    execute format('alter table public.%I drop constraint if exists %I', r.tbl, r.tbl || '_rating_ck');
    execute format('alter table public.%I add constraint %I check (%I between 1 and 5) not valid', r.tbl, r.tbl || '_rating_ck', r.col);
    begin
      execute format('alter table public.%I validate constraint %I', r.tbl, r.tbl || '_rating_ck');
    exception when others then
      raise notice '% tiene ratings fuera de 1..5; constraint queda NOT VALID', r.tbl;
    end;
  end loop;
end $$;

-- 8.3 Políticas de inserción: solo sobre entidades aprobadas y sin auto-reseña
drop policy if exists "business_reviews_insert_auth" on public.business_reviews;
create policy "business_reviews_insert_auth" on public.business_reviews for insert
  with check (
    auth.uid() is not null and public.is_active_user() and user_id_brv = auth.uid()
    and exists (select 1 from public.businesses b where b.id_bus = business_id_brv
                 and b.is_active_bus and b.moderation_status_bus = 'approved'
                 and b.owner_id_bus is distinct from auth.uid())
  );

drop policy if exists "event_reviews_insert_auth" on public.event_reviews;
create policy "event_reviews_insert_auth" on public.event_reviews for insert
  with check (
    auth.uid() is not null and public.is_active_user() and user_id_erv = auth.uid()
    and exists (select 1 from public.events e where e.id_evt = event_id_erv
                 and e.is_active_evt and e.moderation_status_evt = 'approved'
                 and e.created_by_evt is distinct from auth.uid())
  );

drop policy if exists "attraction_reviews_insert_auth" on public.attraction_reviews;
create policy "attraction_reviews_insert_auth" on public.attraction_reviews for insert
  with check (
    auth.uid() is not null and public.is_active_user() and user_id_arv = auth.uid()
    and exists (select 1 from public.attractions a where a.id_atr = attraction_id_arv
                 and a.is_active_atr and a.moderation_status_atr = 'approved'
                 and a.submitted_by_atr is distinct from auth.uid())
  );

-- 8.4 Recálculo de ratings por trigger
-- TG_ARGV: [0] tabla padre, [1] pk padre, [2] col avg, [3] col count, [4] fk en review, [5] col rating
create or replace function public.recalc_parent_rating()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_ids uuid[];
  v_id uuid;
  v_prev text := coalesce(current_setting('rutica.bypass_protect', true), '');
begin
  v_ids := array_remove(array[
    case when tg_op <> 'INSERT' then (to_jsonb(old) ->> TG_ARGV[4])::uuid end,
    case when tg_op <> 'DELETE' then (to_jsonb(new) ->> TG_ARGV[4])::uuid end
  ], null);

  perform set_config('rutica.bypass_protect', 'on', true);
  foreach v_id in array v_ids loop
    execute format(
      'update public.%1$I p set %3$I = coalesce(s.avg, 0), %4$I = coalesce(s.cnt, 0)
         from (select round(avg(%6$I)::numeric, 1) as avg, count(*)::int as cnt
                 from public.%7$I where %5$I = $1) s
        where p.%2$I = $1',
      TG_ARGV[0], TG_ARGV[1], TG_ARGV[2], TG_ARGV[3], TG_ARGV[4], TG_ARGV[5], TG_TABLE_NAME)
    using v_id;
  end loop;
  perform set_config('rutica.bypass_protect', v_prev, true);
  return null;
end;
$$;

drop trigger if exists trg_recalc_rating on public.business_reviews;
create trigger trg_recalc_rating after insert or update of rating_brv, business_id_brv or delete on public.business_reviews
  for each row execute function public.recalc_parent_rating('businesses', 'id_bus', 'avg_rating_bus', 'reviews_count_bus', 'business_id_brv', 'rating_brv');

drop trigger if exists trg_recalc_rating on public.event_reviews;
create trigger trg_recalc_rating after insert or update of rating_erv, event_id_erv or delete on public.event_reviews
  for each row execute function public.recalc_parent_rating('events', 'id_evt', 'avg_rating_evt', 'reviews_count_evt', 'event_id_erv', 'rating_erv');

drop trigger if exists trg_recalc_rating on public.attraction_reviews;
create trigger trg_recalc_rating after insert or update of rating_arv, attraction_id_arv or delete on public.attraction_reviews
  for each row execute function public.recalc_parent_rating('attractions', 'id_atr', 'avg_rating_atr', 'reviews_count_atr', 'attraction_id_arv', 'rating_arv');

drop trigger if exists trg_recalc_rating on public.product_reviews;
create trigger trg_recalc_rating after insert or update of rating_prv, product_id_prv or delete on public.product_reviews
  for each row execute function public.recalc_parent_rating('products', 'id_prd', 'avg_rating_prd', 'reviews_count_prd', 'product_id_prv', 'rating_prv');

-- 8.5 Trazabilidad cuando un admin edita una reseña ajena
create table if not exists public.review_moderation_log (
  id_rml uuid primary key default gen_random_uuid(),
  review_table_rml text not null,
  review_id_rml uuid not null,
  admin_id_rml uuid references public.profiles(id_prf) on delete set null,
  old_rating_rml integer,
  new_rating_rml integer,
  old_comment_rml text,
  new_comment_rml text,
  created_at_rml timestamptz not null default now()
);
alter table public.review_moderation_log enable row level security;
drop policy if exists "review_moderation_log_admin" on public.review_moderation_log;
create policy "review_moderation_log_admin" on public.review_moderation_log for select using (public.is_admin());

create or replace function public.log_review_moderation()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  sfx text := TG_ARGV[0];
  v_old jsonb := to_jsonb(old);
  v_new jsonb := to_jsonb(new);
begin
  if auth.uid() is null
     or (v_old ->> ('user_id_' || sfx))::uuid = auth.uid()
     or not public.is_admin() then
    return new;
  end if;
  if public._cols_changed(v_old, v_new, array['rating_' || sfx, 'comment_' || sfx]) then
    insert into public.review_moderation_log
      (review_table_rml, review_id_rml, admin_id_rml, old_rating_rml, new_rating_rml, old_comment_rml, new_comment_rml)
    values (TG_TABLE_NAME, (v_old ->> ('id_' || sfx))::uuid, auth.uid(),
            (v_old ->> ('rating_' || sfx))::int, (v_new ->> ('rating_' || sfx))::int,
            v_old ->> ('comment_' || sfx), v_new ->> ('comment_' || sfx));
    new := public._set_cols(new, jsonb_build_object('moderated_at_' || sfx, now()));
  end if;
  return new;
end;
$$;

drop trigger if exists trg_log_review_moderation on public.business_reviews;
create trigger trg_log_review_moderation before update on public.business_reviews
  for each row execute function public.log_review_moderation('brv');
drop trigger if exists trg_log_review_moderation on public.event_reviews;
create trigger trg_log_review_moderation before update on public.event_reviews
  for each row execute function public.log_review_moderation('erv');
drop trigger if exists trg_log_review_moderation on public.attraction_reviews;
create trigger trg_log_review_moderation before update on public.attraction_reviews
  for each row execute function public.log_review_moderation('arv');
drop trigger if exists trg_log_review_moderation on public.product_reviews;
create trigger trg_log_review_moderation before update on public.product_reviews
  for each row execute function public.log_review_moderation('prv');

-- 8.6 Recalcular todos los ratings existentes una vez
select set_config('rutica.bypass_protect', 'on', true);
update public.businesses b set avg_rating_bus = coalesce(s.avg, 0), reviews_count_bus = coalesce(s.cnt, 0)
  from (select bb.id_bus, round(avg(r.rating_brv)::numeric, 1) avg, count(r.id_brv)::int cnt
          from public.businesses bb left join public.business_reviews r on r.business_id_brv = bb.id_bus
         group by bb.id_bus) s where s.id_bus = b.id_bus;
update public.events e set avg_rating_evt = coalesce(s.avg, 0), reviews_count_evt = coalesce(s.cnt, 0)
  from (select ee.id_evt, round(avg(r.rating_erv)::numeric, 1) avg, count(r.id_erv)::int cnt
          from public.events ee left join public.event_reviews r on r.event_id_erv = ee.id_evt
         group by ee.id_evt) s where s.id_evt = e.id_evt;
update public.attractions a set avg_rating_atr = coalesce(s.avg, 0), reviews_count_atr = coalesce(s.cnt, 0)
  from (select aa.id_atr, round(avg(r.rating_arv)::numeric, 1) avg, count(r.id_arv)::int cnt
          from public.attractions aa left join public.attraction_reviews r on r.attraction_id_arv = aa.id_atr
         group by aa.id_atr) s where s.id_atr = a.id_atr;
update public.products p set avg_rating_prd = coalesce(s.avg, 0), reviews_count_prd = coalesce(s.cnt, 0)
  from (select pp.id_prd, round(avg(r.rating_prv)::numeric, 1) avg, count(r.id_prv)::int cnt
          from public.products pp left join public.product_reviews r on r.product_id_prv = pp.id_prd
         group by pp.id_prd) s where s.id_prd = p.id_prd;
select set_config('rutica.bypass_protect', 'off', true);

-- ============================================================================
-- 9. LIKES PRIVADOS + CONTEOS AGREGADOS  [S-18] [Q6]
-- ============================================================================

do $$
declare
  r record;
begin
  for r in select * from (values
    ('business_likes',          'user_id_blk', 'public.owns_business(business_id_blk)'),
    ('event_likes',             'user_id_elk', 'public.owns_event(event_id_elk)'),
    ('attraction_likes',        'user_id_alk', 'public.owns_attraction(attraction_id_alk)'),
    ('business_review_likes',   'user_id_brl', 'false'),
    ('event_review_likes',      'user_id_erl', 'false'),
    ('attraction_review_likes', 'user_id_arl', 'false')
  ) as t(tbl, usr, owner_expr)
  loop
    execute format('drop policy if exists %I on public.%I', r.tbl || '_select_all', r.tbl);
    execute format('drop policy if exists %I on public.%I', r.tbl || '_select_own', r.tbl);
    execute format(
      'create policy %I on public.%I for select using (%I = auth.uid() or %s or public.is_admin())',
      r.tbl || '_select_own', r.tbl, r.usr, r.owner_expr);
  end loop;
end $$;

-- Conteo de likes por id para una de las tablas de likes (lista blanca)
create or replace function public.get_like_counts(p_table text, p_ids uuid[])
returns table (target_id uuid, likes bigint)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_col text;
begin
  v_col := case p_table
    when 'business_likes'          then 'business_id_blk'
    when 'event_likes'             then 'event_id_elk'
    when 'attraction_likes'        then 'attraction_id_alk'
    when 'business_review_likes'   then 'review_id_brl'
    when 'event_review_likes'      then 'review_id_erl'
    when 'attraction_review_likes' then 'review_id_arl'
  end;
  if v_col is null then
    raise exception 'Tabla de likes no permitida: %', p_table;
  end if;
  return query execute format(
    'select %1$I, count(*) from public.%2$I where %1$I = any($1) group by %1$I', v_col, p_table)
    using p_ids;
end;
$$;
grant execute on function public.get_like_counts(text, uuid[]) to anon, authenticated;

-- ============================================================================
-- 10. ANALÍTICA: sin suplantar usuarios ni contar al dueño  [S-16]
-- ============================================================================

drop policy if exists "business_contact_clicks_insert_all" on public.business_contact_clicks;
create policy "business_contact_clicks_insert_all" on public.business_contact_clicks for insert
  to authenticated, anon
  with check (
    (user_id_bcc is null or user_id_bcc = auth.uid())
    and not public.owns_business(business_id_bcc)
  );

do $$
declare
  r record;
begin
  for r in select * from (values
    ('business_interactions', 'user_id_bin'), ('event_interactions', 'user_id_ein'),
    ('attraction_interactions', 'user_id_ain'), ('business_review_interactions', 'user_id_bri'),
    ('event_review_interactions', 'user_id_eri'), ('attraction_review_interactions', 'user_id_ari'),
    ('product_review_interactions', 'user_id_pri')
  ) as t(tbl, usr)
  loop
    execute format('drop policy if exists %I on public.%I', r.tbl || '_insert_all', r.tbl);
    execute format(
      'create policy %I on public.%I for insert with check (%I is null or %I = auth.uid())',
      r.tbl || '_insert_all', r.tbl, r.usr, r.usr);
  end loop;
end $$;

-- ============================================================================
-- 11. STORAGE: límites de tamaño y tipo  [S-17]
-- ============================================================================

update storage.buckets
   set file_size_limit = 5242880,
       allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
 where id in ('profiles-images', 'attractions-images', 'business-images',
              'events-images', 'product-images', 'promotions-images');

-- ============================================================================
-- 12. LONGITUD DE TEXTOS  [S-20]  (NOT VALID: solo aplica a datos nuevos)
-- ============================================================================

do $$
declare
  r record;
begin
  for r in select * from (values
    ('businesses', 'name_bus', 150), ('businesses', 'description_bus', 5000),
    ('events', 'name_evt', 150), ('events', 'description_evt', 5000),
    ('attractions', 'name_atr', 150), ('attractions', 'description_atr', 5000),
    ('products', 'name_prd', 150), ('products', 'description_prd', 3000),
    ('promotions', 'title_prm', 150), ('promotions', 'description_prm', 3000),
    ('business_reviews', 'comment_brv', 2000), ('event_reviews', 'comment_erv', 2000),
    ('attraction_reviews', 'comment_arv', 2000), ('product_reviews', 'comment_prv', 2000),
    ('profiles', 'first_name_prf', 80), ('profiles', 'last_name1_prf', 80), ('profiles', 'last_name2_prf', 80)
  ) as t(tbl, col, maxlen)
  loop
    execute format('alter table public.%I drop constraint if exists %I', r.tbl, r.col || '_len_ck');
    execute format('alter table public.%I add constraint %I check (char_length(%I) <= %s) not valid',
                   r.tbl, r.col || '_len_ck', r.col, r.maxlen);
  end loop;
end $$;

-- ============================================================================
-- 13. ÍNDICES  [Q4] [S7]
-- ============================================================================

do $$
declare
  v_schema text;
begin
  if not exists (select 1 from pg_extension where extname = 'pg_trgm') then
    if exists (select 1 from pg_namespace where nspname = 'extensions') then
      create extension pg_trgm with schema extensions;
    else
      create extension pg_trgm;
    end if;
  end if;
  select n.nspname into v_schema
    from pg_extension e join pg_namespace n on n.oid = e.extnamespace where e.extname = 'pg_trgm';

  execute format('create index if not exists idx_businesses_name_trgm  on public.businesses  using gin (name_bus  %I.gin_trgm_ops)', v_schema);
  execute format('create index if not exists idx_attractions_name_trgm on public.attractions using gin (name_atr  %I.gin_trgm_ops)', v_schema);
  execute format('create index if not exists idx_events_name_trgm      on public.events      using gin (name_evt  %I.gin_trgm_ops)', v_schema);
  execute format('create index if not exists idx_promotions_title_trgm on public.promotions  using gin (title_prm %I.gin_trgm_ops)', v_schema);
end $$;

create index if not exists idx_businesses_listing  on public.businesses  (moderation_status_bus, is_active_bus, created_at_bus desc);
create index if not exists idx_attractions_listing on public.attractions (moderation_status_atr, is_active_atr, created_at_atr desc);
create index if not exists idx_events_listing      on public.events      (moderation_status_evt, is_active_evt, end_at_evt);

-- ============================================================================
-- 14. CONFIGURACIÓN DE LA APP (datos de pago)  [L-01]
-- ============================================================================

create table if not exists public.app_settings (
  key_set text primary key,
  value_set jsonb,
  updated_at_set timestamptz not null default now()
);
alter table public.app_settings enable row level security;
drop policy if exists "app_settings_select_all" on public.app_settings;
create policy "app_settings_select_all" on public.app_settings for select using (true);
drop policy if exists "app_settings_admin_all" on public.app_settings;
create policy "app_settings_admin_all" on public.app_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- Se crean VACÍOS a propósito: hasta que un admin cargue los datos reales,
-- la app no muestra la pantalla de pago.
--   update public.app_settings set value_set = '"8xxx-xxxx"' where key_set = 'payment.sinpe_number';
insert into public.app_settings (key_set, value_set) values
  ('payment.sinpe_number', null),
  ('payment.sinpe_name', null),
  ('payment.iban', null),
  ('payment.transfer_name', null),
  ('legal.terms_version', '"2026-10-15"')
on conflict (key_set) do nothing;

-- ============================================================================
-- 15. BORRADO DE CUENTA  [L-09]
-- ============================================================================
-- Borra la cuenta del usuario autenticado y todo su contenido.
-- Los archivos de Storage NO se borran desde SQL (ver pendiente en el plan).

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  perform set_config('rutica.bypass_protect', 'on', true);

  -- Referencias como moderador (si fue admin)
  update public.businesses  set reviewed_by_bus = null where reviewed_by_bus = v_uid;
  update public.events      set reviewed_by_evt = null where reviewed_by_evt = v_uid;
  update public.attractions set reviewed_by_atr = null where reviewed_by_atr = v_uid;
  update public.promotions  set reviewed_by_prm = null where reviewed_by_prm = v_uid;

  -- Contenido propio (las tablas hijas tienen ON DELETE CASCADE)
  delete from public.promotions
   where created_by_prm = v_uid
      or business_id_prm in (select id_bus from public.businesses where owner_id_bus = v_uid);
  delete from public.products
   where business_id_prd in (select id_bus from public.businesses where owner_id_bus = v_uid);
  delete from public.businesses  where owner_id_bus = v_uid;
  delete from public.events      where created_by_evt = v_uid;
  delete from public.attractions where submitted_by_atr = v_uid;

  -- Perfil (reseñas, likes, suscripciones y usos caen en cascada) y usuario de auth
  delete from public.profiles where id_prf = v_uid;
  delete from auth.users where id = v_uid;

  perform set_config('rutica.bypass_protect', '', true);
end;
$$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ============================================================================
-- 16. HARDENING DE FUNCIONES HELPER  [S-21]
-- ============================================================================

do $$
begin
  alter function public.calculate_subscription_expiry(text, timestamptz) set search_path = public, pg_temp;
exception when undefined_function then
  raise notice 'calculate_subscription_expiry no existe; se omite';
end $$;

commit;

-- ============================================================================
-- POST-MIGRACIÓN (manual, fuera de la transacción)
-- ============================================================================
-- a) Auditar posibles auto-aprobaciones previas a este script [S-01]:
--      select * from public.profile_subscriptions
--       where status_psub = 'approved' and approved_by_psub is null;
-- b) Auditar admins [S-05]:
--      select id_prf, first_name_prf, created_at_prf from public.profiles where role_prf = 'admin';
-- c) Revisar handle_new_user() y is_valid_role_update() [S-05][S-13]: este
--    script los neutraliza con triggers, pero conviene limpiarlos.
-- d) Cargar los datos de pago reales en public.app_settings [L-01].
-- e) Supabase → Auth: activar "Secure password change", contraseñas de 8+
--    caracteres y protección contra contraseñas filtradas [S-15][S-24].
-- f) Reseñas duplicadas eliminadas (respaldo):
--      select * from public._backup_reviews_duplicadas_20261015;
