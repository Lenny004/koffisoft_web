/** Turnos de visita para elegir hora. La disponibilidad real la confirma la API. */
export const reservationTurns = [
  {
    id: 'breakfast',
    label: 'Desayuno',
    times: ['08:00', '08:30', '09:00', '09:30', '10:00'],
  },
  {
    id: 'lunch',
    label: 'Almuerzo',
    times: ['12:00', '12:30', '13:00', '13:30', '14:00'],
  },
  {
    id: 'coffee',
    label: 'Café',
    times: ['15:00', '15:30', '16:00', '16:30', '17:00'],
  },
  {
    id: 'dinner',
    label: 'Cena',
    times: ['18:00', '18:30', '19:00', '19:30', '20:00'],
  },
] as const;

export type ReservationTurnId = (typeof reservationTurns)[number]['id'];

export interface ReservationSlot {
  id: string;
  turnId: ReservationTurnId;
  label: string;
  time: string;
}

export const reservationSlots: ReservationSlot[] = reservationTurns.flatMap((turn) =>
  turn.times.map((time) => ({
    id: `${turn.id}-${time}`,
    turnId: turn.id,
    label: turn.label,
    time,
  })),
);

const TIME_ZONE = 'America/El_Salvador';

/** Suma días sobre una fecha civil YYYY-MM-DD, sin depender de la zona del navegador. */
export function addCalendarDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export function todayInElSalvador(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(now);
}

export function formatVisitDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00-06:00`);
  return new Intl.DateTimeFormat('es-SV', {
    day: 'numeric',
    month: 'short',
    timeZone: TIME_ZONE,
  }).format(date);
}

export function formatVisitDateParts(isoDate: string): {
  weekday: string;
  day: string;
  month: string;
} {
  const date = new Date(`${isoDate}T12:00:00-06:00`);
  const format = (options: Intl.DateTimeFormatOptions): string =>
    new Intl.DateTimeFormat('es-SV', { ...options, timeZone: TIME_ZONE }).format(date);

  return {
    weekday: format({ weekday: 'short' }).replace('.', ''),
    day: format({ day: 'numeric' }),
    month: format({ month: 'short' }).replace('.', ''),
  };
}
