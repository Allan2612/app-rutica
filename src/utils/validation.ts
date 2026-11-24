import { z } from 'zod';

/**
 * Esquemas zod compartidos por los formularios (6.11). Los mensajes están en español porque
 * se muestran tal cual al usuario.
 */

/** Mismo mínimo que la configuración de Auth en Supabase (password_min_length = 8). */
export const PASSWORD_MIN_LENGTH = 8;

const trimmed = z.string().trim();

export const emailField = trimmed
  .min(1, 'El correo es obligatorio')
  .max(254, 'El correo es demasiado largo')
  .email('El correo no tiene un formato válido');

/** Costa Rica: 8 dígitos, con o sin +506, espacios o guiones. */
const CR_PHONE = /^(\+?506[\s-]?)?\d{4}[\s-]?\d{4}$/;
export const phoneField = trimmed.regex(
  CR_PHONE,
  'El teléfono debe tener 8 dígitos (ej. 8888-8888)',
);

/** Acepta "misitio.com" o "https://misitio.com"; el servicio agrega https:// al guardar. */
const URL_LIKE = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;
export const websiteField = trimmed.regex(URL_LIKE, 'El sitio web no parece una dirección válida');

export const passwordField = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`)
  .max(72, 'La contraseña es demasiado larga');

const optional = <T extends z.ZodTypeAny>(schema: T) => z.union([z.literal(''), schema]).optional();

/** Contacto de comercio, evento o atracción: todo opcional, pero con formato si se llena. */
export const contactSchema = z.object({
  phone: optional(phoneField),
  email: optional(z.string().trim().email('El correo no tiene un formato válido')),
  website: optional(websiteField),
});

export const newPasswordSchema = z
  .object({ password: passwordField, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'La contraseña y la confirmación deben ser iguales',
    path: ['confirmPassword'],
  });

export const registerSchema = z
  .object({
    firstName: trimmed.min(1, 'El nombre es obligatorio').max(60, 'El nombre es demasiado largo'),
    lastName1: trimmed
      .min(1, 'El primer apellido es obligatorio')
      .max(60, 'El apellido es demasiado largo'),
    email: emailField,
    phone: optional(phoneField),
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'La contraseña y la confirmación deben ser iguales',
    path: ['confirmPassword'],
  });

/** Errores por campo ({ campo: mensaje }), primer mensaje de cada campo. */
export function fieldErrors(schema: z.ZodTypeAny, data: unknown): Record<string, string> {
  const result = schema.safeParse(data);
  if (result.success) return {};
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? 'form');
    errors[key] ??= issue.message;
  }
  return errors;
}

/** Primer mensaje de error o null si los datos son válidos. */
export function firstError(schema: z.ZodTypeAny, data: unknown): string | null {
  const result = schema.safeParse(data);
  return result.success ? null : (result.error.issues[0]?.message ?? 'Datos inválidos');
}
