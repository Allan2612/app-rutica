-- SQL para eliminar todos los registros de eventos y sus datos relacionados
-- ADVERTENCIA: Este script eliminará PERMANENTEMENTE todos los eventos de prueba
-- Ejecutar con precaución

-- 1. Eliminar imágenes de eventos
DELETE FROM public.event_images;

-- 2. Eliminar relaciones de categorías con eventos
DELETE FROM public.event_category_map;

-- 3. Eliminar reviews de eventos
DELETE FROM public.event_reviews;

-- 4. Eliminar eventos
DELETE FROM public.events;

-- 5. Opcional: Eliminar ubicaciones huérfanas (que no están asociadas a nada más)
-- Nota: Solo ejecutar si estás seguro de que no hay otras entidades usando estas ubicaciones
DELETE FROM public.locations 
WHERE id_loc NOT IN (
    SELECT DISTINCT location_id_bus FROM public.businesses WHERE location_id_bus IS NOT NULL
    UNION
    SELECT DISTINCT location_id_atr FROM public.attractions WHERE location_id_atr IS NOT NULL
);

-- Verificar que todo fue eliminado
SELECT 'events' as tabla, COUNT(*) as registros FROM public.events
UNION ALL
SELECT 'event_images', COUNT(*) FROM public.event_images
UNION ALL
SELECT 'event_category_map', COUNT(*) FROM public.event_category_map
UNION ALL
SELECT 'event_reviews', COUNT(*) FROM public.event_reviews;
