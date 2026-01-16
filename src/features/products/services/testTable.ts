import { supabase } from '@/lib/supabase/client';

/**
 * Función temporal para verificar la estructura de la tabla products
 */
export async function testProductsTableStructure() {
    try {
        console.log('[TEST] Checking products table structure...');

        // Intentar obtener un producto para ver la estructura
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .limit(1);

        if (error) {
            console.error('[TEST] Error querying products:', error);
        } else {
            console.log('[TEST] Products table structure:', data);
        }

        // También verificar qué columnas acepta el insert
        const testId = 'test-id-' + Date.now();
        const { error: insertError } = await supabase
            .from('products')
            .insert({
                id_PRD: testId,
                name_PRD: 'Test Product',
                price_PRD: 100,
                currency_PRD: 'CRC',
            })
            .select();

        if (insertError) {
            console.error('[TEST] Insert test error:', insertError);
        } else {
            console.log('[TEST] Insert test success, deleting...');
            await supabase.from('products').delete().eq('id_PRD', testId);
        }
    } catch (error) {
        console.error('[TEST] Test error:', error);
    }
}
