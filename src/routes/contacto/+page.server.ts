import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

import { validateContactForm } from '$lib/server/validation';

/** Valida el formulario local mientras la API de contacto aún no tiene contrato público. */
export const actions: Actions = {
  default: async ({ request }) => {
    const validation = validateContactForm(await request.formData());

    if (!validation.value) {
      return fail(400, {
        kind: 'error' as const,
        message: 'Revisa los campos marcados antes de enviar el mensaje.',
        errors: validation.errors,
      });
    }

    return {
      kind: 'success' as const,
      message:
        'El formulario fue validado correctamente. La conexión con el canal de contacto queda pendiente de un endpoint aprobado.',
      errors: {},
    };
  },
};
