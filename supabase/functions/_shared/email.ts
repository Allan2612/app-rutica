// Helpers shared by the email Edge Functions.
// SMTP: nodemailer (denomailer 1.6 used APIs removed in Deno 2, the runtime Supabase runs today).
import nodemailer from 'npm:nodemailer@6.9.16';
import { createClient, type SupabaseClient, type User } from 'npm:@supabase/supabase-js@2.49.4';

const ALLOWED_ORIGINS = [
  /^https:\/\/rutica-orpin\.vercel\.app$/,
  /^https:\/\/rutica-[a-z0-9-]+-allans-projects-60a7494c\.vercel\.app$/, // previews
  /^http:\/\/localhost:\d+$/,
];

export function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get('Origin') ?? '';
  const allowed = ALLOWED_ORIGINS.some((re) => re.test(origin));
  return {
    ...(allowed ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}),
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

export function json(req: Request, status: number, body: unknown): Response {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
  });
}

/** Escapes text for safe interpolation into email HTML. */
export function escapeHtml(value: unknown, maxLength = 200): string {
  return String(value ?? '')
    .slice(0, maxLength)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function serviceClient(): SupabaseClient {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  });
}

/** The signed-in user that called the function, or null. The gateway already verified the JWT. */
export async function getCaller(req: Request): Promise<User | null> {
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data, error } = await serviceClient().auth.getUser(token);
  return error ? null : data.user;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await serviceClient()
    .from('profiles')
    .select('role_prf, is_active_prf')
    .eq('id_prf', userId)
    .maybeSingle();
  return data?.role_prf === 'admin' && data?.is_active_prf !== false;
}

export async function sendMail(
  to: string,
  subject: string,
  html: string,
  text: string,
): Promise<void> {
  // SMTP de Brevo, el mismo que usa Auth (secretos SMTP_*, MAIL_FROM)
  const env = (k: string) => Deno.env.get(k) || undefined;
  const user = env('SMTP_USER');
  const pass = env('SMTP_PASS');
  const from = env('MAIL_FROM');
  if (!user || !pass || !from) throw new Error('SMTP_USER, SMTP_PASS and MAIL_FROM must be set');
  const port = Number(env('SMTP_PORT') ?? 587);
  const transporter = nodemailer.createTransport({
    host: env('SMTP_HOST') ?? 'smtp-relay.brevo.com',
    port,
    secure: port === 465, // 587 usa STARTTLS
    auth: { user, pass },
  });
  // El usuario SMTP de Brevo no es una dirección de correo: el remitente va aparte
  await transporter.sendMail({ from: `Rutica <${from}>`, to, subject, html, text });
}
