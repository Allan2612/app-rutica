import { supabase } from '@/lib/supabase/client';

/**
 * Configuración editable por el admin (tabla public.app_settings, ver
 * docs/base-de-datos/migraciones/2026-10-15_auditoria.sql §14).
 */
export interface PaymentSettings {
  sinpeNumber: string | null;
  sinpeName: string | null;
  iban: string | null;
  transferName: string | null;
}

const PAYMENT_KEYS = {
  'payment.sinpe_number': 'sinpeNumber',
  'payment.sinpe_name': 'sinpeName',
  'payment.iban': 'iban',
  'payment.transfer_name': 'transferName',
} as const;

export async function getPaymentSettings(): Promise<PaymentSettings> {
  const settings: PaymentSettings = {
    sinpeNumber: null,
    sinpeName: null,
    iban: null,
    transferName: null,
  };

  const { data, error } = await supabase
    .from('app_settings')
    .select('key_set, value_set')
    .in('key_set', Object.keys(PAYMENT_KEYS));

  // Si la tabla todavía no existe (migración sin aplicar) se trata como "sin configurar"
  if (error) return settings;

  for (const row of (data ?? []) as { key_set: keyof typeof PAYMENT_KEYS; value_set: unknown }[]) {
    const field = PAYMENT_KEYS[row.key_set];
    if (field && typeof row.value_set === 'string' && row.value_set.trim()) {
      settings[field] = row.value_set.trim();
    }
  }
  return settings;
}

/** Hay al menos un medio de pago completo (SINPE o transferencia). */
export function isPaymentConfigured(s: PaymentSettings | undefined): boolean {
  if (!s) return false;
  return Boolean((s.sinpeNumber && s.sinpeName) || (s.iban && s.transferName));
}
