// Subscription approved/rejected email. Only admins can call it (S-12); the recipient is looked
// up from the profile id with the service role, never taken from the request body.
import { escapeHtml, getCaller, isAdmin, json, sendMail, serviceClient } from '../_shared/email.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return json(req, 204, null);
  if (req.method !== 'POST') return json(req, 405, { error: 'Method not allowed' });

  try {
    const caller = await getCaller(req);
    if (!caller) return json(req, 401, { error: 'Not signed in' });
    if (!(await isAdmin(caller.id))) return json(req, 403, { error: 'Admins only' });

    const body = await req.json().catch(() => ({}));
    const { profileId, userName, packageName, status, rejectionReason, date } = body ?? {};
    if (!profileId || (status !== 'approved' && status !== 'rejected')) {
      return json(req, 400, { error: 'Missing or invalid fields: profileId, status' });
    }

    const { data: userData, error: userError } = await serviceClient().auth.admin.getUserById(profileId);
    if (userError || !userData?.user?.email) return json(req, 404, { error: 'User not found' });

    const approved = status === 'approved';
    const name = escapeHtml(userName || 'Usuario', 80);
    const pkg = escapeHtml(packageName || 'Paquete Premium', 80);
    const when = escapeHtml(date || new Date().toLocaleDateString('es-CR'), 60);
    const reason = escapeHtml(rejectionReason, 500);
    const color = approved ? '#16a34a' : '#dc2626';
    const title = approved ? 'Pago verificado' : 'Actualización de tu suscripción';
    const message = approved
      ? `Tu pago para el paquete <strong>${pkg}</strong> fue verificado. Ya podés usar los beneficios premium.`
      : `Tu pago para el paquete <strong>${pkg}</strong> no pudo ser verificado. No vas a tener las funciones premium hasta registrar un pago válido.`;

    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8" /><title>${title}</title></head>
<body style="margin:0;padding:24px;font-family:Arial,sans-serif;background:#f5f5f5;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;padding:32px;">
    <h1 style="margin:0 0 16px;font-size:24px;color:${color};">${title}</h1>
    <p style="font-size:16px;color:#333;">Hola <strong>${name}</strong>,</p>
    <p style="font-size:16px;color:#333;">${message}</p>
    ${!approved && reason ? `<div style="background:#fff3f3;padding:15px;border-radius:8px;margin:20px 0;"><strong>Motivo:</strong> ${reason}</div>` : ''}
    <p style="font-size:14px;color:#666;">Paquete: <strong>${pkg}</strong> · Fecha: ${when}</p>
    <p style="font-size:12px;color:#999;text-align:center;margin-top:32px;">Rutica</p>
  </div>
</body></html>`;
    const text = approved
      ? `Hola ${userName || ''}, tu pago para el paquete ${packageName || ''} fue verificado.`
      : `Hola ${userName || ''}, tu pago para el paquete ${packageName || ''} no pudo ser verificado.${rejectionReason ? ' Motivo: ' + rejectionReason : ''}`;

    await sendMail(
      userData.user.email,
      approved ? 'Tu suscripción fue aprobada - Rutica' : 'Actualización de tu suscripción - Rutica',
      html,
      text,
    );
    return json(req, 200, { success: true });
  } catch (error) {
    console.error('email-subscription-status:', error);
    return json(req, 500, { error: 'No se pudo enviar el correo' });
  }
});
