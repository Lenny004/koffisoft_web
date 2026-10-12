<script lang="ts">
  import { deserialize, enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import { ArrowRight, MapPin } from '@lucide/svelte';

  import { siteContent } from '$lib/content/site';
  import {
    addCalendarDays,
    formatVisitDate,
    formatVisitDateParts,
    reservationSlots,
    reservationTurns,
    todayInElSalvador,
    type ReservationTurnId,
  } from '$lib/content/reservation-turns';
  import type { PublicAvailabilityResponse } from '$lib/api/types';
  import { Button } from '$lib/components/ui/button/index.js';
  import FormField from '$lib/components/ui/form-field.svelte';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import { FORM_LIMITS } from '$lib/validation/limits';

  type ReservationActionForm = {
    kind?: 'error' | 'success' | 'availability';
    message?: string;
    reservationCode?: string;
    availability?: PublicAvailabilityResponse;
    errors?: Record<string, string>;
  } | null;

  type BookingStep = 'party' | 'date' | 'time' | 'space' | 'details';
  type PeriodFilter = 'all' | ReservationTurnId;

  const partyChoices = [1, 2, 3, 4, 5, 6, 7, 8];
  const visitDates = Array.from({ length: 21 }, (_, index) =>
    addCalendarDays(todayInElSalvador(), index),
  );
  const steps: { id: BookingStep; label: string }[] = [
    { id: 'party', label: 'Personas' },
    { id: 'date', label: 'Fecha' },
    { id: 'time', label: 'Hora' },
    { id: 'space', label: 'Zona' },
    { id: 'details', label: 'Tus datos' },
  ];

  let { form }: { form: ReservationActionForm } = $props();

  let step = $state<BookingStep>('party');
  let partySize = $state(2);
  let date = $state(visitDates[0]);
  let time = $state('');
  let period = $state<PeriodFilter>('all');
  let spaceChoice = $state<'unset' | 'any' | string>('unset');
  let availability = $state<PublicAvailabilityResponse | null>(null);
  let availabilityMessage = $state('');
  let availabilityLoading = $state(false);
  let availabilityRequest = 0;
  let contactName = $state('');
  let contactPhone = $state('');
  let contactEmail = $state('');
  let specialRequests = $state('');

  const selectedSlot = $derived(reservationSlots.find((slot) => slot.time === time));
  const visibleSlots = $derived(
    reservationSlots.filter((slot) => period === 'all' || slot.turnId === period),
  );
  const partyLabel = $derived(partySize === 1 ? '1 persona' : `${partySize} personas`);
  const openSpaces = $derived(availability?.spaces.filter((space) => space.available) ?? []);

  $effect(() => {
    if (form?.kind === 'error') step = 'details';
  });

  function canOpen(target: BookingStep): boolean {
    if (target === 'party') return true;
    if (target === 'date') return partySize > 0;
    if (target === 'time') return Boolean(date);
    if (target === 'space') return Boolean(selectedSlot) && openSpaces.length > 0;
    return spaceChoice !== 'unset';
  }

  function goTo(target: BookingStep): void {
    if (canOpen(target)) step = target;
  }

  function clearAvailability(): void {
    time = '';
    spaceChoice = 'unset';
    availability = null;
    availabilityMessage = '';
  }

  function selectParty(value: number): void {
    if (value !== partySize) {
      partySize = value;
      clearAvailability();
    }
    step = 'date';
  }

  function selectDate(value: string): void {
    if (value !== date) {
      date = value;
      clearAvailability();
    }
    step = 'time';
  }

  async function selectTime(value: string): Promise<void> {
    if (availabilityLoading) return;

    const request = ++availabilityRequest;
    time = value;
    spaceChoice = 'unset';
    availability = null;
    availabilityMessage = '';
    availabilityLoading = true;

    const body = new FormData();
    body.set('date', date);
    body.set('time', value);
    body.set('partySize', String(partySize));
    body.set('durationMinutes', '120');

    try {
      const response = await fetch('?/availability', {
        method: 'POST',
        body,
        headers: {
          accept: 'application/json',
          'x-sveltekit-action': 'true',
        },
      });
      const result = deserialize(await response.text());
      if (request !== availabilityRequest) return;
      const data = result.type === 'success' || result.type === 'failure' ? result.data : null;
      const payload = data as ReservationActionForm;

      if (result.type === 'success' && payload?.availability) {
        availability = payload.availability;
        const hasRoom = payload.availability.spaces.some((space) => space.available);
        if (!hasRoom) {
          availabilityMessage = 'No hay espacios para ese horario. Prueba con otra hora.';
          return;
        }
        step = 'space';
        return;
      }

      availabilityMessage =
        payload?.message ?? 'No pudimos consultar la disponibilidad. Intenta de nuevo.';
    } catch {
      availabilityMessage = 'No pudimos consultar la disponibilidad. Intenta de nuevo.';
    } finally {
      if (request === availabilityRequest) availabilityLoading = false;
    }
  }

  function fieldValue(event: Event): string {
    const target = event.currentTarget;
    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
      ? target.value
      : '';
  }

  function selectSpace(value: 'any' | string): void {
    spaceChoice = value;
    step = 'details';
  }
</script>

<section class="reservation-flow" aria-labelledby="reservation-flow-title">
  <h2 id="reservation-flow-title" class="reservation-flow__title">Arma tu visita</h2>

  <ol class="booking-steps">
    {#each steps as item (item.id)}
      <li class="booking-steps__item">
        <button
          class="booking-steps__button"
          type="button"
          aria-current={step === item.id ? 'step' : undefined}
          disabled={!canOpen(item.id)}
          onclick={() => goTo(item.id)}
        >
          {item.label}
        </button>
      </li>
    {/each}
  </ol>

  <div class="booking-filters">
    <button class="booking-filters__item" type="button" onclick={() => goTo('party')}>
      <span class="booking-filters__key">Personas</span>
      <span class="booking-filters__value">{partyLabel}</span>
    </button>
    <button
      class="booking-filters__item booking-filters__item--divided"
      type="button"
      onclick={() => goTo('date')}
    >
      <span class="booking-filters__key">Fecha</span>
      <span class="booking-filters__value">{formatVisitDate(date)}</span>
    </button>
    <button
      class="booking-filters__item booking-filters__item--divided"
      type="button"
      onclick={() => goTo('time')}
    >
      <span class="booking-filters__key">Hora</span>
      <span class="booking-filters__value">
        {selectedSlot ? `${selectedSlot.label} ${selectedSlot.time}` : 'Todos los horarios'}
      </span>
    </button>
  </div>

  <div class="booking-panel">
    {#if step === 'party'}
      <div class="booking-panel__step">
        <h3 class="booking-panel__heading">Elija la cantidad de personas</h3>
        <div class="choice-row" role="group" aria-label="Cantidad de personas">
          {#each partyChoices as choice (choice)}
            <button
              class="choice-chip choice-chip--party"
              class:is-selected={partySize === choice}
              type="button"
              aria-pressed={partySize === choice}
              onclick={() => selectParty(choice)}
            >
              {choice}
            </button>
          {/each}
        </div>
        <p class="booking-panel__note">
          Bebés y niños deben incluirse en la cantidad de personas. Para grupos de más de 8,
          <a href={resolve('/eventos')}>cuéntanos tu evento</a>.
        </p>
      </div>
    {:else if step === 'date'}
      <div class="booking-panel__step">
        <h3 class="booking-panel__heading">Seleccione una fecha</h3>
        <div class="choice-row choice-row--dates" role="group" aria-label="Fecha de la visita">
          {#each visitDates as visitDate (visitDate)}
            {@const parts = formatVisitDateParts(visitDate)}
            <button
              class="choice-chip choice-chip--date"
              class:is-selected={date === visitDate}
              type="button"
              aria-pressed={date === visitDate}
              onclick={() => selectDate(visitDate)}
            >
              <span class="choice-chip__weekday">{parts.weekday}</span>
              <span class="choice-chip__day">{parts.day}</span>
              <span class="choice-chip__month">{parts.month}</span>
            </button>
          {/each}
        </div>
        <button class="booking-back" type="button" onclick={() => goTo('party')}>Regresar</button>
      </div>
    {:else if step === 'time'}
      <div class="booking-panel__step">
        <h3 class="booking-panel__heading">Elija una hora</h3>
        <p class="booking-panel__note">
          Estos horarios son turnos de visita. Al elegir uno consultamos si hay una zona disponible.
        </p>
        <div class="choice-row" role="group" aria-label="Turno">
          <button
            class="choice-chip choice-chip--filter"
            class:is-selected={period === 'all'}
            type="button"
            aria-pressed={period === 'all'}
            onclick={() => (period = 'all')}
          >
            Todos los horarios
          </button>
          {#each reservationTurns as turn (turn.id)}
            <button
              class="choice-chip choice-chip--filter"
              class:is-selected={period === turn.id}
              type="button"
              aria-pressed={period === turn.id}
              onclick={() => (period = turn.id)}
            >
              {turn.label}
            </button>
          {/each}
        </div>
        <div
          class="slot-grid"
          role="group"
          aria-label="Horarios de visita"
          aria-busy={availabilityLoading}
        >
          {#each visibleSlots as slot (slot.id)}
            <button
              class="choice-chip choice-chip--slot"
              class:is-selected={time === slot.time}
              type="button"
              aria-pressed={time === slot.time}
              disabled={availabilityLoading}
              onclick={() => selectTime(slot.time)}
            >
              <span class="choice-chip__label">{slot.label}</span>
              <span class="choice-chip__time">{slot.time}</span>
            </button>
          {/each}
        </div>
        {#if availabilityMessage}
          <p class="booking-panel__alert" role="alert">{availabilityMessage}</p>
        {:else if availabilityLoading}
          <p class="booking-panel__note">Consultando espacios…</p>
        {/if}
        <button class="booking-back" type="button" onclick={() => goTo('date')}>Regresar</button>
      </div>
    {:else if step === 'space'}
      <div class="booking-panel__step">
        <h3 class="booking-panel__heading">Seleccione la zona</h3>
        <div class="slot-grid" role="group" aria-label="Zona preferida">
          <button
            class="choice-chip choice-chip--slot"
            class:is-selected={spaceChoice === 'any'}
            type="button"
            aria-pressed={spaceChoice === 'any'}
            onclick={() => selectSpace('any')}
          >
            <span class="choice-chip__label">Sin preferencia</span>
            <span class="choice-chip__time">Cualquier zona libre</span>
          </button>
          {#each availability?.spaces ?? [] as space (space.id)}
            <button
              class="choice-chip choice-chip--slot"
              class:is-selected={spaceChoice === space.id}
              type="button"
              aria-pressed={spaceChoice === space.id}
              disabled={!space.available}
              onclick={() => selectSpace(space.id)}
            >
              <span class="choice-chip__label">{space.nameEs}</span>
              <span class="choice-chip__time">
                {space.available ? `Hasta ${space.seatedCapacity}` : 'No disponible'}
              </span>
            </button>
          {/each}
        </div>
        <button class="booking-back" type="button" onclick={() => goTo('time')}>Regresar</button>
      </div>
    {:else}
      <div class="booking-panel__step">
        <h3 class="booking-panel__heading">Completa tus datos</h3>
        <p class="booking-panel__summary">
          {partyLabel} · {formatVisitDate(date)} · {selectedSlot
            ? `${selectedSlot.label} ${selectedSlot.time}`
            : 'Hora por elegir'}
        </p>
        <form class="reservation-form" method="POST" use:enhance>
          <input type="hidden" name="partySize" value={partySize} />
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="time" value={time} />
          <input type="hidden" name="durationMinutes" value="120" />
          {#if spaceChoice !== 'any' && spaceChoice !== 'unset'}
            <input type="hidden" name="preferredSpaceId" value={spaceChoice} />
          {/if}
          <FormField
            id="reservation-contact-name"
            label="Nombre"
            required
            error={form?.errors?.contactName}
            class="form-field--wide"
          >
            <Input
              id="reservation-contact-name"
              name="contactName"
              autocomplete="name"
              placeholder="Ej. Ana Martínez"
              maxlength={FORM_LIMITS.reservation.contactNameMaxLength}
              required
              value={contactName}
              oninput={(event: Event) => {
                contactName = fieldValue(event);
              }}
              aria-invalid={Boolean(form?.errors?.contactName)}
            />
          </FormField>
          <FormField
            id="reservation-contact-phone"
            label="Teléfono"
            required
            error={form?.errors?.contactPhone}
          >
            <Input
              id="reservation-contact-phone"
              name="contactPhone"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              placeholder="Ej. +503 7000 0000"
              maxlength={FORM_LIMITS.reservation.contactPhoneMaxLength}
              required
              value={contactPhone}
              oninput={(event: Event) => {
                contactPhone = fieldValue(event);
              }}
              aria-invalid={Boolean(form?.errors?.contactPhone)}
            />
          </FormField>
          <FormField
            id="reservation-contact-email"
            label="Correo electrónico (opcional)"
            error={form?.errors?.contactEmail}
          >
            <Input
              id="reservation-contact-email"
              name="contactEmail"
              type="email"
              autocomplete="email"
              placeholder="Ej. ana@correo.com"
              maxlength={FORM_LIMITS.reservation.contactEmailMaxLength}
              value={contactEmail}
              oninput={(event: Event) => {
                contactEmail = fieldValue(event);
              }}
              aria-invalid={Boolean(form?.errors?.contactEmail)}
            />
          </FormField>
          <FormField
            id="special-requests"
            label="Solicitudes especiales (opcional)"
            error={form?.errors?.specialRequests}
            class="form-field--wide"
          >
            <Textarea
              id="special-requests"
              name="specialRequests"
              rows={4}
              maxlength={FORM_LIMITS.reservation.specialRequestsMaxLength}
              placeholder="Cuéntanos si celebras algo o necesitas considerar algún detalle."
              value={specialRequests}
              oninput={(event: Event) => {
                specialRequests = fieldValue(event);
              }}
              aria-invalid={Boolean(form?.errors?.specialRequests)}
            />
          </FormField>
          {#if form?.errors?.date || form?.errors?.time || form?.errors?.partySize}
            <p class="booking-panel__alert" role="alert">
              {form?.errors?.date || form?.errors?.time || form?.errors?.partySize}
            </p>
          {/if}
          <div class="reservation-form__actions">
            <button class="booking-back" type="button" onclick={() => goTo('space')}>
              Regresar
            </button>
            <Button type="submit" size="lg">
              Enviar solicitud <ArrowRight size={17} aria-hidden="true" />
            </Button>
          </div>
        </form>
      </div>
    {/if}
  </div>

  <div class="reservation-venue">
    <div class="reservation-venue__rule" aria-hidden="true"></div>
    <p class="reservation-venue__about">
      <span class="reservation-venue__name">Koffi-Soft.</span>
      {siteContent.about.mission}
    </p>
    <div class="reservation-venue__rule" aria-hidden="true"></div>
    <p class="reservation-venue__place">
      <span class="reservation-venue__icon"><MapPin size={18} aria-hidden="true" /></span>
      <span>
        <span class="reservation-venue__name">Koffi-Soft</span>
        <span class="reservation-venue__address">{siteContent.contact.address}</span>
      </span>
    </p>
  </div>
</section>

<style>
  /* Asistente de reserva: pasos, filtros y horarios comparten el mismo chip. */
  .reservation-flow {
    padding: var(--space-lg);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--card);
    box-shadow: var(--shadow-sm);
  }

  .reservation-flow__title {
    margin: 0 0 var(--space-md);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
  }

  .booking-steps {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    margin: 0 0 var(--space-lg);
    padding: 0;
    list-style: none;
  }

  .booking-steps__item {
    flex: 0 0 auto;
  }

  .booking-steps__button {
    padding: var(--space-sm) var(--space-xs);
    border: 0;
    border-block-end: 0.125rem solid transparent;
    color: var(--text-muted);
    background: transparent;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
  }

  .booking-steps__button[aria-current='step'] {
    --steps-color: var(--primary);
    color: var(--steps-color);
    border-block-end-color: var(--steps-color);
  }

  .booking-steps__button:hover,
  .booking-steps__button:focus-visible {
    color: var(--foreground);
  }

  .booking-steps__button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .booking-filters {
    display: grid;
    margin-block-end: var(--space-lg);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-sunken);
  }

  .booking-filters__item {
    display: grid;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    border: 0;
    color: var(--foreground);
    background: transparent;
    text-align: start;
    cursor: pointer;
  }

  .booking-filters__item--divided {
    border-block-start: 1px solid var(--border);
  }

  .booking-filters__item:hover,
  .booking-filters__item:focus-visible {
    background: var(--surface-warm);
  }

  .booking-filters__key {
    color: var(--text-muted);
    font-size: var(--font-size-sm);
  }

  .booking-filters__value {
    font-weight: var(--font-weight-medium);
  }

  .booking-panel__step {
    display: grid;
    gap: var(--space-md);
  }

  .booking-panel__heading {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
  }

  .booking-panel__note,
  .booking-panel__summary,
  .booking-panel__alert {
    margin: 0;
    font-size: var(--font-size-sm);
  }

  .booking-panel__note,
  .booking-panel__summary {
    color: var(--text-muted);
  }

  .booking-panel__alert {
    color: var(--destructive);
  }

  .choice-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .choice-row--dates {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-block-end: var(--space-xs);
  }

  .choice-chip {
    --chip-bg: var(--card);
    --chip-color: var(--foreground);
    --chip-border: var(--border);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--chip-border);
    border-radius: var(--radius-md);
    color: var(--chip-color);
    background: var(--chip-bg);
    font: inherit;
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast),
      border-color var(--transition-fast);
  }

  .choice-chip:hover,
  .choice-chip:focus-visible {
    border-color: var(--primary);
  }

  .choice-chip.is-selected {
    --chip-bg: var(--primary);
    --chip-color: var(--primary-foreground);
    --chip-border: var(--primary);
  }

  .choice-chip:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .choice-chip--party {
    min-inline-size: 3.25rem;
    font-weight: var(--font-weight-medium);
  }

  .choice-chip--date {
    flex-direction: column;
    gap: 0.15rem;
    min-inline-size: 4.5rem;
  }

  .choice-chip__weekday,
  .choice-chip__month,
  .choice-chip__label {
    font-size: var(--font-size-sm);
  }

  .choice-chip__day,
  .choice-chip__time {
    font-weight: var(--font-weight-medium);
  }

  .choice-chip--filter {
    border-radius: var(--radius-full);
  }

  .choice-chip--slot {
    justify-content: space-between;
    inline-size: 100%;
  }

  .slot-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }

  .booking-back {
    justify-self: start;
    padding: 0;
    border: 0;
    color: var(--primary);
    background: transparent;
    font: inherit;
    font-weight: var(--font-weight-medium);
    cursor: pointer;
  }

  .booking-back:hover,
  .booking-back:focus-visible {
    text-decoration: underline;
  }

  .reservation-form {
    display: grid;
    gap: var(--space-md);
  }

  .reservation-form__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
  }

  .reservation-venue {
    margin-block-start: var(--space-xl);
  }

  .reservation-venue__rule {
    block-size: 1px;
    margin-block: var(--space-xl);
    background: var(--border);
  }

  .reservation-venue__about,
  .reservation-venue__place {
    margin: 0;
  }

  .reservation-venue__about {
    color: var(--text-muted);
  }

  .reservation-venue__name {
    display: block;
    color: var(--foreground);
    font-weight: var(--font-weight-medium);
  }

  .reservation-venue__place {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .reservation-venue__icon {
    display: flex;
    flex-shrink: 0;
    margin-block-start: 0.15rem;
  }

  .reservation-venue__address {
    display: block;
    color: var(--text-muted);
  }

  @media (min-width: 48rem) {
    .booking-filters {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .booking-filters__item--divided {
      border-block-start: 0;
      border-inline-start: 1px solid var(--border);
    }

    .slot-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .reservation-form {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 64rem) {
    .slot-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
