-- =========================================================
-- MASSIVE CATEGORIES SEED (SAFE)
-- - Respects existing IDs by NOT updating anything
-- - Inserts new rows ONLY if name_cat doesn't exist
-- - Max depth: 3
-- =========================================================

-- =========================================================
-- 1) SALUD Y MEDICINA (expand)
-- =========================================================

-- Nivel 2 (hijos directos de Salud y Medicina)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Nutrición', '11111111-1111-1111-1111-111111111111', 60, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Nutrición');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Fisioterapia', '11111111-1111-1111-1111-111111111111', 70, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Fisioterapia');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Psicología', '11111111-1111-1111-1111-111111111111', 80, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Psicología');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Psiquiatría', '11111111-1111-1111-1111-111111111111', 90, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Psiquiatría');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Ginecología', '11111111-1111-1111-1111-111111111111', 100, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Ginecología');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Oftalmología', '11111111-1111-1111-1111-111111111111', 110, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Oftalmología');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Otorrinolaringología', '11111111-1111-1111-1111-111111111111', 120, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Otorrinolaringología');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Medicina Estética', '11111111-1111-1111-1111-111111111111', 130, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Medicina Estética');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Clínicas', '11111111-1111-1111-1111-111111111111', 140, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Clínicas');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Hospitales', '11111111-1111-1111-1111-111111111111', 150, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Hospitales');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Emergencias Médicas', '11111111-1111-1111-1111-111111111111', 160, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Emergencias Médicas');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Radiología e Imagenología', '11111111-1111-1111-1111-111111111111', 170, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Radiología e Imagenología');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Terapias Alternativas', '11111111-1111-1111-1111-111111111111', 180, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Terapias Alternativas');

-- Nivel 3 (subespecialidades de Medicina General: parent = Medicina General)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Medicina Interna', '11111111-1111-1111-1111-111111111113', 50, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Medicina Interna');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Neurología', '11111111-1111-1111-1111-111111111113', 60, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Neurología');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Gastroenterología', '11111111-1111-1111-1111-111111111113', 70, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Gastroenterología');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Neumología', '11111111-1111-1111-1111-111111111113', 80, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Neumología');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Endocrinología', '11111111-1111-1111-1111-111111111113', 90, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Endocrinología');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Reumatología', '11111111-1111-1111-1111-111111111113', 100, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Reumatología');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Oncología', '11111111-1111-1111-1111-111111111113', 110, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Oncología');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Urología', '11111111-1111-1111-1111-111111111113', 120, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Urología');

-- Nivel 3 (subcategorías de Odontología)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Ortodoncia', '11111111-1111-1111-1111-111111111114', 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Ortodoncia');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Endodoncia', '11111111-1111-1111-1111-111111111114', 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Endodoncia');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Periodoncia', '11111111-1111-1111-1111-111111111114', 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Periodoncia');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Odontopediatría', '11111111-1111-1111-1111-111111111114', 40, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Odontopediatría');

-- Nivel 3 (subcategorías de Terapias Alternativas)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Acupuntura', (SELECT id_cat FROM public.categories WHERE name_cat='Terapias Alternativas'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Acupuntura');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Quiropráctica', (SELECT id_cat FROM public.categories WHERE name_cat='Terapias Alternativas'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Quiropráctica');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Masajes Terapéuticos', (SELECT id_cat FROM public.categories WHERE name_cat='Terapias Alternativas'), 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Masajes Terapéuticos');

-- =========================================================
-- 2) ALIMENTACIÓN (expand)
-- =========================================================

-- Nivel 2
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Heladerías', '22222222-2222-2222-2222-222222222222', 60, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Heladerías');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Repostería', '22222222-2222-2222-2222-222222222222', 70, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Repostería');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Comida Saludable', '22222222-2222-2222-2222-222222222222', 80, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Comida Saludable');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Food Trucks', '22222222-2222-2222-2222-222222222222', 90, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Food Trucks');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Catering y Banquetes', '22222222-2222-2222-2222-222222222222', 100, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Catering y Banquetes');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Bares de Jugos y Batidos', '22222222-2222-2222-2222-222222222222', 110, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Bares de Jugos y Batidos');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Tiendas de Conveniencia', '22222222-2222-2222-2222-222222222222', 120, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Tiendas de Conveniencia');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Mercados y Ferias', '22222222-2222-2222-2222-222222222222', 130, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Mercados y Ferias');

