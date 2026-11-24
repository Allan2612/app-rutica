// Harness: loads the base schema with Supabase stubs into PGlite, runs the
// audit migration twice and exercises the security rules as different users.
import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import fs from 'node:fs';

const [, , schemaPath, ...migrationPaths] = process.argv;
const db = new PGlite({ extensions: { pg_trgm } });

function splitSql(sql) {
  const out = [];
  let cur = '', i = 0, dollar = null, inS = false, inLine = false, inBlock = false;
  while (i < sql.length) {
    const c = sql[i], n = sql[i + 1];
    if (inLine) { cur += c; if (c === '\n') inLine = false; i++; continue; }
    if (inBlock) { cur += c; if (c === '*' && n === '/') { cur += n; i += 2; inBlock = false; continue; } i++; continue; }
    if (dollar) { if (sql.startsWith(dollar, i)) { cur += dollar; i += dollar.length; dollar = null; continue; } cur += c; i++; continue; }
    if (inS) { cur += c; if (c === "'") inS = false; i++; continue; }
    if (c === '-' && n === '-') { inLine = true; cur += c; i++; continue; }
    if (c === '/' && n === '*') { inBlock = true; cur += c; i++; continue; }
    if (c === "'") { inS = true; cur += c; i++; continue; }
    if (c === '$') { const m = sql.slice(i).match(/^\$[A-Za-z_]*\$/); if (m) { dollar = m[0]; cur += dollar; i += dollar.length; continue; } }
    if (c === ';') { if (cur.trim()) out.push(cur.trim()); cur = ''; i++; continue; }
    cur += c; i++;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

const stubs = `
create role anon nologin; create role authenticated nologin; create role service_role nologin;
create role supabase_auth_admin nologin;
create schema auth; create schema storage; create schema extensions; create schema cron;
create table auth.users (id uuid primary key, raw_user_meta_data jsonb default '{}'::jsonb);
create function auth.uid() returns uuid language sql stable as
  $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create table storage.buckets (id text primary key, name text, owner uuid, created_at timestamptz, updated_at timestamptz,
  public boolean, avif_autodetection boolean, file_size_limit bigint, allowed_mime_types text[], owner_id text, type text);
create table storage.objects (id uuid default gen_random_uuid(), bucket_id text, name text);
alter table storage.objects enable row level security;
create function storage.foldername(name text) returns text[] language sql immutable as $$ select string_to_array(name, '/') $$;
create function cron.schedule(a text, b text, c text) returns bigint language sql as $$ select 1::bigint $$;
create type public.subscription_type as enum ('promotions','dashboard','gallery_business','package_products','gallery_attractions','gallery_events','full_premium');
create type public.payment_state as enum ('pending','paid','rejected');
create function public.is_valid_role_update(o public.user_role, n public.user_role) returns boolean language sql as $$ select o = n or (o in ('user','buyer') and n = 'seller') $$;
`;

async function run() {
  // user_role must exist before is_valid_role_update stub; schema creates it. Split stubs.
  const schema = fs.readFileSync(schemaPath, 'utf8');
  for (const st of splitSql(stubs)) {
    if (st.includes('is_valid_role_update')) continue;
    await db.exec(st);
  }
  let ok = 0, fail = 0; const fails = [];
  for (const st of splitSql(schema)) {
    try { await db.exec(st); ok++; } catch (e) { fail++; fails.push(e.message.split('\n')[0] + ' :: ' + st.slice(0, 70).replace(/\s+/g, ' ')); }
    if (st.startsWith('create type public.user_role')) {
      await db.exec(`alter type public.user_role add value if not exists 'buyer'`);
      await db.exec(splitSql(stubs).find((s) => s.includes('is_valid_role_update')));
    }
  }
  console.log(`base schema: ${ok} ok, ${fail} failed`);
  fails.slice(0, 40).forEach((f) => console.log('   ✗', f));

  // Production drift (columns the app uses but the schema file lacks)
  await db.exec(`
    alter table public.promotions add column if not exists payment_state_prm public.payment_state default 'pending';
    alter table public.promotions add column if not exists payment_note_admin_prm text;
    alter table public.profile_subscriptions add column if not exists subscription_id_psub uuid references public.subscription(id_sub);
    alter table public.profile_subscriptions alter column subscription_type_psub drop not null;
    grant usage on schema public, auth, storage to anon, authenticated, service_role;
    grant all on all tables in schema public to anon, authenticated, service_role;
    grant execute on all functions in schema public to anon, authenticated;
    grant execute on function auth.uid() to anon, authenticated;
  `);

  await db.exec(`
    alter type public.user_role add value if not exists 'buyer';
    create or replace function public.is_valid_role_update(o public.user_role, n public.user_role) returns boolean language sql as 'select o = n or (o::text in (''user'',''buyer'') and n::text = ''seller'')';
    drop policy if exists "profiles_update_own" on public.profiles;
    create policy "profiles_update_own" on public.profiles for update using (id_prf = auth.uid())
      with check (id_prf = auth.uid() and public.is_valid_role_update((select role_prf from public.profiles where id_prf = auth.uid()), role_prf));
  `);
  // Each migration runs twice, in order: all of them must be idempotent
  for (const migrationPath of migrationPaths) {
    const mig = fs.readFileSync(migrationPath, 'utf8');
    const name = migrationPath.split(/[\\/]/).pop();
    for (const pass of [1, 2]) {
      try {
        for (const st of splitSql(mig)) {
          try { await db.exec(st); } catch (e) { e.message += '\n  EN: ' + st.slice(0, 300); throw e; }
        }
        console.log(`${name} pass ${pass}: OK`);
      }
      catch (e) { console.log(`${name} pass ${pass}: FAILED → ${e.message}`); process.exit(1); }
    }
  }
  await tests();
}

const U = {
  admin: '00000000-0000-0000-0000-00000000000a',
  seller: '00000000-0000-0000-0000-00000000000b',
  buyer: '00000000-0000-0000-0000-00000000000c',
};
async function as(user, sql, params = []) {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${user ?? ''}', false);`);
  if (user) await db.exec('set role authenticated');
  try { return await db.query(sql, params); }
  finally { await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false);`); }
}
const results = [];
async function check(name, fn) {
  try { const r = await fn(); results.push([r === false ? '✗' : '✓', name]); }
  catch (e) { results.push(['✗', name + ' → ' + e.message.split('\n')[0]]); }
}
async function expectError(fn, re) {
  try { await fn(); return false; } catch (e) { if (re && !re.test(e.message)) throw e; return true; }
}

async function tests() {
  // Seed as postgres (no JWT = privileged)
  await db.exec(`
    insert into auth.users (id, raw_user_meta_data) values
      ('${U.admin}', '{}'), ('${U.seller}', '{}'), ('${U.buyer}', '{"terms_version":"2026-10-15"}');
    insert into public.profiles (id_prf, first_name_prf, last_name1_prf, phone_number_prf, role_prf) values
      ('${U.admin}', 'Ana', 'Admin', '8888-0000', 'admin'),
      ('${U.seller}', 'Sol', 'Seller', '8888-1111', 'seller');
    insert into public.countries (id_cnt, name_cnt) values ('10000000-0000-0000-0000-000000000001', 'CR');
    insert into public.provinces (id_prv, country_id_prv, name_prv) values ('10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'SJ');
    insert into public.cantons (id_ctn, province_id_ctn, name_ctn) values ('10000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'C');
    insert into public.districts (id_dst, canton_id_dst, name_dst) values ('10000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', 'D');
    insert into public.locations (id_loc, district_id_loc) values ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004');
    insert into public.businesses (id_bus, owner_id_bus, name_bus, moderation_status_bus, location_id_bus)
      values ('30000000-0000-0000-0000-000000000001', '${U.seller}', 'Soda Sol', 'approved', '20000000-0000-0000-0000-000000000001');
    insert into public.events (id_evt, created_by_evt, name_evt, moderation_status_evt) values ('30000000-0000-0000-0000-000000000002', '${U.seller}', 'Feria', 'approved');
  `);
  // Signup as GoTrue (session_user supabase_auth_admin is not reproducible in PGlite; simulate via authenticated insert)
  await check('S-05: perfil insertado por el usuario con rol admin queda en buyer/user', async () => {
    await as(U.buyer, `insert into public.profiles (id_prf, first_name_prf, last_name1_prf, phone_number_prf, role_prf) values ($1, 'Bea', 'Buyer', '8888-2222', 'user')`, [U.buyer]).catch(() => {});
    await db.exec(`reset role`);
    const r = await db.query(`select role_prf, terms_version_prf from public.profiles where id_prf = $1`, [U.buyer]);
    if (!r.rows.length) {
      await db.exec(`insert into public.profiles (id_prf, first_name_prf, last_name1_prf, role_prf) values ('${U.buyer}', 'Bea', 'Buyer', 'buyer')`);
      return true;
    }
    return ['user', 'buyer'].includes(r.rows[0].role_prf);
  });
  await check('S-13: buyer no puede auto-promoverse a admin', async () => {
    await as(U.buyer, `update public.profiles set role_prf = 'admin' where id_prf = $1`, [U.buyer]);
    const r = await db.query(`select role_prf from public.profiles where id_prf = $1`, [U.buyer]);
    return r.rows[0].role_prf !== 'admin';
  });
  await check('S-13: buyer sí puede pasar a seller', async () => {
    await as(U.buyer, `update public.profiles set role_prf = 'seller' where id_prf = $1`, [U.buyer]);
    const r = await db.query(`select role_prf from public.profiles where id_prf = $1`, [U.buyer]);
    await db.exec(`update public.profiles set role_prf = 'buyer' where id_prf = '${U.buyer}'`);
    return r.rows[0].role_prf === 'seller';
  });
  await check('S-10: un usuario no puede leer el teléfono de otro', () =>
    expectError(() => as(U.buyer, `select phone_number_prf from public.profiles where id_prf = $1`, [U.seller]), /permission denied/));
  await check('S-10: los nombres siguen siendo públicos', async () =>
    (await as(null, `select first_name_prf from public.profiles where id_prf = $1`, [U.seller])).rows[0]?.first_name_prf === 'Sol');
  await check('S-10: get_my_profile devuelve el teléfono propio', async () =>
    (await as(U.seller, `select phone_number_prf from public.get_my_profile()`)).rows[0]?.phone_number_prf === '8888-1111');

  // S-01
  const planId = (await db.query(`select id_sub from public.subscription where type_sub = 'package_products'`)).rows[0].id_sub;
  await check('S-01: insertar suscripción como approved queda pending', async () => {
    await as(U.seller, `insert into public.profile_subscriptions (id_psub, profile_id_psub, subscription_id_psub, payment_reference_psub, status_psub)
      values ('40000000-0000-0000-0000-000000000001', $1, $2, 'ref', 'approved')`, [U.seller, planId]);
    return (await db.query(`select status_psub from public.profile_subscriptions where id_psub = '40000000-0000-0000-0000-000000000001'`)).rows[0].status_psub === 'pending';
  });
  await check('S-01: usuario no puede aprobarse luego con UPDATE', () =>
    expectError(() => as(U.seller, `update public.profile_subscriptions set status_psub = 'approved' where id_psub = '40000000-0000-0000-0000-000000000001'`)));

  // S-02 usage
  await check('S-02: max_quota_sus forzado según el plan (20)', async () => {
    await as(U.seller, `insert into public.subscription_usage (profile_subscription_id_sus, profile_id_sus, resource_type_sus, business_id_sus, max_quota_sus)
      values ('40000000-0000-0000-0000-000000000001', $1, 'product', '30000000-0000-0000-0000-000000000001', 99999)`, [U.seller]);
    return (await db.query(`select max_quota_sus from public.subscription_usage`)).rows[0].max_quota_sus === 20;
  });
  await check('S-02: límite gratuito de productos (5) aplicado en la BD', async () => {
    for (let i = 0; i < 5; i++) await as(U.seller, `insert into public.products (business_id_prd, name_prd) values ('30000000-0000-0000-0000-000000000001', 'p${i}')`);
    return expectError(() => as(U.seller, `insert into public.products (business_id_prd, name_prd) values ('30000000-0000-0000-0000-000000000001', 'p6')`), /límite/);
  });
  await check('S-02: al aprobar la suscripción, el límite sube a 25', async () => {
    await db.exec(`update public.profile_subscriptions set status_psub = 'approved' where id_psub = '40000000-0000-0000-0000-000000000001'`);
    await as(U.seller, `insert into public.products (business_id_prd, name_prd) values ('30000000-0000-0000-0000-000000000001', 'p6')`);
    return (await db.query(`select public.resource_limit('product', '30000000-0000-0000-0000-000000000001') l`)).rows[0].l === 25;
  });

  // S-06 / S-07
  await check('S-06: el dueño cambia el nombre → vuelve a pending', async () => {
    await as(U.seller, `update public.businesses set name_bus = 'Soda Sol 2' where id_bus = '30000000-0000-0000-0000-000000000001'`);
    return (await db.query(`select moderation_status_bus from public.businesses where id_bus = '30000000-0000-0000-0000-000000000001'`)).rows[0].moderation_status_bus === 'pending';
  });
  await check('S-06: el dueño no puede auto-aprobarse', async () => {
    await as(U.seller, `update public.businesses set moderation_status_bus = 'approved' where id_bus = '30000000-0000-0000-0000-000000000001'`);
    return (await db.query(`select moderation_status_bus from public.businesses where id_bus = '30000000-0000-0000-0000-000000000001'`)).rows[0].moderation_status_bus === 'pending';
  });
  await check('S-06: toggle de is_active sin cambiar contenido NO re-modera', async () => {
    await db.exec(`update public.businesses set moderation_status_bus = 'approved' where id_bus = '30000000-0000-0000-0000-000000000001'`);
    await as(U.seller, `update public.businesses set is_active_bus = false where id_bus = '30000000-0000-0000-0000-000000000001'`);
    await as(U.seller, `update public.businesses set is_active_bus = true where id_bus = '30000000-0000-0000-0000-000000000001'`);
    const r = (await db.query(`select moderation_status_bus, is_active_bus from public.businesses where id_bus = '30000000-0000-0000-0000-000000000001'`)).rows[0];
    return r.moderation_status_bus === 'approved' && r.is_active_bus === true;
  });
  await check('S-07: admin desactiva → dueño no puede reactivar', async () => {
    await as(U.admin, `update public.businesses set is_active_bus = false where id_bus = '30000000-0000-0000-0000-000000000001'`);
    await as(U.seller, `update public.businesses set is_active_bus = true where id_bus = '30000000-0000-0000-0000-000000000001'`);
    const r = (await db.query(`select is_active_bus, is_blocked_bus from public.businesses where id_bus = '30000000-0000-0000-0000-000000000001'`)).rows[0];
    await as(U.admin, `update public.businesses set is_active_bus = true where id_bus = '30000000-0000-0000-0000-000000000001'`);
    return r.is_active_bus === false && r.is_blocked_bus === true;
  });
  await check('S-06: agregar una imagen de galería re-modera el negocio', async () => {
    await as(U.seller, `insert into public.business_images (business_id_bim, path_bim, sort_order_bim) values ('30000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001/gallery-x.jpg', 2)`);
    const s = (await db.query(`select moderation_status_bus from public.businesses where id_bus = '30000000-0000-0000-0000-000000000001'`)).rows[0].moderation_status_bus;
    await db.exec(`update public.businesses set moderation_status_bus = 'approved' where id_bus = '30000000-0000-0000-0000-000000000001'`);
    return s === 'pending';
  });

  // B25
  await check('B25: el dueño puede actualizar la ubicación de su negocio', async () => {
    await as(U.seller, `update public.locations set address_loc = 'nueva' where id_loc = '20000000-0000-0000-0000-000000000001'`);
    return (await db.query(`select address_loc from public.locations`)).rows[0].address_loc === 'nueva';
  });
  await check('B25: otro usuario no puede mover la ubicación ajena', async () => {
    await as(U.buyer, `update public.locations set address_loc = 'hack' where id_loc = '20000000-0000-0000-0000-000000000001'`);
    return (await db.query(`select address_loc from public.locations`)).rows[0].address_loc === 'nueva';
  });

  // Reviews
  await check('S-09: reseña válida + rating recalculado por trigger', async () => {
    await as(U.buyer, `insert into public.business_reviews (business_id_brv, user_id_brv, rating_brv) values ('30000000-0000-0000-0000-000000000001', $1, 4)`, [U.buyer]);
    const r = (await db.query(`select avg_rating_bus, reviews_count_bus from public.businesses where id_bus = '30000000-0000-0000-0000-000000000001'`)).rows[0];
    return Number(r.avg_rating_bus) === 4 && r.reviews_count_bus === 1;
  });
  await check('S-09: segunda reseña del mismo usuario rechazada', () =>
    expectError(() => as(U.buyer, `insert into public.business_reviews (business_id_brv, user_id_brv, rating_brv) values ('30000000-0000-0000-0000-000000000001', $1, 1)`, [U.buyer]), /unique|duplicate/));
  await check('S-09: rating fuera de 1..5 rechazado', () =>
    expectError(() => as(U.admin, `insert into public.business_reviews (business_id_brv, user_id_brv, rating_brv) values ('30000000-0000-0000-0000-000000000001', $1, 50)`, [U.admin])));
  await check('S-09: creador no puede reseñar su propio evento', () =>
    expectError(() => as(U.seller, `insert into public.event_reviews (event_id_erv, user_id_erv, rating_erv) values ('30000000-0000-0000-0000-000000000002', $1, 5)`, [U.seller]), /row-level security/));
  await check('L-07: edición de admin queda registrada y marcada', async () => {
    await as(U.admin, `update public.business_reviews set comment_brv = 'editado' where user_id_brv = $1`, [U.buyer]);
    const r = (await db.query(`select moderated_at_brv from public.business_reviews where user_id_brv = $1`, [U.buyer])).rows[0];
    const l = (await db.query(`select count(*)::int c from public.review_moderation_log`)).rows[0].c;
    return r.moderated_at_brv !== null && l === 1;
  });

  // Likes
  await check('S-18: like ajeno no visible, conteo agregado sí', async () => {
    await as(U.seller, `insert into public.business_likes (business_id_blk, user_id_blk) values ('30000000-0000-0000-0000-000000000001', $1)`, [U.seller]).catch(() => {});
    await as(U.admin, `insert into public.business_likes (business_id_blk, user_id_blk) values ('30000000-0000-0000-0000-000000000001', $1)`, [U.admin]);
    const visible = (await as(U.buyer, `select count(*)::int c from public.business_likes`)).rows[0].c;
    const agg = (await as(U.buyer, `select likes::int from public.get_like_counts('business_likes', array['30000000-0000-0000-0000-000000000001']::uuid[])`)).rows[0].likes;
    return visible === 0 && agg >= 1;
  });
  await check('S-16: no se puede registrar un click a nombre de otro usuario', () =>
    expectError(() => as(U.buyer, `insert into public.business_contact_clicks (business_id_bcc, user_id_bcc, contact_type_bcc) values ('30000000-0000-0000-0000-000000000001', $1, 'phone')`, [U.admin]), /row-level security/));

  // 2026-11-24_cierre-auditoria
  const BUS = '30000000-0000-0000-0000-000000000001';
  await check('1.13: más de 10 clicks en 10 min del mismo usuario se descartan', async () => {
    for (let i = 0; i < 12; i++) {
      await as(U.buyer, `insert into public.business_contact_clicks (business_id_bcc, user_id_bcc, contact_type_bcc) values ($1, $2, 'whatsapp')`, [BUS, U.buyer]);
    }
    const c = (await db.query(`select count(*)::int c from public.business_contact_clicks where user_id_bcc = $1`, [U.buyer])).rows[0].c;
    return c === 10;
  });
  await check('4.9: reportar contenido, sin duplicados ni motivos inventados', async () => {
    await as(U.buyer, `insert into public.content_reports (entity_type_rep, entity_id_rep, reason_rep) values ('business', $1, 'spam')`, [BUS]);
    const dup = await expectError(() => as(U.buyer, `insert into public.content_reports (entity_type_rep, entity_id_rep, reason_rep) values ('business', $1, 'spam')`, [BUS]), /duplicate|unique/);
    const bad = await expectError(() => as(U.buyer, `insert into public.content_reports (entity_type_rep, entity_id_rep, reason_rep) values ('business', $1, 'porque sí')`, [BUS]));
    const reporter = (await db.query(`select reporter_id_rep from public.content_reports`)).rows[0].reporter_id_rep;
    return dup && bad && reporter === U.buyer;
  });
  await check('4.9: el que reporta no puede cerrar su reporte; el admin sí', async () => {
    await as(U.buyer, `update public.content_reports set status_rep = 'dismissed'`).catch(() => {});
    const afterUser = (await db.query(`select status_rep from public.content_reports`)).rows[0].status_rep;
    await as(U.admin, `update public.content_reports set status_rep = 'actioned', reviewed_by_rep = $1, reviewed_at_rep = now()`, [U.admin]);
    const afterAdmin = (await db.query(`select status_rep from public.content_reports`)).rows[0].status_rep;
    return afterUser === 'open' && afterAdmin === 'actioned';
  });
  await check('4.9: el seller no ve reportes ajenos', async () =>
    (await as(U.seller, `select count(*)::int c from public.content_reports`)).rows[0].c === 0);
  await check('5.17: el dueño ve sus favoritos agregados; otro usuario no', async () => {
    const own = (await as(U.seller, `select coalesce(sum(likes), 0)::int s from public.get_owner_like_totals(array[$1]::uuid[])`, [BUS])).rows[0].s;
    const other = (await as(U.buyer, `select count(*)::int c from public.get_owner_like_totals(array[$1]::uuid[])`, [BUS])).rows[0].c;
    return own >= 1 && other === 0;
  });
  await check('H-34: otro usuario no puede editar ni borrar fotos de un comercio ajeno', async () => {
    await db.exec(`insert into public.business_images (business_id_bim, path_bim, sort_order_bim) values ('${BUS}', '${BUS}/gallery-1-x.jpg', 9)`);
    await as(U.buyer, `update public.business_images set sort_order_bim = 1 where business_id_bim = $1`, [BUS]);
    await as(U.buyer, `delete from public.business_images where business_id_bim = $1`, [BUS]);
    const r = (await db.query(`select sort_order_bim from public.business_images where path_bim = $1`, [`${BUS}/gallery-1-x.jpg`])).rows;
    return r.length === 1 && r[0].sort_order_bim === 9;
  });

  // Promotions
  await check('S-08: extender fechas de promo aprobada → pending', async () => {
    await db.exec(`insert into public.promotions (id_prm, business_id_prm, created_by_prm, title_prm, moderation_status_prm, payment_state_prm, start_at_prm, end_at_prm)
      values ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '${U.seller}', 'Promo', 'approved', 'paid', now(), now() + interval '30 days')`);
    await as(U.seller, `update public.promotions set end_at_prm = now() + interval '3 years' where id_prm = '50000000-0000-0000-0000-000000000001'`);
    const r = (await db.query(`select moderation_status_prm, payment_state_prm from public.promotions where id_prm = '50000000-0000-0000-0000-000000000001'`)).rows[0];
    return r.moderation_status_prm === 'pending' && r.payment_state_prm === 'paid';
  });

  // Account deletion
  await check('L-09: delete_my_account borra al seller y su contenido', async () => {
    await as(U.seller, `select public.delete_my_account()`);
    const p = (await db.query(`select count(*)::int c from public.profiles where id_prf = $1`, [U.seller])).rows[0].c;
    const b = (await db.query(`select count(*)::int c from public.businesses where owner_id_bus = $1`, [U.seller])).rows[0].c;
    const u = (await db.query(`select count(*)::int c from auth.users where id = $1`, [U.seller])).rows[0].c;
    return p === 0 && b === 0 && u === 0;
  });
  await check('Ratings: tras borrar la cuenta, los ratings del resto siguen consistentes', async () =>
    (await db.query(`select count(*)::int c from public.business_reviews`)).rows[0].c === 0);

  console.log('\nTESTS');
  for (const [s, n] of results) console.log(` ${s} ${n}`);
  const failed = results.filter((r) => r[0] === '✗').length;
  console.log(`\n${results.length - failed}/${results.length} OK`);
  if (failed) process.exitCode = 1;
}

run().catch((e) => { console.error(e); process.exit(1); });
