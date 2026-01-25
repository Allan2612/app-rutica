-- ============================================
-- Storage Bucket: promotions-images
-- Políticas de seguridad para Supabase Storage
-- ============================================

-- ============================================
-- PASO 1: Crear el bucket (ejecutar en SQL Editor de Supabase)
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('promotions-images', 'promotions-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PASO 2: Políticas de Storage (ejecutar en SQL Editor)
-- ============================================

-- 2.1 Lectura pública de todas las imágenes
CREATE POLICY "Public read promotions images"
ON storage.objects FOR SELECT
USING (bucket_id = 'promotions-images');

-- 2.2 Usuarios autenticados pueden subir imágenes
CREATE POLICY "Authenticated users can upload promotions images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'promotions-images'
    AND auth.role() = 'authenticated'
);

-- 2.3 Usuarios autenticados pueden actualizar imágenes
CREATE POLICY "Authenticated users can update promotions images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'promotions-images'
    AND auth.role() = 'authenticated'
);

-- 2.4 Usuarios autenticados pueden eliminar imágenes
CREATE POLICY "Authenticated users can delete promotions images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'promotions-images'
    AND auth.role() = 'authenticated'
);

-- ============================================
-- PASO 3: RLS para tabla promotions
-- ============================================

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Lectura pública de promociones aprobadas
CREATE POLICY "Public can read approved promotions"
ON public.promotions FOR SELECT
USING (moderation_status_prm = 'approved');

-- Creadores pueden ver sus propias promociones (cualquier estado)
CREATE POLICY "Creators can read own promotions"
ON public.promotions FOR SELECT
USING (auth.uid() = created_by_prm);

-- Usuarios autenticados pueden crear promociones
CREATE POLICY "Authenticated users can create promotions"
ON public.promotions FOR INSERT
WITH CHECK (auth.uid() = created_by_prm);

-- Creadores pueden actualizar sus promociones
CREATE POLICY "Creators can update own promotions"
ON public.promotions FOR UPDATE
USING (auth.uid() = created_by_prm);

-- Creadores pueden eliminar sus promociones
CREATE POLICY "Creators can delete own promotions"
ON public.promotions FOR DELETE
USING (auth.uid() = created_by_prm);

-- ============================================
-- PASO 4: RLS para tabla promotion_images
-- ============================================

ALTER TABLE public.promotion_images ENABLE ROW LEVEL SECURITY;

-- Lectura pública de imágenes
CREATE POLICY "Public can read promotion images"
ON public.promotion_images FOR SELECT
USING (true);

-- Solo creadores de la promoción pueden insertar imágenes
CREATE POLICY "Promotion creators can insert images"
ON public.promotion_images FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.promotions
        WHERE id_prm = promotion_id_pim
        AND created_by_prm = auth.uid()
    )
);

-- Solo creadores pueden actualizar imágenes
CREATE POLICY "Promotion creators can update images"
ON public.promotion_images FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.promotions
        WHERE id_prm = promotion_id_pim
        AND created_by_prm = auth.uid()
    )
);

-- Solo creadores pueden eliminar imágenes
CREATE POLICY "Promotion creators can delete images"
ON public.promotion_images FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.promotions
        WHERE id_prm = promotion_id_pim
        AND created_by_prm = auth.uid()
    )
);

-- ============================================
-- PASO 5: RLS para tabla promotion_category_map
-- ============================================

ALTER TABLE public.promotion_category_map ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "Public can read promotion categories"
ON public.promotion_category_map FOR SELECT
USING (true);

-- Solo creadores pueden gestionar categorías
CREATE POLICY "Promotion creators can manage categories"
ON public.promotion_category_map FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.promotions
        WHERE id_prm = promotion_id_pcr
        AND created_by_prm = auth.uid()
    )
);

-- ============================================
-- PASO 6: RLS para tabla promotion_products
-- ============================================

ALTER TABLE public.promotion_products ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "Public can read promotion products"
ON public.promotion_products FOR SELECT
USING (true);

-- Solo creadores pueden gestionar productos
CREATE POLICY "Promotion creators can manage products"
ON public.promotion_products FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.promotions
        WHERE id_prm = promotion_id_ppr
        AND created_by_prm = auth.uid()
    )
);

