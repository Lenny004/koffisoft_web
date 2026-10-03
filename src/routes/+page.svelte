<script lang="ts">
  import { ArrowRight } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button/index.js';
</script>

<svelte:head>
  <title>Koffi-Soft | Café</title>
  <meta
    name="description"
    content="Base inicial del sitio público de Koffi-Soft, cafetería y plataforma digital."
  />
</svelte:head>

<main class="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
  <section
    class="grid gap-8 rounded-3xl bg-card p-8 shadow-sm ring-1 ring-border md:grid-cols-2 md:p-12"
  >
    <div class="space-y-6">
      <p class="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Koffi-Soft</p>
      <h1 class="text-4xl font-semibold tracking-tight md:text-5xl">
        La base digital de nuestra cafetería.
      </h1>
      <p class="max-w-xl text-lg text-muted-foreground">
        Este placeholder confirma que el sitio público SvelteKit está listo para recibir el
        catálogo, las reservaciones y las páginas institucionales definidas en el plan de
        modernización.
      </p>
      <Button href="/" aria-label="Conocer el estado del sitio">
        Base lista
        <ArrowRight class="ml-2 size-4" />
      </Button>
    </div>
    <div class="flex items-center justify-center rounded-2xl bg-secondary p-10">
      <div class="space-y-3 text-center">
        <div class="text-6xl" aria-hidden="true">☕</div>
        <p class="font-medium">Próximamente, nuestro menú.</p>
        <p class="text-sm text-muted-foreground">Fase 0 · Esqueleto funcional</p>
      </div>
    </div>
  </section>
</main>
