import { describe, expect, it } from 'vitest';

import {
  validateAvailabilityForm,
  validateContactForm,
  validateEventForm,
  validateReservationForm,
} from './validation';

describe('validación server-side de formularios públicos', () => {
  it('rechaza una reserva sin campos requeridos', () => {
    const result = validateReservationForm(new FormData());

    expect(result.value).toBeNull();
    expect(result.errors.contactName).toBe('El nombre es obligatorio.');
    expect(result.errors.partySize).toBeDefined();
  });

  it('construye una consulta de disponibilidad válida', () => {
    const form = new FormData();
    form.set('date', '2026-10-24');
    form.set('time', '18:30');
    form.set('partySize', '4');
    form.set('durationMinutes', '120');

    expect(validateAvailabilityForm(form)).toMatchObject({
      value: { date: '2026-10-24', time: '18:30', partySize: 4, durationMinutes: 120 },
      errors: {},
    });
  });

  it('convierte la fecha local de evento al offset de la sede', () => {
    const form = new FormData();
    form.set('eventType', 'Birthday');
    form.set('title', 'Celebración');
    form.set('contactName', 'Ana');
    form.set('contactPhone', '+503 0000-0000');
    form.set('startsAt', '2026-10-24T18:30');
    form.set('endsAt', '2026-10-24T21:30');
    form.set('estimatedGuestCount', '20');

    expect(validateEventForm(form).value).toMatchObject({
      startsAt: '2026-10-24T18:30:00-06:00',
      endsAt: '2026-10-24T21:30:00-06:00',
      estimatedGuestCount: 20,
    });
  });

  it('rechaza un mensaje de contacto demasiado corto', () => {
    const form = new FormData();
    form.set('name', 'Ana');
    form.set('email', 'ana@example.com');
    form.set('message', 'Hola');

    expect(validateContactForm(form)).toMatchObject({
      value: null,
      errors: { message: 'Escribe al menos 10 caracteres.' },
    });
  });

  it('normaliza un mensaje de contacto válido', () => {
    const form = new FormData();
    form.set('name', ' Ana ');
    form.set('email', 'ana@example.com');
    form.set('phone', '+503 0000-0000');
    form.set('message', 'Quisiera conocer el horario.');

    expect(validateContactForm(form)).toEqual({
      value: {
        name: 'Ana',
        email: 'ana@example.com',
        phone: '+503 0000-0000',
        message: 'Quisiera conocer el horario.',
      },
      errors: {},
    });
  });
});
