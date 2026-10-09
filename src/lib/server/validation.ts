import type { CreateEventRequest, CreateReservationRequest, PublicEventType } from '$lib/api/types';

export interface FormValidation<T> {
  value: T | null;
  errors: Record<string, string>;
}

/** Valida y normaliza los campos mínimos antes de consultar disponibilidad en la API. */
export function validateAvailabilityForm(
  formData: FormData,
): FormValidation<
  Pick<CreateReservationRequest, 'date' | 'time' | 'partySize' | 'durationMinutes' | 'spaceId'>
> {
  const date = text(formData, 'date');
  const time = text(formData, 'time');
  const errors: Record<string, string> = {};

  if (!date) errors.date = 'La fecha es obligatoria.';
  if (!time) errors.time = 'La hora es obligatoria.';
  if (date && !validCalendarDate(date)) errors.date = 'Usa una fecha válida.';
  if (time && !timePattern.test(time)) errors.time = 'Usa una hora válida.';

  const partySize = integer(formData, 'partySize');
  if (partySize === null || partySize < 1 || partySize > 100) {
    errors.partySize = 'El grupo debe tener entre 1 y 100 personas.';
  }

  const durationMinutes = integer(formData, 'durationMinutes') ?? 120;
  if (durationMinutes < 30 || durationMinutes > 360) {
    errors.durationMinutes = 'La duración debe estar entre 30 y 360 minutos.';
  }

  if (Object.keys(errors).length > 0 || partySize === null) return { value: null, errors };

  return {
    errors,
    value: {
      date,
      time,
      partySize,
      durationMinutes,
      spaceId: optionalText(formData, 'spaceId'),
    },
  };
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const datePattern = /^\d{4}-\d{2}-\d{2}$/u;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/u;
const localDateTimePattern = /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/u;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;
const eventTypes: PublicEventType[] = [
  'Wedding',
  'Birthday',
  'Corporate',
  'Meeting',
  'Anniversary',
  'Other',
];

function text(formData: FormData, name: string): string {
  return String(formData.get(name) ?? '').trim();
}

function optionalText(formData: FormData, name: string): string | undefined {
  const value = text(formData, name);
  return value || undefined;
}

function integer(formData: FormData, name: string): number | null {
  const rawValue = text(formData, name);
  if (!rawValue) return null;

  const value = Number(rawValue);
  return Number.isInteger(value) ? value : null;
}

function validCalendarDate(value: string): boolean {
  if (!datePattern.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.valueOf()) && date.toISOString().startsWith(value);
}

function validLocalDateTime(value: string): boolean {
  return localDateTimePattern.test(value) && validCalendarDate(value.slice(0, 10));
}

function addRequired(
  errors: Record<string, string>,
  values: Record<string, string>,
  name: string,
  label: string,
) {
  if (!values[name]) errors[name] = `${label} es obligatorio.`;
}

/** Valida la solicitud pública y conserva los nombres del DTO que recibirá la API. */
export function validateReservationForm(
  formData: FormData,
): FormValidation<CreateReservationRequest> {
  const values = {
    contactName: text(formData, 'contactName'),
    contactPhone: text(formData, 'contactPhone'),
    date: text(formData, 'date'),
    time: text(formData, 'time'),
  };
  const errors: Record<string, string> = {};

  addRequired(errors, values, 'contactName', 'El nombre');
  addRequired(errors, values, 'contactPhone', 'El teléfono');
  addRequired(errors, values, 'date', 'La fecha');
  addRequired(errors, values, 'time', 'La hora');
  if (values.date && !validCalendarDate(values.date)) errors.date = 'Usa una fecha válida.';
  if (values.time && !timePattern.test(values.time)) errors.time = 'Usa una hora válida.';

  const partySize = integer(formData, 'partySize');
  if (partySize === null || partySize < 1 || partySize > 100) {
    errors.partySize = 'El grupo debe tener entre 1 y 100 personas.';
  }

  const durationMinutes = integer(formData, 'durationMinutes') ?? 120;
  if (durationMinutes < 30 || durationMinutes > 360) {
    errors.durationMinutes = 'La duración debe estar entre 30 y 360 minutos.';
  }

  const contactEmail = optionalText(formData, 'contactEmail');
  if (contactEmail && !emailPattern.test(contactEmail))
    errors.contactEmail = 'Escribe un correo válido.';

  const preferredSpaceId = optionalText(formData, 'preferredSpaceId');
  if (preferredSpaceId && !uuidPattern.test(preferredSpaceId)) {
    errors.preferredSpaceId = 'Selecciona un espacio válido.';
  }

  if (Object.keys(errors).length > 0 || partySize === null) return { value: null, errors };

  return {
    errors,
    value: {
      contactName: values.contactName,
      contactPhone: values.contactPhone,
      date: values.date,
      time: values.time,
      partySize,
      durationMinutes,
      contactEmail,
      preferredLanguage: 'es',
      preferredSpaceId,
      specialRequests: optionalText(formData, 'specialRequests'),
    },
  };
}

function toElSalvadorIso(value: string): string {
  return `${value}:00-06:00`;
}

/** Valida el formulario de cotización y aplica el offset horario contractual de la sede. */
export function validateEventForm(formData: FormData): FormValidation<CreateEventRequest> {
  const values = {
    eventType: text(formData, 'eventType'),
    title: text(formData, 'title'),
    contactName: text(formData, 'contactName'),
    contactPhone: text(formData, 'contactPhone'),
    startsAt: text(formData, 'startsAt'),
    endsAt: text(formData, 'endsAt'),
  };
  const errors: Record<string, string> = {};

  addRequired(errors, values, 'eventType', 'El tipo de evento');
  addRequired(errors, values, 'title', 'El título');
  addRequired(errors, values, 'contactName', 'El nombre');
  addRequired(errors, values, 'contactPhone', 'El teléfono');
  addRequired(errors, values, 'startsAt', 'La fecha de inicio');
  addRequired(errors, values, 'endsAt', 'La fecha de finalización');

  if (values.eventType && !eventTypes.includes(values.eventType as PublicEventType)) {
    errors.eventType = 'Selecciona un tipo de evento válido.';
  }
  if (values.startsAt && !validLocalDateTime(values.startsAt)) {
    errors.startsAt = 'Usa una fecha y hora de inicio válidas.';
  }
  if (values.endsAt && !validLocalDateTime(values.endsAt)) {
    errors.endsAt = 'Usa una fecha y hora de finalización válidas.';
  }
  if (
    validLocalDateTime(values.startsAt) &&
    validLocalDateTime(values.endsAt) &&
    new Date(toElSalvadorIso(values.endsAt)) <= new Date(toElSalvadorIso(values.startsAt))
  ) {
    errors.endsAt = 'La finalización debe ser posterior al inicio.';
  }

  const estimatedGuestCount = integer(formData, 'estimatedGuestCount');
  if (estimatedGuestCount === null || estimatedGuestCount < 1 || estimatedGuestCount > 10_000) {
    errors.estimatedGuestCount = 'Indica entre 1 y 10,000 invitados.';
  }

  const contactEmail = optionalText(formData, 'contactEmail');
  if (contactEmail && !emailPattern.test(contactEmail))
    errors.contactEmail = 'Escribe un correo válido.';

  const budgetTarget = optionalText(formData, 'budgetTarget');
  if (budgetTarget && !/^\d+(\.\d{1,2})?$/u.test(budgetTarget)) {
    errors.budgetTarget = 'Usa un monto positivo con hasta dos decimales.';
  }

  if (Object.keys(errors).length > 0 || estimatedGuestCount === null)
    return { value: null, errors };

  return {
    errors,
    value: {
      eventType: values.eventType as PublicEventType,
      title: values.title,
      contactName: values.contactName,
      contactPhone: values.contactPhone,
      contactEmail,
      preferredLanguage: 'es',
      startsAt: toElSalvadorIso(values.startsAt),
      endsAt: toElSalvadorIso(values.endsAt),
      estimatedGuestCount,
      budgetTarget,
      specialRequirements: optionalText(formData, 'specialRequirements'),
    },
  };
}
