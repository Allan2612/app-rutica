-- ============================================
-- Migración: Agregar soporte para promociones de tipo 'category' y 'combo'
-- Fecha: 2026-01-26
-- ============================================

-- ============================================
-- 1. Tabla para categorías de scope de promoción (scope: 'category')
-- Esta tabla almacena las categorías de productos a las que aplica una promoción
-- ============================================
CREATE TABLE IF NOT EXISTS promotion_scope_categories (
    promotion_id_psc UUID NOT NULL REFERENCES promotions(id_prm) ON DELETE CASCADE,
    category_id_psc UUID NOT NULL REFERENCES categories(id_cat) ON DELETE CASCADE,
    created_at_psc TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (promotion_id_psc, category_id_psc)
);

-- Índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_promotion_scope_categories_promotion 
    ON promotion_scope_categories(promotion_id_psc);
CREATE INDEX IF NOT EXISTS idx_promotion_scope_categories_category 
    ON promotion_scope_categories(category_id_psc);

-- RLS (Row Level Security)
ALTER TABLE promotion_scope_categories ENABLE ROW LEVEL SECURITY;

-- Política: Lectura pública
CREATE POLICY "promotion_scope_categories_select_public" 
    ON promotion_scope_categories FOR SELECT 
    USING (true);

-- Política: Inserción por dueño de la promoción
CREATE POLICY "promotion_scope_categories_insert_owner" 
    ON promotion_scope_categories FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM promotions 
            WHERE id_prm = promotion_id_psc 
            AND created_by_prm = auth.uid()
        )
    );

-- Política: Eliminación por dueño de la promoción
CREATE POLICY "promotion_scope_categories_delete_owner" 
    ON promotion_scope_categories FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM promotions 
            WHERE id_prm = promotion_id_psc 
            AND created_by_prm = auth.uid()
        )
    );

-- ============================================
-- 2. Tabla para items de combo (scope: 'combo')
-- Esta tabla almacena los productos y cantidades que componen un combo
-- ============================================
CREATE TABLE IF NOT EXISTS promotion_combo_items (
    id_pci UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id_pci UUID NOT NULL REFERENCES promotions(id_prm) ON DELETE CASCADE,
    product_id_pci UUID NOT NULL REFERENCES products(id_prd) ON DELETE CASCADE,
    quantity_pci INTEGER NOT NULL DEFAULT 1 CHECK (quantity_pci > 0),
    created_at_pci TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (promotion_id_pci, product_id_pci)
);

-- Índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_promotion_combo_items_promotion 
    ON promotion_combo_items(promotion_id_pci);
CREATE INDEX IF NOT EXISTS idx_promotion_combo_items_product 
    ON promotion_combo_items(product_id_pci);

-- RLS (Row Level Security)
ALTER TABLE promotion_combo_items ENABLE ROW LEVEL SECURITY;

-- Política: Lectura pública
CREATE POLICY "promotion_combo_items_select_public" 
    ON promotion_combo_items FOR SELECT 
    USING (true);

-- Política: Inserción por dueño de la promoción
CREATE POLICY "promotion_combo_items_insert_owner" 
    ON promotion_combo_items FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM promotions 
            WHERE id_prm = promotion_id_pci 
            AND created_by_prm = auth.uid()
        )
    );

-- Política: Actualización por dueño de la promoción
CREATE POLICY "promotion_combo_items_update_owner" 
    ON promotion_combo_items FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM promotions 
            WHERE id_prm = promotion_id_pci 
            AND created_by_prm = auth.uid()
        )
    );

-- Política: Eliminación por dueño de la promoción
CREATE POLICY "promotion_combo_items_delete_owner" 
    ON promotion_combo_items FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM promotions 
            WHERE id_prm = promotion_id_pci 
            AND created_by_prm = auth.uid()
        )
    );

-- ============================================
-- 3. Comentarios para documentación
-- ============================================
COMMENT ON TABLE promotion_scope_categories IS 'Categorías de productos a las que aplica una promoción (para scope=category)';
COMMENT ON COLUMN promotion_scope_categories.promotion_id_psc IS 'ID de la promoción';
COMMENT ON COLUMN promotion_scope_categories.category_id_psc IS 'ID de la categoría de productos';

COMMENT ON TABLE promotion_combo_items IS 'Productos y cantidades que componen un combo de promoción (para scope=combo)';
COMMENT ON COLUMN promotion_combo_items.id_pci IS 'ID único del item del combo';
COMMENT ON COLUMN promotion_combo_items.promotion_id_pci IS 'ID de la promoción';
COMMENT ON COLUMN promotion_combo_items.product_id_pci IS 'ID del producto';
COMMENT ON COLUMN promotion_combo_items.quantity_pci IS 'Cantidad requerida del producto en el combo';
