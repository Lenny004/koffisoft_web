<script lang="ts">
  import { Clock3 } from '@lucide/svelte';

  import ReservationFlow from '$lib/components/public/reservation-flow.svelte';
  import SectionHeading from '$lib/components/public/section-heading.svelte';
  import StatusMessage from '$lib/components/public/status-message.svelte';
  import type { PublicAvailabilityResponse } from '$lib/api/types';
  import type { PageProps } from './$types';

  type ReservationActionForm = {
    kind?: 'error' | 'success' | 'availability';
    message?: string;
    reservationCode?: string;
    availability?: PublicAvailabilityResponse;
    errors?: Record<string, string>;
  } | null;

  let { form, data }: { form: ReservationActionForm; data: PageProps['data'] } = $props();
</script>

<svelte:head>
  <title>Reservas | Koffi-Soft</title>
  <meta
    name="description"
    content="Elige personas, fecha y hora, y envía una solicitud de reserva para Koffi-Soft en la Ruta Panorámica."
  />
</svelte:head>

<div class="reservation-page">
  <SectionHeading
    level="h1"
    align="start"
    eyebrow="Tu mesa te espera"
    title="Reserva tu momento."
    description="Elige personas, fecha y hora. Después indicas la zona y tus datos. La reserva queda pendiente de confirmación por nuestro equipo."
  />

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

  <ReservationFlow {form} siteContent={data.siteContent} />

  <aside class="reservation-note">
    <Clock3 size={20} aria-hidden="true" />
    <p class="reservation-note__copy">
      <strong>Importante:</strong> la disponibilidad es una consulta inicial; tu reserva queda confirmada
      cuando nuestro equipo te contacte.
    </p>
  </aside>
</div>

<style>
  /* La página reutiliza el encabezado compartido y deja el asistente en su propio bloque. */
  .reservation-page {
    display: grid;
    gap: var(--space-xl);
    inline-size: min(100% - 2rem, var(--container-max));
    margin-inline: auto;
    padding-block: var(--space-2xl) var(--space-xl);
  }

  .reservation-note {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    border-radius: var(--radius-md);
    color: var(--accent-foreground);
    background: var(--accent);
  }

  .reservation-note__copy {
    margin: 0;
    font-size: var(--font-size-sm);
  }

  @media (min-width: 48rem) {
    .reservation-page {
      inline-size: min(100% - 3rem, var(--container-max));
    }
  }
</style>
