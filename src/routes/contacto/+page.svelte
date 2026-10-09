<script lang="ts">
  import { enhance } from '$app/forms';
  import { Mail, MapPin, MessageCircle, Phone, Send } from '@lucide/svelte';

  import { siteContent, editorialPlaceholder } from '$lib/content/site';
  import StatusMessage from '$lib/components/public/status-message.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import FormField from '$lib/components/ui/form-field.svelte';
  import { FORM_LIMITS } from '$lib/validation/limits';

  type ContactActionForm = {
    kind?: 'error' | 'success';
    message?: string;
    errors?: Record<string, string>;
  } | null;

  let { form }: { form: ContactActionForm } = $props();
</script>

<svelte:head>
  <title>Contacto | Koffi-Soft</title>
  <meta
    name="description"
    content="Encuentra los canales de contacto de Koffi-Soft y envía tu mensaje."
  />
</svelte:head>

<div class="contact-page">
  <header class="contact-page__header">
    <p class="contact-page__eyebrow">Estamos para escucharte</p>
    <h1 class="contact-page__title">Hablemos.</h1>
    <p class="contact-page__intro">
      Escríbenos para conocer más sobre la carta, tu visita o una experiencia para compartir.
    </p>
  </header>

  {#if form?.kind === 'success'}
    <StatusMessage title="Mensaje preparado" message={form.message ?? ''} />
  {:else if form?.kind === 'error'}
    <StatusMessage
      title="No pudimos validar el mensaje"
      message={form.message ?? ''}
      variant="destructive"
    />
  {/if}

  <div class="contact-page__grid">
    <section class="contact-page__details" aria-labelledby="contact-details-title">
      <h2 id="contact-details-title">Encuentra tu camino</h2>
      <p>Los datos que ves aquí son contenido provisional y deben confirmarse antes de publicar.</p>
      <div class="contact-page__detail-list">
        <p>
          <Mail class="contact-page__detail-icon" size={19} aria-hidden="true" /><span
            ><strong>Correo</strong>{siteContent.contact.email}</span
          >
        </p>
        <p>
          <Phone class="contact-page__detail-icon" size={19} aria-hidden="true" /><span
            ><strong>Teléfono</strong>{siteContent.contact.phone}</span
          >
        </p>
        <p>
          <MapPin class="contact-page__detail-icon" size={19} aria-hidden="true" /><span
            ><strong>Ubicación</strong>{siteContent.contact.address}</span
          >
        </p>
        <p>
          <MessageCircle class="contact-page__detail-icon" size={19} aria-hidden="true" /><span
            ><strong>Horario</strong>{siteContent.contact.hours}</span
          >
        </p>
      </div>
    </section>

    <section class="contact-form" aria-labelledby="contact-form-title">
      <div class="contact-form__heading">
        <p class="contact-page__eyebrow">
          {editorialPlaceholder ? 'Contenido provisional' : 'Contacto'}
        </p>
        <h2 id="contact-form-title">Solicitar información</h2>
      </div>
      <form method="POST" use:enhance>
        <p class="form-legend">
          <span class="form-field__required" aria-hidden="true">*</span> Campo obligatorio
        </p>
        <FormField id="contact-name" label="Nombre" required error={form?.errors?.name}>
          <Input
            id="contact-name"
            name="name"
            autocomplete="name"
            placeholder="Ej. Ana Martínez"
            maxlength={FORM_LIMITS.contact.nameMaxLength}
            required
            aria-invalid={Boolean(form?.errors?.name)}
          />
        </FormField>
        <FormField
          id="contact-email"
          label="Correo electrónico"
          required
          error={form?.errors?.email}
        >
          <Input
            id="contact-email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="Ej. ana@correo.com"
            maxlength={FORM_LIMITS.contact.emailMaxLength}
            required
            aria-invalid={Boolean(form?.errors?.email)}
          />
        </FormField>
        <FormField id="contact-phone" label="Teléfono (opcional)" error={form?.errors?.phone}>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            inputmode="tel"
            autocomplete="tel"
            placeholder="Ej. +503 7000 0000"
            maxlength={FORM_LIMITS.contact.phoneMaxLength}
            aria-invalid={Boolean(form?.errors?.phone)}
          />
        </FormField>
        <FormField
          id="contact-message"
          label="Mensaje"
          required
          error={form?.errors?.message}
          class="form-field--wide"
        >
          <Textarea
            id="contact-message"
            name="message"
            rows="5"
            placeholder="Cuéntanos cómo podemos ayudarte."
            minlength={FORM_LIMITS.contact.messageMinLength}
            maxlength={FORM_LIMITS.contact.messageMaxLength}
            required
            aria-invalid={Boolean(form?.errors?.message)}
          />
        </FormField>
        <Button type="submit" size="lg">Enviar mensaje <Send size={17} aria-hidden="true" /></Button
        >
      </form>
    </section>
  </div>
</div>

<style>
  /* El formulario valida entrada en servidor y comunica con claridad que falta el endpoint de envío. */
  .contact-page {
    inline-size: min(calc(100% - 2rem), var(--container-max));
    margin-inline: auto;
    padding-block: var(--space-2xl) var(--space-xl);
  }

  .contact-page__header {
    max-inline-size: 42rem;
    margin-block-end: var(--space-xl);
  }

  .contact-page__eyebrow {
    margin: 0 0 var(--space-xs);
    color: var(--primary);
    font-size: 0.75rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .contact-page__title {
    margin: 0;
    font-size: clamp(3rem, 8vw, 5.5rem);
  }

  .contact-page__intro,
  .contact-page__details > p {
    margin: var(--space-lg) 0 0;
    color: var(--text-muted);
    font-size: var(--font-size-lg);
  }

  .contact-page__grid {
    display: grid;
    gap: var(--space-xl);
  }

  .contact-page__details,
  .contact-form {
    padding: clamp(var(--space-lg), 4vw, var(--space-xl));
    background: var(--surface-warm);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
  }

  .contact-page__details h2,
  .contact-form h2 {
    margin: 0;
    font-size: 2rem;
  }

  .contact-page__detail-list {
    display: grid;
    gap: var(--space-md);
    margin-block-start: var(--space-xl);
  }

  .contact-page__detail-list p {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
    margin: 0;
  }

  :global(.contact-page__detail-icon) {
    flex: 0 0 auto;
    color: var(--primary);
  }

  .contact-page__detail-list span {
    display: grid;
    gap: 0.2rem;
  }

  .contact-page__detail-list strong {
    font-size: var(--font-size-sm);
  }

  .contact-form__heading {
    margin-block-end: var(--space-lg);
  }

  .contact-form form {
    display: grid;
    gap: var(--space-md);
  }

  @media (min-width: 48rem) {
    .contact-page {
      inline-size: min(calc(100% - 3rem), var(--container-max));
    }

    .contact-page__grid {
      grid-template-columns: 0.85fr 1.15fr;
      align-items: start;
    }

    .contact-form form {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