-- Nivel 3 (especialidades de Restaurantes - parent = Restaurantes)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Comida Peruana', '22222222-2222-2222-2222-222222222223', 50, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Comida Peruana');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Comida Española', '22222222-2222-2222-2222-222222222223', 60, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Comida Española');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Comida Argentina', '22222222-2222-2222-2222-222222222223', 70, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Comida Argentina');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Comida Mediterránea', '22222222-2222-2222-2222-222222222223', 80, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Comida Mediterránea');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Mariscos', '22222222-2222-2222-2222-222222222223', 90, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Mariscos');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Parrilladas', '22222222-2222-2222-2222-222222222223', 100, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Parrilladas');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Comida Vegetariana', '22222222-2222-2222-2222-222222222223', 110, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Comida Vegetariana');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Comida Vegana', '22222222-2222-2222-2222-222222222223', 120, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Comida Vegana');

-- =========================================================
-- 3) ENTRETENIMIENTO (expand)
-- =========================================================

-- Nivel 2 (hijos de Entretenimiento)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Conciertos', '58da6f12-7e34-498c-b0ad-3be1f48681f4', 60, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Conciertos');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Festivales', '58da6f12-7e34-498c-b0ad-3be1f48681f4', 70, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Festivales');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Parques de Diversiones', '58da6f12-7e34-498c-b0ad-3be1f48681f4', 80, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Parques de Diversiones');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Salas de Juegos', '58da6f12-7e34-498c-b0ad-3be1f48681f4', 90, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Salas de Juegos');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Karaoke', '58da6f12-7e34-498c-b0ad-3be1f48681f4', 100, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Karaoke');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Eventos Sociales', '58da6f12-7e34-498c-b0ad-3be1f48681f4', 110, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Eventos Sociales');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Ferias y Exposiciones', '58da6f12-7e34-498c-b0ad-3be1f48681f4', 120, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Ferias y Exposiciones');

-- Nivel 3 (subcategorías de Bares y Discotecas)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Bar Deportivo', '33333333-3333-3333-3333-333333333336', 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Bar Deportivo');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Coctelería', '33333333-3333-3333-3333-333333333336', 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Coctelería');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Discoteca', '33333333-3333-3333-3333-333333333336', 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Discoteca');

-- Nivel 3 (subcategorías de Eventos Sociales)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Bodas', (SELECT id_cat FROM public.categories WHERE name_cat='Eventos Sociales'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Bodas');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Cumpleaños', (SELECT id_cat FROM public.categories WHERE name_cat='Eventos Sociales'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Cumpleaños');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Baby Shower', (SELECT id_cat FROM public.categories WHERE name_cat='Eventos Sociales'), 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Baby Shower');

-- =========================================================
-- 4) SERVICIOS (expand)
-- =========================================================

-- Nivel 2
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Servicios Legales', '44444444-4444-4444-4444-444444444444', 60, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Servicios Legales');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Contabilidad', '44444444-4444-4444-4444-444444444444', 70, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Contabilidad');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Fotografía y Video', '44444444-4444-4444-4444-444444444444', 80, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Fotografía y Video');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Mensajería y Paquetería', '44444444-4444-4444-4444-444444444444', 90, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Mensajería y Paquetería');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Agencias de Viajes', '44444444-4444-4444-4444-444444444444', 100, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Agencias de Viajes');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Reparación de Celulares', '44444444-4444-4444-4444-444444444444', 110, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Reparación de Celulares');

-- Nivel 3 (Peluquerías y Salones)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Coloración', '44444444-4444-4444-4444-444444444445', 40, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Coloración');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Maquillaje Profesional', '44444444-4444-4444-4444-444444444445', 50, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Maquillaje Profesional');

-- Nivel 3 (Talleres Mecánicos)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Mecánica Rápida', '44444444-4444-4444-4444-444444444446', 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Mecánica Rápida');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Enderezado y Pintura', '44444444-4444-4444-4444-444444444446', 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Enderezado y Pintura');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Alineado y Balanceo', '44444444-4444-4444-4444-444444444446', 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Alineado y Balanceo');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Llantera', '44444444-4444-4444-4444-444444444446', 40, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Llantera');

-- =========================================================
-- 5) TURISMO Y NATURALEZA (expand)
-- =========================================================

-- Nivel 2
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Cataratas', '55555555-5555-5555-5555-555555555555', 60, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Cataratas');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Aguas Termales', '55555555-5555-5555-5555-555555555555', 70, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Aguas Termales');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Miradores', '55555555-5555-5555-5555-555555555555', 80, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Miradores');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Reservas Biológicas', '55555555-5555-5555-5555-555555555555', 90, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Reservas Biológicas');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Turismo Rural', '55555555-5555-5555-5555-555555555555', 100, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Turismo Rural');

-- Nivel 3 (Hoteles)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Hoteles Boutique', '55555555-5555-5555-5555-555555555559', 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Hoteles Boutique');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Eco-Lodges', '55555555-5555-5555-5555-555555555559', 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Eco-Lodges');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Hostales', '55555555-5555-5555-5555-555555555559', 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Hostales');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Cabinas', '55555555-5555-5555-5555-555555555559', 40, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Cabinas');

