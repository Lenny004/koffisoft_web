<script lang="ts">
  import { enhance } from '$app/forms';
  import { ArrowRight, CalendarCheck, Clock3, Users } from '@lucide/svelte';

  import StatusMessage from '$lib/components/public/status-message.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Select } from '$lib/components/ui/select/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import type { PublicAvailabilityResponse } from '$lib/api/types';

  type ReservationActionForm = {
    kind?: 'error' | 'success' | 'availability';
    message?: string;
    reservationCode?: string;
    availability?: PublicAvailabilityResponse;
    errors?: Record<string, string>;
  } | null;

  let { form }: { form: ReservationActionForm } = $props();
</script>

<svelte:head>
  <title>Reservas | Koffi-Soft</title>
  <meta
    name="description"
    content="Consulta disponibilidad y envía una solicitud de reserva para disfrutar Koffi-Soft en la Ruta Panorámica."
  />
</svelte:head>

<div class="reservation-page">
  <header class="reservation-page__header">
    <p class="reservation-page__eyebrow">Tu mesa te espera</p>
    <h1 class="reservation-page__title">Reserva tu momento.</h1>
    <p class="reservation-page__intro">
      Consulta los espacios disponibles y envíanos tu solicitud. La reserva queda pendiente de
      confirmación por nuestro equipo.
    </p>
  </header>

  {#if form?.kind === 'success'}
    <StatusMessage
      title="Solicitud recibida"
      message={`${form.message} Código: ${form.reservationCode}.`}
    />
  {:else if form?.kind === 'error'}
    <StatusMessage
      title="No pudimos completar la solicitud"
      message={form.message ?? 'Revisa los datos e intenta de nuevo.'}
      variant="destructive"
    />
  {/if}

  <section class="reservation-page__grid" aria-label="Consulta y solicitud de reserva">
    <Card class="availability-card">
      <CardHeader class="availability-card__header">
        <div class="availability-card__icon" aria-hidden="true"><CalendarCheck size={22} /></div>
        <CardTitle class="availability-card__title">Consulta disponibilidad</CardTitle>
        <p class="availability-card__copy">
          Elige una fecha y hora para conocer los espacios activos.
        </p>
      </CardHeader>
      <CardContent>
        <form class="form-layout" method="POST" action="?/availability" use:enhance>
          <div class="form-field">
            <Label for="availability-date">Fecha</Label>
            <Input id="availability-date" name="date" type="date" required />
            {#if form?.errors?.date}<span class="form-field__error">{form.errors.date}</span>{/if}
          </div>
          <div class="form-field">
            <Label for="availability-time">Hora</Label>
            <Input id="availability-time" name="time" type="time" required />
            {#if form?.errors?.time}<span class="form-field__error">{form.errors.time}</span>{/if}
          </div>
          <div class="form-field">
            <Label for="availability-party-size">Personas</Label>
            <Input
              id="availability-party-size"
              name="partySize"
              type="number"
              min="1"
              max="100"
              value="2"
              required
            />
            {#if form?.errors?.partySize}<span class="form-field__error"
                >{form.errors.partySize}</span
              >{/if}
          </div>
          <div class="form-field">
            <Label for="availability-duration">Duración aproximada</Label>
            <Select id="availability-duration" name="durationMinutes" value="120">
              <option value="90">90 minutos</option>
              <option value="120">2 horas</option>
              <option value="180">3 horas</option>
            </Select>
            {#if form?.errors?.durationMinutes}<span class="form-field__error"
                >{form.errors.durationMinutes}</span
              >{/if}
          </div>
          <Button type="submit" class="form-layout__submit">
            Consultar espacios <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </form>
      </CardContent>
    </Card>

    {#if form?.kind === 'availability' && form.availability}
      <Card class="availability-result">
        <CardHeader>
          <CardTitle>Espacios disponibles</CardTitle>
          <p class="availability-result__copy">
            Selecciona un espacio en el formulario de solicitud.
          </p>
        </CardHeader>
        <CardContent>
          {#if form.availability.spaces.length === 0}
            <p class="availability-result__empty">No encontramos espacios para esos datos.</p>
          {:else}
            <ul class="availability-result__list">
              {#each form.availability.spaces as space (space.id)}
                <li
                  class:availability-result__item--available={space.available}
                  class="availability-result__item"
                >
                  <div>
                    <p class="availability-result__name">{space.nameEs}</p>
                    <p class="availability-result__capacity">
                      Hasta {space.seatedCapacity} personas sentadas
                    </p>
                  </div>
                  <span>{space.available ? 'Disponible' : 'No disponible'}</span>
                </li>
              {/each}
            </ul>
          {/if}
        </CardContent>
      </Card>
    {/if}
  </section>

  <section class="reservation-form-section" aria-labelledby="reservation-form-title">
    <div class="reservation-form-section__heading">
      <p class="reservation-page__eyebrow">Solicitud de reserva</p>
      <h2 id="reservation-form-title" class="reservation-form-section__title">
        Cuéntanos cómo recibirte.
      </h2>
      <p class="reservation-form-section__copy">
        Completa tus datos y nos pondremos en contacto para confirmar.
      </p>
    </div>
    <Card>
      <CardContent>
        <form class="form-layout form-layout--wide" method="POST" use:enhance>
          <div class="form-field form-field--wide">
            <Label for="contact-name">Nombre</Label>
            <Input id="contact-name" name="contactName" autocomplete="name" required />
            {#if form?.errors?.contactName}<span class="form-field__error"
                >{form.errors.contactName}</span
              >{/if}
          </div>
          <div class="form-field">
            <Label for="contact-phone">Teléfono</Label>
            <Input id="contact-phone" name="contactPhone" type="tel" autocomplete="tel" required />
            {#if form?.errors?.contactPhone}<span class="form-field__error"
                >{form.errors.contactPhone}</span
              >{/if}
          </div>
          <div class="form-field">
            <Label for="contact-email"
              >Correo electrónico <span class="form-field__optional">(opcional)</span></Label
            >
            <Input id="contact-email" name="contactEmail" type="email" autocomplete="email" />
            {#if form?.errors?.contactEmail}<span class="form-field__error"
                >{form.errors.contactEmail}</span
              >{/if}
          </div>
          <div class="form-field">
            <Label for="reservation-date">Fecha</Label>
            <Input id="reservation-date" name="date" type="date" required />
            {#if form?.errors?.date}<span class="form-field__error">{form.errors.date}</span>{/if}
          </div>
          <div class="form-field">
            <Label for="reservation-time">Hora</Label>
            <Input id="reservation-time" name="time" type="time" required />
            {#if form?.errors?.time}<span class="form-field__error">{form.errors.time}</span>{/if}
          </div>
          <div class="form-field">
            <Label for="reservation-party-size">Personas</Label>
            <Input
              id="reservation-party-size"
              name="partySize"
              type="number"
              min="1"
              max="100"
              required
            />
            {#if form?.errors?.partySize}<span class="form-field__error"
                >{form.errors.partySize}</span
              >{/if}
          </div>
          <div class="form-field">
            <Label for="preferred-space"
              >Espacio preferido <span class="form-field__optional">(opcional)</span></Label
            >
            <Select id="preferred-space" name="preferredSpaceId">
              <option value="">Sin preferencia</option>
              {#each form?.availability?.spaces ?? [] as space (space.id)}
                <option value={space.id}>{space.nameEs}</option>
              {/each}
            </Select>
          </div>
          <div class="form-field form-field--wide">
            <Label for="special-requests"
              >Solicitudes especiales <span class="form-field__optional">(opcional)</span></Label
            >
            <Textarea
              id="special-requests"
              name="specialRequests"
              rows="4"
              placeholder="Cuéntanos si celebras algo o necesitas considerar algún detalle."
            />
          </div>
          <Button type="submit" size="lg" class="form-layout__submit form-layout__submit--wide">
            Enviar solicitud <ArrowRight size={17} aria-hidden="true" />
          </Button>
        </form>
      </CardContent>
    </Card>
  </section>

  <aside class="reservation-note">
    <Clock3 size={20} aria-hidden="true" />
    <p class="reservation-note__copy">
      <strong>Importante:</strong> la disponibilidad es una consulta inicial; tu reserva queda confirmada
      cuando nuestro equipo te contacte.
    </p>
    <Users size={20} aria-hidden="true" />
  </aside>
</div>

<style>
  /* Los formularios usan enhance para conservar la navegación sin JavaScript como fallback. */
  .reservation-page {
    inline-size: min(100% - 2rem, var(--container-max));
    margin-inline: auto;
    padding-block: 3rem 1rem;
  }

  .reservation-page__header {
    max-inline-size: 46rem;
    margin-block-end: 2.5rem;
  }

  .reservation-page__eyebrow {
    margin: 0 0 0.5rem;
    color: var(--primary);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .reservation-page__title,
  .reservation-form-section__title {
    margin: 0;
    font-family: Georgia, serif;
    font-size: clamp(2.8rem, 8vw, 5rem);
    letter-spacing: -0.04em;
    line-height: 0.95;
  }

  .reservation-page__intro,
  .reservation-form-section__copy {
    margin: var(--space-lg) 0 0;
    color: var(--muted-foreground);
    font-size: 1.1rem;
  }

  .reservation-page__grid {
    display: grid;
    gap: var(--space-lg);
  }

  :global(.availability-card__header) {
    position: relative;
    padding-inline-start: 5rem;
  }

  .availability-card__icon {
    position: absolute;
    inset-block-start: 1.5rem;
    inset-inline-start: 1.5rem;
    display: grid;
    place-items: center;
    inline-size: 2.75rem;
    block-size: 2.75rem;
    border-radius: var(--radius-full);
    color: var(--primary-foreground);
    background: var(--primary);
  }

  :global(.availability-card__title) {
    font-family: Georgia, serif;
    font-size: 1.4rem;
  }

  .availability-card__copy,
  .availability-result__copy {
    margin: 0.35rem 0 0;
    color: var(--muted-foreground);
    font-size: 0.9rem;
  }

  .form-layout {
    display: grid;
    gap: var(--space-md);
  }

  .form-field {
    display: grid;
    gap: 0.45rem;
  }

  .form-field__optional {
    color: var(--muted-foreground);
    font-weight: 400;
  }

  .form-field__error {
    color: var(--destructive);
    font-size: 0.8rem;
  }

  :global(.form-layout__submit) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    margin-block-start: 0.5rem;
  }

  .availability-result__list {
    display: grid;
    gap: 0.65rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .availability-result__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    padding: 0.8rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    color: var(--muted-foreground);
  }

  .availability-result__item--available {
    border-color: var(--primary);
    color: var(--foreground);
  }

  .availability-result__name,
  .availability-result__capacity,
  .availability-result__empty {
    margin: 0;
  }

  .availability-result__name {
    font-weight: 700;
  }

  .availability-result__capacity {
    font-size: 0.8rem;
  }

  .availability-result__item > span {
    flex-shrink: 0;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .availability-result__empty {
    color: var(--muted-foreground);
  }

  .reservation-form-section {
    display: grid;
    gap: var(--space-xl);
    margin-block: 5rem 2rem;
  }

  .reservation-form-section__title {
    font-size: clamp(2.2rem, 5vw, 3.5rem);
  }

  .reservation-note {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    margin-block: 2rem 4rem;
    padding: var(--space-lg);
    border-radius: var(--radius-md);
    color: var(--accent-foreground);
    background: var(--accent);
  }

  .reservation-note__copy {
    margin: 0;
    font-size: 0.9rem;
  }

  @media (min-width: 48rem) {
    .reservation-page {
      inline-size: min(100% - 3rem, var(--container-max));
      padding-block-start: 5rem;
    }

    .reservation-page__grid {
      grid-template-columns: 1.15fr 0.85fr;
      align-items: start;
    }

    .form-layout--wide {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .form-field--wide,
    :global(.form-layout__submit--wide) {
      grid-column: 1 / -1;
    }
  }
</style>
