<script lang="ts">
  import { enhance } from '$app/forms';
  import { ArrowRight, CalendarDays, Users, Utensils } from '@lucide/svelte';

  import StatusMessage from '$lib/components/public/status-message.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Select } from '$lib/components/ui/select/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import type { PageData } from './$types';

  type EventActionForm = {
    kind?: 'error' | 'success';
    message?: string;
    eventCode?: string;
    errors?: Record<string, string>;
  } | null;

  let { data, form }: { data: PageData; form: EventActionForm } = $props();

  const eventTypes = [
    { value: 'Wedding', label: 'Boda' },
    { value: 'Birthday', label: 'Cumpleaños' },
    { value: 'Corporate', label: 'Evento corporativo' },
    { value: 'Meeting', label: 'Reunión' },
    { value: 'Anniversary', label: 'Aniversario' },
    { value: 'Other', label: 'Otro' },
  ];
</script>

<svelte:head>
  <title>Eventos | Koffi-Soft</title>
  <meta
    name="description"
    content="Conoce los espacios públicos para eventos de Koffi-Soft y solicita una cotización para tu celebración."
  />
</svelte:head>

<div class="event-page">
  <header class="event-page__header">
    <p class="event-page__eyebrow">Reuniones con otra perspectiva</p>
    <h1 class="event-page__title">Tu evento, con vista.</h1>
    <p class="event-page__intro">
      Conoce los espacios disponibles para eventos privados y cuéntanos qué tienes en mente. Te
      ayudaremos a darle forma.
    </p>
  </header>

  {#if form?.kind === 'success'}
    <StatusMessage
      title="Solicitud recibida"
      message={`${form.message} Código: ${form.eventCode}.`}
    />
  {:else if form?.kind === 'error'}
    <StatusMessage
      title="No pudimos completar la solicitud"
      message={form.message ?? 'Revisa los datos e intenta de nuevo.'}
      variant="destructive"
    />
  {/if}

  {#if data.errorMessage}
    <StatusMessage
      title="Catálogo no disponible"
      message={data.errorMessage}
      variant="destructive"
    />
  {:else if !data.catalog || (data.catalog.spaces.length === 0 && data.catalog.packages.length === 0)}
    <StatusMessage
      title="Información de eventos en preparación"
      message="Los espacios y paquetes visibles aparecerán aquí cuando estén publicados para la sede."
    />
  {:else}
    <section class="event-catalog" aria-labelledby="event-catalog-title">
      <div class="event-catalog__heading">
        <div>
          <p class="event-page__eyebrow">Espacios y opciones</p>
          <h2 id="event-catalog-title" class="event-catalog__title">
            Encuentra el lugar para tu ocasión.
          </h2>
        </div>
      </div>

      {#if data.catalog.spaces.length > 0}
        <div class="event-catalog__group">
          <h3 class="event-catalog__group-title">Espacios</h3>
          <div class="event-catalog__grid">
            {#each data.catalog.spaces as space (space.id)}
              <Card class="event-card">
                <CardHeader>
                  <div class="event-card__icon" aria-hidden="true"><CalendarDays size={20} /></div>
                  <CardTitle class="event-card__title">{space.nameEs}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="event-card__type">{space.spaceType}</p>
                  <p class="event-card__capacity">
                    Hasta {space.seatedCapacity} personas sentadas{space.standingCapacity
                      ? ` · ${space.standingCapacity} de pie`
                      : ''}
                  </p>
                </CardContent>
              </Card>
            {/each}
          </div>
        </div>
      {/if}

      {#if data.catalog.packages.length > 0}
        <div class="event-catalog__group">
          <h3 class="event-catalog__group-title">Paquetes</h3>
          <div class="event-catalog__grid">
            {#each data.catalog.packages as eventPackage (eventPackage.id)}
              <Card class="event-card">
                <CardHeader>
                  <div class="event-card__icon" aria-hidden="true"><Utensils size={20} /></div>
                  <CardTitle class="event-card__title">{eventPackage.nameEs}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="event-card__description">
                    {eventPackage.descriptionEs ?? 'Una opción para conversar sobre tu evento.'}
                  </p>
                  <p class="event-card__capacity">
                    Disponible para cotización personalizada{eventPackage.minGuestCount
                      ? ` desde ${eventPackage.minGuestCount} invitados`
                      : ''}.
                  </p>
                </CardContent>
              </Card>
            {/each}
          </div>
        </div>
      {/if}
    </section>
  {/if}

  <section class="event-form-section" aria-labelledby="event-form-title">
    <div class="event-form-section__heading">
      <p class="event-page__eyebrow">Solicitud de cotización</p>
      <h2 id="event-form-title" class="event-form-section__title">Cuéntanos tu idea.</h2>
      <p class="event-form-section__copy">
        La solicitud abre una conversación con nuestro equipo; la cotización se prepara después.
      </p>
    </div>
    <Card>
      <CardContent>
        <form class="form-layout" method="POST" use:enhance>
          <div class="form-field">
            <Label for="event-type">Tipo de evento</Label>
            <Select id="event-type" name="eventType" required>
              <option value="">Selecciona una opción</option>
              {#each eventTypes as eventType (eventType.value)}
                <option value={eventType.value}>{eventType.label}</option>
              {/each}
            </Select>
            {#if form?.errors?.eventType}<span class="form-field__error"
                >{form.errors.eventType}</span
              >{/if}
          </div>
          <div class="form-field">
            <Label for="event-title">Título del evento</Label>
            <Input id="event-title" name="title" placeholder="Ej. Celebración familiar" required />
            {#if form?.errors?.title}<span class="form-field__error">{form.errors.title}</span>{/if}
          </div>
          <div class="form-field">
            <Label for="event-contact-name">Nombre de contacto</Label>
            <Input id="event-contact-name" name="contactName" autocomplete="name" required />
            {#if form?.errors?.contactName}<span class="form-field__error"
                >{form.errors.contactName}</span
              >{/if}
          </div>
          <div class="form-field">
            <Label for="event-contact-phone">Teléfono</Label>
            <Input
              id="event-contact-phone"
              name="contactPhone"
              type="tel"
              autocomplete="tel"
              required
            />
            {#if form?.errors?.contactPhone}<span class="form-field__error"
                >{form.errors.contactPhone}</span
              >{/if}
          </div>
          <div class="form-field">
            <Label for="event-contact-email"
              >Correo electrónico <span class="form-field__optional">(opcional)</span></Label
            >
            <Input id="event-contact-email" name="contactEmail" type="email" autocomplete="email" />
            {#if form?.errors?.contactEmail}<span class="form-field__error"
                >{form.errors.contactEmail}</span
              >{/if}
          </div>
          <div class="form-field">
            <Label for="event-guests">Invitados estimados</Label>
            <Input
              id="event-guests"
              name="estimatedGuestCount"
              type="number"
              min="1"
              max="10000"
              required
            />
            {#if form?.errors?.estimatedGuestCount}<span class="form-field__error"
                >{form.errors.estimatedGuestCount}</span
              >{/if}
          </div>
          <div class="form-field">
            <Label for="event-start">Inicio</Label>
            <Input id="event-start" name="startsAt" type="datetime-local" required />
            {#if form?.errors?.startsAt}<span class="form-field__error">{form.errors.startsAt}</span
              >{/if}
          </div>
          <div class="form-field">
            <Label for="event-end">Finalización</Label>
            <Input id="event-end" name="endsAt" type="datetime-local" required />
            {#if form?.errors?.endsAt}<span class="form-field__error">{form.errors.endsAt}</span
              >{/if}
          </div>
          <div class="form-field">
            <Label for="event-budget"
              >Presupuesto estimado <span class="form-field__optional">(opcional)</span></Label
            >
            <Input
              id="event-budget"
              name="budgetTarget"
              inputmode="decimal"
              placeholder="Ej. 500.00"
            />
            {#if form?.errors?.budgetTarget}<span class="form-field__error"
                >{form.errors.budgetTarget}</span
              >{/if}
          </div>
          <div class="form-field form-field--wide">
            <Label for="event-requirements"
              >Requisitos especiales <span class="form-field__optional">(opcional)</span></Label
            >
            <Textarea
              id="event-requirements"
              name="specialRequirements"
              rows="5"
              placeholder="Cuéntanos sobre montaje, alimentación, accesibilidad o cualquier detalle importante."
            />
          </div>
          <Button type="submit" size="lg" class="form-layout__submit form-field--wide">
            Solicitar cotización <ArrowRight size={17} aria-hidden="true" />
          </Button>
        </form>
      </CardContent>
    </Card>
  </section>

  <aside class="event-note">
    <Users size={20} aria-hidden="true" />
    <p class="event-note__copy">
      Los precios de paquetes no se publican en esta vista. Nuestro equipo preparará una cotización
      según tu evento.
    </p>
  </aside>
</div>

<style>
  /* El catálogo presenta capacidades públicas; los importes se mantienen dentro del flujo de cotización. */
  .event-page {
    inline-size: min(100% - 2rem, var(--container-max));
    margin-inline: auto;
    padding-block: 3rem 1rem;
  }

  .event-page__header {
    max-inline-size: 48rem;
    margin-block-end: 3rem;
  }

  .event-page__eyebrow {
    margin: 0 0 0.5rem;
    color: var(--primary);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .event-page__title,
  .event-catalog__title,
  .event-form-section__title {
    margin: 0;
    font-family: Georgia, serif;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 0.95;
  }

  .event-page__title {
    font-size: clamp(2.8rem, 8vw, 5rem);
  }

  .event-page__intro,
  .event-form-section__copy {
    margin: var(--space-lg) 0 0;
    color: var(--muted-foreground);
    font-size: 1.1rem;
  }

  .event-catalog {
    display: grid;
    gap: 2.5rem;
  }

  .event-catalog__heading {
    display: flex;
    justify-content: space-between;
  }

  .event-catalog__title {
    max-inline-size: 22ch;
    font-size: clamp(2rem, 5vw, 3.5rem);
  }

  .event-catalog__group {
    display: grid;
    gap: var(--space-lg);
  }

  .event-catalog__group-title {
    margin: 0;
    font-family: Georgia, serif;
    font-size: 1.4rem;
  }

  .event-catalog__grid {
    display: grid;
    gap: var(--space-lg);
  }

  :global(.event-card) {
    overflow: hidden;
  }

  .event-card__icon {
    display: grid;
    place-items: center;
    inline-size: 2.5rem;
    block-size: 2.5rem;
    margin-block-end: 0.85rem;
    border-radius: var(--radius-full);
    color: var(--primary-foreground);
    background: var(--primary);
  }

  :global(.event-card__title) {
    font-family: Georgia, serif;
    font-size: 1.25rem;
  }

  .event-card__type,
  .event-card__capacity,
  .event-card__description {
    margin: 0;
    color: var(--muted-foreground);
    font-size: 0.9rem;
  }

  .event-card__capacity {
    margin-block-start: 0.5rem;
  }

  .event-form-section {
    display: grid;
    gap: var(--space-xl);
    margin-block: 5rem 2rem;
  }

  .event-form-section__title {
    font-size: clamp(2.2rem, 5vw, 3.5rem);
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
  }

  .event-note {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-block: 2rem 4rem;
    padding: var(--space-lg);
    border-radius: var(--radius-md);
    color: var(--accent-foreground);
    background: var(--accent);
  }

  .event-note__copy {
    margin: 0;
    font-size: 0.9rem;
  }

  @media (min-width: 48rem) {
    .event-page {
      inline-size: min(100% - 3rem, var(--container-max));
      padding-block-start: 5rem;
    }

    .event-catalog__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .event-form-section .form-layout {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .form-field--wide {
      grid-column: 1 / -1;
    }
  }
</style>