-- Nivel 3 (Tours y Aventuras)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Canyoning', '55555555-5555-5555-5555-555555555560', 50, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Canyoning');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Observación de Aves', '55555555-5555-5555-5555-555555555560', 60, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Observación de Aves');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Pesca Deportiva', '55555555-5555-5555-5555-555555555560', 70, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Pesca Deportiva');

-- =========================================================
-- 6) COMERCIO (expand) + evitar choque con "Ropa" existente
-- =========================================================

-- Nuevas categorías nivel 2 bajo Comercio
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Hogar y Cocina', 'c33a39e2-a9ed-4520-9c1a-b1b81516368d', 60, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Hogar y Cocina');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Mascotas y Suministros', 'c33a39e2-a9ed-4520-9c1a-b1b81516368d', 70, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Mascotas y Suministros');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Belleza y Cuidado Personal (Productos)', 'c33a39e2-a9ed-4520-9c1a-b1b81516368d', 80, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Belleza y Cuidado Personal (Productos)');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Deportes y Outdoor (Productos)', 'c33a39e2-a9ed-4520-9c1a-b1b81516368d', 90, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Deportes y Outdoor (Productos)');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Automotriz (Productos)', 'c33a39e2-a9ed-4520-9c1a-b1b81516368d', 100, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Automotriz (Productos)');

-- Nivel 3 para Electrónica (ya existe como nivel 2)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Computadoras y Laptops', '66666666-6666-6666-6666-666666666668', 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Computadoras y Laptops');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Celulares y Accesorios', '66666666-6666-6666-6666-666666666668', 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Celulares y Accesorios');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Audio y Video', '66666666-6666-6666-6666-666666666668', 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Audio y Video');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Gaming (Productos)', '66666666-6666-6666-6666-666666666668', 40, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Gaming (Productos)');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Hogar Inteligente', '66666666-6666-6666-6666-666666666668', 50, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Hogar Inteligente');

-- Nivel 3 para Ferretería (ya existe como nivel 2)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Herramientas Eléctricas', '66666666-6666-6666-6666-666666666669', 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Herramientas Eléctricas');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Pinturas y Acabados', '66666666-6666-6666-6666-666666666669', 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Pinturas y Acabados');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Plomería (Materiales)', '66666666-6666-6666-6666-666666666669', 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Plomería (Materiales)');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Electricidad (Materiales)', '66666666-6666-6666-6666-666666666669', 40, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Electricidad (Materiales)');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Materiales de Construcción', '66666666-6666-6666-6666-666666666669', 50, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Materiales de Construcción');

-- Nivel 3 para Librerías (ya existe como nivel 2)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Papelería', '66666666-6666-6666-6666-666666666670', 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Papelería');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Libros Académicos', '66666666-6666-6666-6666-666666666670', 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Libros Académicos');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Libros Infantiles', '66666666-6666-6666-6666-666666666670', 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Libros Infantiles');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Artículos de Oficina', '66666666-6666-6666-6666-666666666670', 40, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Artículos de Oficina');

-- =========================================================
-- 7) Nuevas raíces grandes (para “todo en la vida”)
-- =========================================================

-- EDUCACIÓN
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Educación', NULL, 90, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Educación');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Colegios', (SELECT id_cat FROM public.categories WHERE name_cat='Educación'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Colegios');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Universidades', (SELECT id_cat FROM public.categories WHERE name_cat='Educación'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Universidades');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Cursos y Talleres', (SELECT id_cat FROM public.categories WHERE name_cat='Educación'), 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Cursos y Talleres');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Idiomas', (SELECT id_cat FROM public.categories WHERE name_cat='Educación'), 40, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Idiomas');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Programación (Cursos)', (SELECT id_cat FROM public.categories WHERE name_cat='Cursos y Talleres'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Programación (Cursos)');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Música (Cursos)', (SELECT id_cat FROM public.categories WHERE name_cat='Cursos y Talleres'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Música (Cursos)');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Cocina (Cursos)', (SELECT id_cat FROM public.categories WHERE name_cat='Cursos y Talleres'), 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Cocina (Cursos)');

