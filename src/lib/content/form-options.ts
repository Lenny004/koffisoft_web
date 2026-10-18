import type { PublicContactTopic, PublicEventType } from '$lib/api/types';

/** Asuntos del contrato público de contacto; la lista puede crecer con la API. */
export const CONTACT_TOPICS = [
  { value: 'general', label: 'Consulta general' },
  { value: 'reservation', label: 'Reserva' },
  { value: 'event', label: 'Evento o cotización' },
  { value: 'feedback', label: 'Comentario o sugerencia' },
  { value: 'other', label: 'Otro' },
] as const satisfies readonly { value: PublicContactTopic; label: string }[];

export const CONTACT_TOPIC_VALUES: readonly PublicContactTopic[] = CONTACT_TOPICS.map(
  (topic) => topic.value,
);

/** Tipos de evento del DTO público; se presentan con etiqueta en español. */
export const EVENT_TYPES = [
  { value: 'Wedding', label: 'Boda' },
  { value: 'Birthday', label: 'Cumpleaños' },
  { value: 'Corporate', label: 'Evento corporativo' },
  { value: 'Meeting', label: 'Reunión' },
  { value: 'Anniversary', label: 'Aniversario' },
  { value: 'Other', label: 'Otro' },
] as const satisfies readonly { value: PublicEventType; label: string }[];

export const EVENT_TYPE_VALUES: readonly PublicEventType[] = EVENT_TYPES.map(
  (eventType) => eventType.value,
);
