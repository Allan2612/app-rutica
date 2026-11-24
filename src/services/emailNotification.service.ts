import { supabase } from '@/lib/supabase';

export interface PaymentEmailData {
  /** Solo informativo: la Edge Function siempre le escribe al usuario de la sesión (S-12). */
  userEmail?: string;
  userName: string;
  packageName: string;
  amount: string;
  paymentReference: string;
}

export interface SubscriptionStatusEmailData {
  profileId: string;
  userName: string;
  packageName: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

/**
 * Correo de "pago recibido" al usuario de la sesión.
 * La Edge Function `email-paid` (supabase/functions) exige sesión y toma el destinatario del JWT.
 * No lanza: un fallo de correo no debe cortar el flujo de pago.
 */
export async function sendPaymentReceivedEmail(data: PaymentEmailData): Promise<void> {
  const date = new Date().toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const { error } = await supabase.functions.invoke('email-paid', {
    body: {
      userName: data.userName,
      packageName: data.packageName,
      amount: data.amount,
      paymentReference: data.paymentReference,
      date,
    },
  });
  if (error) console.error('[emailNotification] email-paid falló:', error.message);
}

/**
 * Correo de suscripción aprobada o rechazada. Solo funciona con la sesión de un admin
 * (la Edge Function `email-subscription-status` lo verifica). No lanza.
 */
export async function sendSubscriptionStatusEmail(data: SubscriptionStatusEmailData): Promise<void> {
  const date = new Date().toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const { error } = await supabase.functions.invoke('email-subscription-status', {
    body: {
      profileId: data.profileId,
      userName: data.userName,
      packageName: data.packageName,
      status: data.status,
      rejectionReason: data.rejectionReason || '',
      date,
    },
  });
  if (error) console.error('[emailNotification] email-subscription-status falló:', error.message);
}
