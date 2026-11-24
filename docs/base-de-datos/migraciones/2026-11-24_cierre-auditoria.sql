-- ============================================================================
-- Rutica · Cierre de la auditoría (2026-11-24)
-- ============================================================================
-- Va DESPUÉS de 2026-10-15_auditoria.sql. Idempotente y en una sola transacción.
-- Cierra: 1.24 (RLS con initplan), 1.13 (límite de frecuencia en analítica),
-- 4.9 (reportes de contenido) y 5.17 (estadísticas del dashboard en SQL, que además
-- corrige el dashboard premium: desde que los "me gusta" son privados, el dueño veía 0).
-- ============================================================================

begin;

-- ============================================================================
-- 0. [H-34] Políticas heredadas que abrían escrituras a cualquier usuario con sesión
-- ============================================================================
-- Las políticas se combinan con OR: estas anulaban a las de dueño que ya existen
-- (business_images_*_owner, locations_update_owner, *_storage_*_owner). Con ellas,
-- cualquier cuenta podía borrar o reemplazar las fotos de cualquier comercio y mover
-- la ubicación de cualquier comercio, evento o atracción.
drop policy if exists business_images_table_insert on public.business_images;
drop policy if exists business_images_table_update on public.business_images;
drop policy if exists business_images_table_delete on public.business_images;
drop policy if exists locations_update_policy on public.locations;
drop policy if exists locations_insert_policy on public.locations; -- duplica locations_insert_authenticated
drop policy if exists business_images_authenticated_insert on storage.objects;
drop policy if exists business_images_authenticated_update on storage.objects;
drop policy if exists business_images_authenticated_delete on storage.objects;

-- La app crea provincia/cantón/distrito si la geocodificación trae uno nuevo, así que la
-- inserción en el catálogo sigue abierta, pero solo para cuentas activas.
do $$
declare t text;
begin
  foreach t in array array['countries', 'provinces', 'cantons', 'districts'] loop
    if exists (select 1 from pg_policies where schemaname = 'public' and tablename = t
               and policyname = t || '_insert_policy') then
      execute format('alter policy %I on public.%I with check ((select public.is_active_user()))',
                     t || '_insert_policy', t);
    end if;
  end loop;
end $$;

-- Fotos de perfil: solo en la carpeta propia (<uid>/...), como ya hacen la app y el resto
-- de políticas del bucket.
do $$
begin
  if exists (select 1 from pg_policies where schemaname = 'storage' and policyname = 'profiles_images_insert_own') then
    alter policy profiles_images_insert_own on storage.objects with check (
      bucket_id = 'profiles-images'
      and (select auth.uid()) is not null
      and (storage.foldername(name))[1] = (select auth.uid())::text
    );
  end if;
end $$;

-- ============================================================================
-- 1. [1.24] RLS: (select auth.uid()) en lugar de auth.uid()
-- ============================================================================
-- auth.uid(), auth.role(), auth.jwt() e is_admin() no dependen de la fila. Envueltos en
-- un subselect, Postgres los evalúa una vez por consulta (initplan) y no una vez por fila.
-- Se reescriben todas las políticas de public y storage de forma mecánica; el resultado
-- es semánticamente idéntico. Idempotente: lo ya envuelto ("SELECT auth.uid()") no se toca.
do $$
declare
  p record;
  pat constant text := '(?<!SELECT )(?<![A-Za-z0-9_.])((?:auth\.)(?:uid|role|jwt)\(\)|(?:public\.)?is_admin\(\))';
  new_qual text;
  new_check text;
  stmt text;
  n int := 0;
begin
  for p in
    select pol.schemaname, pol.tablename, pol.policyname, pol.cmd, pol.qual, pol.with_check
      from pg_policies pol
     where pol.schemaname in ('public', 'storage')
       and (coalesce(pol.qual, '') ~ pat or coalesce(pol.with_check, '') ~ pat)
       -- Se excluyen las tablas con alguna política que consulta la propia tabla (hoy: profiles,
       -- por profiles_update_own). Ensayado: envolver sus políticas de SELECT hace que Postgres
       -- reporte "infinite recursion detected in policy" al evaluar esa subconsulta.
       and not exists (
         select 1 from pg_policies s
          where s.schemaname = pol.schemaname and s.tablename = pol.tablename
            and (coalesce(s.qual, '') || ' ' || coalesce(s.with_check, ''))
                ~ ('FROM (' || s.schemaname || '\.)?' || s.tablename || '([^a-z_]|$)'))
  loop
    new_qual  := case when p.qual is null then null else regexp_replace(p.qual, pat, '(select \1)', 'g') end;
    new_check := case when p.with_check is null then null else regexp_replace(p.with_check, pat, '(select \1)', 'g') end;
    stmt := format('alter policy %I on %I.%I', p.policyname, p.schemaname, p.tablename);
    if new_qual is not null and p.cmd <> 'INSERT' then
      stmt := stmt || format(' using (%s)', new_qual);
    end if;
    if new_check is not null then
      stmt := stmt || format(' with check (%s)', new_check);
    end if;
    execute stmt;
    n := n + 1;
  end loop;
  raise notice '[1.24] políticas reescritas: %', n;
end $$;

-- ============================================================================
-- 2. [1.13] Analítica: límite de frecuencia de clics de contacto
-- ============================================================================
-- Sin Edge Function: un trigger descarta en silencio (return null) los clics que superan
-- el límite, así la interfaz no muestra errores y las métricas no se inflan.
--   - usuario con sesión: máx. 10 clics por comercio cada 10 minutos
--   - anónimo: máx. 60 clics por comercio por minuto (no hay identidad que limitar)
create index if not exists idx_bcc_business_created
  on public.business_contact_clicks (business_id_bcc, created_at_bcc desc);

