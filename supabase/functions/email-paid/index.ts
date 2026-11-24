// "Payment received" email. Only goes to the signed-in caller's own address (S-12):
// the body cannot choose the recipient, so the function cannot be used to send mail to others.
import { escapeHtml, getCaller, json, sendMail } from '../_shared/email.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return json(req, 204, null);
  if (req.method !== 'POST') return json(req, 405, { error: 'Method not allowed' });

  try {
    const caller = await getCaller(req);
    if (!caller?.email) return json(req, 401, { error: 'Not signed in' });

    const body = await req.json().catch(() => ({}));
    const { userName, packageName, amount, paymentReference, date } = body ?? {};
    if (!packageName || !amount || !paymentReference) {
      return json(req, 400, { error: 'Faltan campos requeridos' });
    }

    const name = escapeHtml(userName || caller.email.split('@')[0], 80);
    const pkg = escapeHtml(packageName, 80);
    const amt = escapeHtml(amount, 40);
    const ref = escapeHtml(paymentReference, 80);
    const when = escapeHtml(date || new Date().toLocaleDateString('es-CR'), 60);

    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8" /><title>Pago recibido</title></head>
<body style="font-family:Arial,sans-serif;background:#f5f7fa;padding:24px;">
  <div style="max-width:520px;margin:auto;background:#fff;border-radius:12px;padding:24px;">
    <h1 style="color:#16a34a;font-size:22px;">Pago recibido</h1>
    <p style="color:#334155;">Hola <strong>${name}</strong>,</p>
    <p style="color:#334155;">Recibimos tu pago por el paquete <strong>${pkg}</strong>.</p>
    <hr style="border:0;border-top:1px solid #e5e7eb;margin:20px 0;" />
    <p style="font-size:14px;color:#475569;"><strong>Monto:</strong> ${amt}</p>
    <p style="font-size:14px;color:#475569;"><strong>Referencia:</strong> ${ref}</p>
    <p style="font-size:14px;color:#475569;"><strong>Fecha:</strong> ${when}</p>
    <hr style="border:0;border-top:1px solid #e5e7eb;margin:20px 0;" />
    <p style="color:#334155;">Vas a poder usar los beneficios cuando el pago se apruebe.</p>
    <p style="font-size:12px;color:#94a3b8;text-align:center;">Rutica</p>
  </div>
</body></html>`;
    const text = `Hola ${userName || ''}, recibimos tu pago por el paquete ${packageName} (monto ${amount}, referencia ${paymentReference}). Vas a poder usar los beneficios cuando el pago se apruebe.`;

    await sendMail(caller.email, 'Pago recibido - Rutica', html, text);
    return json(req, 200, { success: true });
  } catch (error) {
    console.error('email-paid:', error);
    return json(req, 500, { error: 'No se pudo enviar el correo' });
  }
});