-- HOGAR Y CONSTRUCCIÓN
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Hogar y Construcción', NULL, 100, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Hogar y Construcción');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Mueblerías', (SELECT id_cat FROM public.categories WHERE name_cat='Hogar y Construcción'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Mueblerías');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Decoración del Hogar', (SELECT id_cat FROM public.categories WHERE name_cat='Hogar y Construcción'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Decoración del Hogar');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Electrodomésticos', (SELECT id_cat FROM public.categories WHERE name_cat='Hogar y Construcción'), 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Electrodomésticos');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Servicios del Hogar', (SELECT id_cat FROM public.categories WHERE name_cat='Hogar y Construcción'), 40, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Servicios del Hogar');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Limpieza del Hogar', (SELECT id_cat FROM public.categories WHERE name_cat='Servicios del Hogar'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Limpieza del Hogar');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Fontanería (Servicios)', (SELECT id_cat FROM public.categories WHERE name_cat='Servicios del Hogar'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Fontanería (Servicios)');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Electricista (Servicios)', (SELECT id_cat FROM public.categories WHERE name_cat='Servicios del Hogar'), 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Electricista (Servicios)');

-- TECNOLOGÍA Y TELECOM
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Tecnología y Telecomunicaciones', NULL, 110, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Tecnología y Telecomunicaciones');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Internet y Proveedores', (SELECT id_cat FROM public.categories WHERE name_cat='Tecnología y Telecomunicaciones'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Internet y Proveedores');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Soporte Técnico', (SELECT id_cat FROM public.categories WHERE name_cat='Tecnología y Telecomunicaciones'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Soporte Técnico');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Reparación de Computadoras', (SELECT id_cat FROM public.categories WHERE name_cat='Soporte Técnico'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Reparación de Computadoras');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Instalación de Redes', (SELECT id_cat FROM public.categories WHERE name_cat='Soporte Técnico'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Instalación de Redes');

-- TRANSPORTE
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Transporte y Movilidad', NULL, 120, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Transporte y Movilidad');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Taxis y Transporte Privado', (SELECT id_cat FROM public.categories WHERE name_cat='Transporte y Movilidad'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Taxis y Transporte Privado');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Transporte Público', (SELECT id_cat FROM public.categories WHERE name_cat='Transporte y Movilidad'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Transporte Público');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Rent a Car', (SELECT id_cat FROM public.categories WHERE name_cat='Transporte y Movilidad'), 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Rent a Car');

-- DEPORTES
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Deportes y Fitness', NULL, 130, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Deportes y Fitness');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Gimnasios', (SELECT id_cat FROM public.categories WHERE name_cat='Deportes y Fitness'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Gimnasios');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Yoga y Pilates', (SELECT id_cat FROM public.categories WHERE name_cat='Deportes y Fitness'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Yoga y Pilates');

-- ARTE Y CULTURA
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Arte y Cultura', NULL, 140, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Arte y Cultura');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Galerías de Arte', (SELECT id_cat FROM public.categories WHERE name_cat='Arte y Cultura'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Galerías de Arte');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Centros Culturales', (SELECT id_cat FROM public.categories WHERE name_cat='Arte y Cultura'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Centros Culturales');

-- FINANZAS (para complementar Bancos)
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Finanzas', NULL, 145, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Finanzas');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Cooperativas', (SELECT id_cat FROM public.categories WHERE name_cat='Finanzas'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Cooperativas');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Casas de Cambio', (SELECT id_cat FROM public.categories WHERE name_cat='Finanzas'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Casas de Cambio');

-- GOBIERNO Y TRÁMITES
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Gobierno y Trámites', NULL, 150, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Gobierno y Trámites');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Municipalidades', (SELECT id_cat FROM public.categories WHERE name_cat='Gobierno y Trámites'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Municipalidades');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Trámites y Documentos', (SELECT id_cat FROM public.categories WHERE name_cat='Gobierno y Trámites'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Trámites y Documentos');

-- COMUNIDAD
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Comunidad y Organizaciones', NULL, 160, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Comunidad y Organizaciones');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'ONG y Fundaciones', (SELECT id_cat FROM public.categories WHERE name_cat='Comunidad y Organizaciones'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='ONG y Fundaciones');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Voluntariado', (SELECT id_cat FROM public.categories WHERE name_cat='Comunidad y Organizaciones'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Voluntariado');

-- SEGURIDAD
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Seguridad', NULL, 170, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Seguridad');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Cerrajería', (SELECT id_cat FROM public.categories WHERE name_cat='Seguridad'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Cerrajería');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Cámaras y Alarmas', (SELECT id_cat FROM public.categories WHERE name_cat='Seguridad'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Cámaras y Alarmas');

-- MEDIO AMBIENTE
INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Reciclaje y Medio Ambiente', NULL, 180, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Reciclaje y Medio Ambiente');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Centros de Reciclaje', (SELECT id_cat FROM public.categories WHERE name_cat='Reciclaje y Medio Ambiente'), 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Centros de Reciclaje');

INSERT INTO public.categories (name_cat, parent_id_cat, sort_order_cat, is_active_cat)
SELECT 'Productos Ecológicos', (SELECT id_cat FROM public.categories WHERE name_cat='Reciclaje y Medio Ambiente'), 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name_cat='Productos Ecológicos');
