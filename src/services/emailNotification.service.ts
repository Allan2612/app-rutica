import { supabase } from '@/lib/supabase';

export interface PaymentEmailData {
  userEmail: string;
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

const EDGE_FUNCTION_URL = 'https://irmibyxlwkbsuauqnbiw.supabase.co/functions/v1/email-paid';
const EDGE_FUNCTION_STATUS_URL =
  'https://irmibyxlwkbsuauqnbiw.supabase.co/functions/v1/email-subscription-status';

// Cambiar a false cuando Gmail SMTP esté configurado
const EMAIL_DISABLED = false;

/**
 * Envía un correo de notificación cuando un usuario realiza un pago.
 * Usa Gmail SMTP a través de Edge Function.
 * Ver docs/email-templates/README.md para instrucciones de configuración.
 */
export async function sendPaymentReceivedEmail(data: PaymentEmailData): Promise<void> {
  try {
    if (EMAIL_DISABLED) {
      console.log(
        '[emailNotification] Email notifications disabled. Payment registered for:',
        data.userEmail,
      );
      return;
    }

    const date = new Date().toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    console.log('[emailNotification] Sending email to:', data.userEmail);

    // Obtener el token de sesión actual
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        to: data.userEmail,
        userName: data.userName,
        packageName: data.packageName,
        amount: data.amount,
        paymentReference: data.paymentReference,
        date,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[emailNotification] Error response:', response.status, errorText);
    } else {
      const responseData = await response.json();
      console.log('[emailNotification] Email sent successfully:', responseData);
    }
  } catch (err: any) {
    // No lanzar error para no interrumpir el flujo principal
    console.error('[emailNotification] Failed to send payment email:', err);
  }
}

/**
 * Envía un correo de notificación cuando una suscripción es aprobada o rechazada.
 * Usa Gmail SMTP a través de Edge Function.
 */
export async function sendSubscriptionStatusEmail(
  data: SubscriptionStatusEmailData,
): Promise<void> {
  try {
    if (EMAIL_DISABLED) {
      console.log(
        '[emailNotification] Email notifications disabled. Status update for profileId:',
        data.profileId,
      );
      return;
    }

    const date = new Date().toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    console.log(
      '[emailNotification] Sending subscription status email for profileId:',
      data.profileId,
      'status:',
      data.status,
    );

    // Obtener el token de sesión actual
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;

    const response = await fetch(EDGE_FUNCTION_STATUS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        profileId: data.profileId,
        userName: data.userName,
        packageName: data.packageName,
        status: data.status,
        rejectionReason: data.rejectionReason || '',
        date,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[emailNotification] Error response:', response.status, errorText);
    } else {
      const responseData = await response.json();
      console.log('[emailNotification] Subscription status email sent successfully:', responseData);
    }
  } catch (err: any) {
    // No lanzar error para no interrumpir el flujo principal
    console.error('[emailNotification] Failed to send subscription status email:', err);
  }
}
