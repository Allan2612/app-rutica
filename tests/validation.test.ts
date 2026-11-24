import { describe, expect, it } from 'vitest';
import {
  contactSchema,
  fieldErrors,
  firstError,
  newPasswordSchema,
  registerSchema,
} from '@/utils/validation';

const validRegister = {
  firstName: 'Ana',
  lastName1: 'Soto',
  email: 'ana@example.com',
  phone: '',
  password: 'contraseña1',
  confirmPassword: 'contraseña1',
};

describe('registerSchema', () => {
  it('acepta un registro válido sin teléfono', () => {
    expect(firstError(registerSchema, validRegister)).toBeNull();
  });

  it('exige 8 caracteres de contraseña (igual que Supabase Auth)', () => {
    expect(firstError(registerSchema, { ...validRegister, password: 'corta12', confirmPassword: 'corta12' })).toMatch(/8 caracteres/);
  });

  it('detecta confirmación distinta', () => {
    expect(fieldErrors(registerSchema, { ...validRegister, confirmPassword: 'otra-cosa' })).toHaveProperty('confirmPassword');
  });

  it('rechaza correos mal escritos', () => {
    expect(firstError(registerSchema, { ...validRegister, email: 'ana@' })).toMatch(/correo/);
  });

  it('valida teléfonos de Costa Rica si se llenan', () => {
    for (const phone of ['8888-8888', '88888888', '+506 8888 8888', '506-2222-3333']) {
      expect(firstError(registerSchema, { ...validRegister, phone })).toBeNull();
    }
    expect(firstError(registerSchema, { ...validRegister, phone: '1234' })).toMatch(/8 dígitos/);
  });
});

describe('newPasswordSchema', () => {
  it('pide coincidencia y largo mínimo', () => {
    expect(firstError(newPasswordSchema, { password: '12345678', confirmPassword: '12345678' })).toBeNull();
    expect(firstError(newPasswordSchema, { password: '1234567', confirmPassword: '1234567' })).not.toBeNull();
    expect(firstError(newPasswordSchema, { password: '12345678', confirmPassword: '87654321' })).toMatch(/iguales/);
  });
});

describe('contactSchema', () => {
  it('todo vacío es válido', () => {
    expect(fieldErrors(contactSchema, { phone: '', email: '', website: '' })).toEqual({});
  });

  it('acepta sitios con o sin https', () => {
    expect(fieldErrors(contactSchema, { website: 'misitio.cr' })).toEqual({});
    expect(fieldErrors(contactSchema, { website: 'https://www.misitio.com/menu' })).toEqual({});
  });

  it('marca cada campo con formato inválido', () => {
    const errors = fieldErrors(contactSchema, { phone: '12', email: 'x@', website: 'no es web' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'phone', 'website']);
  });
});
