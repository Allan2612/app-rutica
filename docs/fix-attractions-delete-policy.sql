-- ============================================================
-- FIX: Agregar política DELETE para que owners puedan eliminar sus atracciones
-- ============================================================
-- Fecha: 2026-01-29
-- Descripción: Los usuarios deben poder eliminar sus propias atracciones,
--              no solo los admins.
-- ============================================================

-- Agregar política para que el dueño pueda eliminar su atracción
create policy "attractions_delete_owner"
  on public.attractions for delete
  using (submitted_by_atr = auth.uid());

-- NOTA: La política "attractions_delete_admin" ya existe y permite a admins eliminar cualquier atracción.
-- Esta nueva política se combina con la existente (OR lógico en RLS).

-- ============================================================
-- VERIFICAR: Si ya existen estas políticas, no es necesario ejecutarlas nuevamente
-- ============================================================
-- Verificar que existan las políticas de SELECT para attraction_images (ya deberían existir)
-- Si dan error "policy already exists", ignorar - significa que ya están creadas.

-- SELECT para attraction_images (debe existir)
-- create policy "attraction_images_select_all"
--   on public.attraction_images for select
--   using (true);

-- SELECT para storage bucket attractions-images (debe existir)
-- create policy "attractions_images_select_all"
--   on storage.objects for select
--   using (bucket_id = 'attractions-images');
