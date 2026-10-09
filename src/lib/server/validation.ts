import type { CreateEventRequest, CreateReservationRequest, PublicEventType } from '$lib/api/types';
import { FORM_LIMITS, FORM_PATTERNS } from '$lib/validation/limits';

export interface FormValidation<T> {
  value: T | null;
  errors: Record<string, string>;
}

export interface ContactFormValues {
  name: string;
  email: string;
  phone?: string;
  message: string;
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
  if (
    partySize === null ||
    partySize < FORM_LIMITS.reservation.partySizeMin ||
    partySize > FORM_LIMITS.reservation.partySizeMax
  ) {
    errors.partySize = `El grupo debe tener entre ${FORM_LIMITS.reservation.partySizeMin} y ${FORM_LIMITS.reservation.partySizeMax} personas.`;
  }

  const durationMinutes = integer(formData, 'durationMinutes') ?? 120;
  if (
    durationMinutes < FORM_LIMITS.reservation.durationMinutesMin ||
    durationMinutes > FORM_LIMITS.reservation.durationMinutesMax
  ) {
    errors.durationMinutes = `La duración debe estar entre ${FORM_LIMITS.reservation.durationMinutesMin} y ${FORM_LIMITS.reservation.durationMinutesMax} minutos.`;
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

const emailPattern = FORM_PATTERNS.email;
const datePattern = /^\d{4}-\d{2}-\d{2}$/u;
const timePattern = FORM_PATTERNS.time;
const localDateTimePattern = /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/u;
const uuidPattern = FORM_PATTERNS.uuid;
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

/** Valida el formulario editorial de contacto sin enviarlo a una API no contratada. */
export function validateContactForm(formData: FormData): FormValidation<ContactFormValues> {
  const name = text(formData, 'name');
  const email = text(formData, 'email');
  const phone = optionalText(formData, 'phone');
  const message = text(formData, 'message');
  const errors: Record<string, string> = {};

  if (!name) errors.name = 'El nombre es obligatorio.';
  if (name.length > FORM_LIMITS.contact.nameMaxLength)
    errors.name = `El nombre no puede superar ${FORM_LIMITS.contact.nameMaxLength} caracteres.`;
  if (!email) errors.email = 'El correo es obligatorio.';
  else if (!emailPattern.test(email)) errors.email = 'Escribe un correo válido.';
  else if (email.length > FORM_LIMITS.contact.emailMaxLength)
    errors.email = `El correo no puede superar ${FORM_LIMITS.contact.emailMaxLength} caracteres.`;
  if (phone && phone.length > FORM_LIMITS.contact.phoneMaxLength)
    errors.phone = `El teléfono no puede superar ${FORM_LIMITS.contact.phoneMaxLength} caracteres.`;
  if (!message) errors.message = 'El mensaje es obligatorio.';
  else if (message.length < FORM_LIMITS.contact.messageMinLength)
    errors.message = 'Escribe al menos 10 caracteres.';
  else if (message.length > FORM_LIMITS.contact.messageMaxLength)
    errors.message = `El mensaje no puede superar ${FORM_LIMITS.contact.messageMaxLength.toLocaleString('es-SV')} caracteres.`;

  if (Object.keys(errors).length > 0) return { value: null, errors };

  return { value: { name, email, phone, message }, errors };
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
  if (values.contactName.length > FORM_LIMITS.reservation.contactNameMaxLength)
    errors.contactName = `El nombre no puede superar ${FORM_LIMITS.reservation.contactNameMaxLength} caracteres.`;
  if (values.contactPhone.length > FORM_LIMITS.reservation.contactPhoneMaxLength)
    errors.contactPhone = `El teléfono no puede superar ${FORM_LIMITS.reservation.contactPhoneMaxLength} caracteres.`;
  if (values.date && !validCalendarDate(values.date)) errors.date = 'Usa una fecha válida.';
  if (values.time && !timePattern.test(values.time)) errors.time = 'Usa una hora válida.';

  const partySize = integer(formData, 'partySize');
  if (
    partySize === null ||
    partySize < FORM_LIMITS.reservation.partySizeMin ||
    partySize > FORM_LIMITS.reservation.partySizeMax
  ) {
    errors.partySize = `El grupo debe tener entre ${FORM_LIMITS.reservation.partySizeMin} y ${FORM_LIMITS.reservation.partySizeMax} personas.`;
  }

  const durationMinutes = integer(formData, 'durationMinutes') ?? 120;
  if (
    durationMinutes < FORM_LIMITS.reservation.durationMinutesMin ||
    durationMinutes > FORM_LIMITS.reservation.durationMinutesMax
  ) {
    errors.durationMinutes = `La duración debe estar entre ${FORM_LIMITS.reservation.durationMinutesMin} y ${FORM_LIMITS.reservation.durationMinutesMax} minutos.`;
  }

  const contactEmail = optionalText(formData, 'contactEmail');
  if (contactEmail && !emailPattern.test(contactEmail))
    errors.contactEmail = 'Escribe un correo válido.';
  else if (contactEmail && contactEmail.length > FORM_LIMITS.reservation.contactEmailMaxLength)
    errors.contactEmail = `El correo no puede superar ${FORM_LIMITS.reservation.contactEmailMaxLength} caracteres.`;

  const preferredSpaceId = optionalText(formData, 'preferredSpaceId');
  if (preferredSpaceId && !uuidPattern.test(preferredSpaceId)) {
    errors.preferredSpaceId = 'Selecciona un espacio válido.';
  }

  const specialRequests = optionalText(formData, 'specialRequests');
  if (specialRequests && specialRequests.length > FORM_LIMITS.reservation.specialRequestsMaxLength)
    errors.specialRequests = `La solicitud no puede superar ${FORM_LIMITS.reservation.specialRequestsMaxLength.toLocaleString('es-SV')} caracteres.`;

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
      specialRequests,
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
  if (
    estimatedGuestCount === null ||
    estimatedGuestCount < FORM_LIMITS.event.estimatedGuestCountMin ||
    estimatedGuestCount > FORM_LIMITS.event.estimatedGuestCountMax
  ) {
    errors.estimatedGuestCount = `Indica entre ${FORM_LIMITS.event.estimatedGuestCountMin} y ${FORM_LIMITS.event.estimatedGuestCountMax.toLocaleString('es-SV')} invitados.`;
  }

  if (values.title.length > FORM_LIMITS.event.titleMaxLength)
    errors.title = `El título no puede superar ${FORM_LIMITS.event.titleMaxLength} caracteres.`;
  if (values.contactName.length > FORM_LIMITS.event.contactNameMaxLength)
    errors.contactName = `El nombre no puede superar ${FORM_LIMITS.event.contactNameMaxLength} caracteres.`;
  if (values.contactPhone.length > FORM_LIMITS.event.contactPhoneMaxLength)
    errors.contactPhone = `El teléfono no puede superar ${FORM_LIMITS.event.contactPhoneMaxLength} caracteres.`;

  const contactEmail = optionalText(formData, 'contactEmail');
  if (contactEmail && !emailPattern.test(contactEmail))
    errors.contactEmail = 'Escribe un correo válido.';
  else if (contactEmail && contactEmail.length > FORM_LIMITS.event.contactEmailMaxLength)
    errors.contactEmail = `El correo no puede superar ${FORM_LIMITS.event.contactEmailMaxLength} caracteres.`;

  const budgetTarget = optionalText(formData, 'budgetTarget');
  if (
    budgetTarget &&
    (!FORM_PATTERNS.decimal2.test(budgetTarget) ||
      Number(budgetTarget) > FORM_LIMITS.event.budgetMax)
  ) {
    errors.budgetTarget = 'Usa un monto positivo con hasta dos decimales.';
  }

  const specialRequirements = optionalText(formData, 'specialRequirements');
  if (
    specialRequirements &&
    specialRequirements.length > FORM_LIMITS.event.specialRequirementsMaxLength
  )
    errors.specialRequirements = `El detalle no puede superar ${FORM_LIMITS.event.specialRequirementsMaxLength.toLocaleString('es-SV')} caracteres.`;

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
      specialRequirements,
    },
  };
}