create or replace function public.rate_limit_contact_clicks()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  recent int;
begin
  if new.user_id_bcc is not null then
    select count(*) into recent
      from public.business_contact_clicks
     where business_id_bcc = new.business_id_bcc
       and user_id_bcc = new.user_id_bcc
       and created_at_bcc > now() - interval '10 minutes';
    if recent >= 10 then return null; end if;
  else
    select count(*) into recent
      from public.business_contact_clicks
     where business_id_bcc = new.business_id_bcc
       and user_id_bcc is null
       and created_at_bcc > now() - interval '1 minute';
    if recent >= 60 then return null; end if;
  end if;
  return new;
end;
$$;
revoke execute on function public.rate_limit_contact_clicks() from public, anon, authenticated;

drop trigger if exists trg_rate_limit_contact_clicks on public.business_contact_clicks;
create trigger trg_rate_limit_contact_clicks
  before insert on public.business_contact_clicks
  for each row execute function public.rate_limit_contact_clicks();

-- ============================================================================
-- 3. [4.9] Reportes de contenido
-- ============================================================================
create table if not exists public.content_reports (
  id_rep          uuid primary key default gen_random_uuid(),
  reporter_id_rep uuid not null default auth.uid() references public.profiles (id_prf) on delete cascade,
  entity_type_rep text not null check (entity_type_rep in (
                    'business', 'event', 'attraction', 'product', 'promotion',
                    'business_review', 'event_review', 'attraction_review', 'product_review')),
  entity_id_rep   uuid not null,
  reason_rep      text not null check (reason_rep in (
                    'spam', 'offensive', 'false_info', 'illegal', 'copyright', 'other')),
  details_rep     text check (char_length(details_rep) <= 1000),
  status_rep      text not null default 'open' check (status_rep in ('open', 'actioned', 'dismissed')),
  reviewed_by_rep uuid references public.profiles (id_prf) on delete set null,
  reviewed_at_rep timestamptz,
  created_at_rep  timestamptz not null default now(),
  constraint content_reports_once unique (reporter_id_rep, entity_type_rep, entity_id_rep)
);
create index if not exists idx_content_reports_status on public.content_reports (status_rep, created_at_rep desc);

alter table public.content_reports enable row level security;

drop policy if exists "content_reports_insert_own" on public.content_reports;
create policy "content_reports_insert_own" on public.content_reports for insert to authenticated
  with check (reporter_id_rep = (select auth.uid()) and status_rep = 'open'
              and reviewed_by_rep is null and reviewed_at_rep is null);

drop policy if exists "content_reports_select_own_or_admin" on public.content_reports;
create policy "content_reports_select_own_or_admin" on public.content_reports for select to authenticated
  using (reporter_id_rep = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "content_reports_update_admin" on public.content_reports;
create policy "content_reports_update_admin" on public.content_reports for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Máximo 20 reportes por usuario por día (evita que se use para inundar la moderación)
create or replace function public.limit_content_reports()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if (select count(*) from public.content_reports
       where reporter_id_rep = new.reporter_id_rep
         and created_at_rep > now() - interval '1 day') >= 20 then
    raise exception 'Alcanzaste el límite de reportes por hoy' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
revoke execute on function public.limit_content_reports() from public, anon, authenticated;

drop trigger if exists trg_limit_content_reports on public.content_reports;
create trigger trg_limit_content_reports
  before insert on public.content_reports
  for each row execute function public.limit_content_reports();

grant select, insert on public.content_reports to authenticated;
grant update (status_rep, reviewed_by_rep, reviewed_at_rep) on public.content_reports to authenticated;

-- ============================================================================
-- 4. [5.17] Dashboard premium: favoritos agregados en SQL
-- ============================================================================
-- Devuelve, solo para comercios del usuario (o para un admin), los favoritos agrupados por
-- comercio y por hora. No expone quién dio el "me gusta" (los likes son privados, S-18).
create or replace function public.get_owner_like_buckets(p_business_ids uuid[], p_since timestamptz)
returns table (business_id uuid, bucket_hour timestamptz, likes bigint)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select l.business_id_blk, date_trunc('hour', l.created_at_blk), count(*)
    from public.business_likes l
    join public.businesses b on b.id_bus = l.business_id_blk
   where l.business_id_blk = any (p_business_ids)
     and l.created_at_blk >= p_since
     and (b.owner_id_bus = auth.uid() or public.is_admin())
   group by 1, 2;
$$;
revoke execute on function public.get_owner_like_buckets(uuid[], timestamptz) from public, anon;
grant execute on function public.get_owner_like_buckets(uuid[], timestamptz) to authenticated;

-- Total histórico por comercio (para las tarjetas), con el mismo control de dueño
create or replace function public.get_owner_like_totals(p_business_ids uuid[])
returns table (business_id uuid, likes bigint)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select l.business_id_blk, count(*)
    from public.business_likes l
    join public.businesses b on b.id_bus = l.business_id_blk
   where l.business_id_blk = any (p_business_ids)
     and (b.owner_id_bus = auth.uid() or public.is_admin())
   group by 1;
$$;
revoke execute on function public.get_owner_like_totals(uuid[]) from public, anon;
grant execute on function public.get_owner_like_totals(uuid[]) to authenticated;

-- PostgREST cachea el esquema: sin esto las RPC y la tabla nuevas dan 404 hasta recargar
notify pgrst, 'reload schema';

commit;
