-- ============================================
-- Migración: Agregar paid_quantity a promotion_combo_items
-- ============================================
-- Fecha: 2026-01-26
-- Descripción: Agregar campo para especificar cuántas unidades paga el cliente
--              Esto permite crear promociones como 3x2 (lleva 3, paga 2), 2x1, etc.
-- ============================================

-- Agregar columna paid_quantity_pci
-- Si es NULL, se asume que paga todas las unidades (sin descuento especial de combo)
-- Si tiene valor, indica cuántas unidades paga de las que lleva
ALTER TABLE promotion_combo_items 
ADD COLUMN IF NOT EXISTS paid_quantity_pci INTEGER CHECK (paid_quantity_pci IS NULL OR paid_quantity_pci > 0);

-- Comentarios para documentación
COMMENT ON COLUMN promotion_combo_items.paid_quantity_pci IS 
    'Cantidad de unidades que paga el cliente. Ejemplos: 
     - quantity=2, paid_quantity=1 -> 2x1 (lleva 2, paga 1)
     - quantity=3, paid_quantity=2 -> 3x2 (lleva 3, paga 2)
     - quantity=3, paid_quantity=1 -> 3x1 (lleva 3, paga 1)
     - quantity=2, paid_quantity=NULL -> lleva 2, paga 2 (sin descuento de cantidad)';

-- Validación: paid_quantity debe ser menor o igual a quantity
ALTER TABLE promotion_combo_items   
ADD CONSTRAINT check_paid_quantity_lte_quantity 
CHECK (paid_quantity_pci IS NULL OR paid_quantity_pci <= quantity_pci);
