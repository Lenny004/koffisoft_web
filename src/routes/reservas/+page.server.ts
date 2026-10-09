import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { createApiClient } from '$lib/server/api/client';
import { validateAvailabilityForm, validateReservationForm } from '$lib/server/validation';

/** La página no consulta disponibilidad hasta que la persona define fecha, hora y grupo. */
export const load: PageServerLoad = async () => ({ availability: null });

export const actions: Actions = {
  availability: async ({ fetch, request }) => {
    const validation = validateAvailabilityForm(await request.formData());
    if (!validation.value) {
      return fail(400, {
        kind: 'error' as const,
        message: 'Revisa los datos de disponibilidad.',
        errors: validation.errors,
      });
    }

    try {
      const availability = await createApiClient(undefined, fetch).getAvailability(
        validation.value,
      );
      return { kind: 'availability' as const, availability, errors: {} };
    } catch {
      return fail(502, {
        kind: 'error' as const,
        message: 'No pudimos consultar la disponibilidad. Intenta de nuevo más tarde.',
        errors: {},
      });
    }
  },

  default: async ({ fetch, request }) => {
    const validation = validateReservationForm(await request.formData());
    if (!validation.value) {
      return fail(400, {
        kind: 'error' as const,
        message: 'Revisa los campos marcados antes de enviar tu solicitud.',
        errors: validation.errors,
      });
    }

    try {
      const reservation = await createApiClient(undefined, fetch).createReservation(
        validation.value,
      );
      return {
        kind: 'success' as const,
        message: 'Recibimos tu solicitud. Te contactaremos para confirmar la reserva.',
        reservationCode: reservation.reservationCode,
        errors: {},
      };
    } catch {
      return fail(502, {
        kind: 'error' as const,
        message: 'No pudimos enviar la solicitud. Intenta de nuevo más tarde.',
        errors: {},
      });
    }
  },
};
