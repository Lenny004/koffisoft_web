<script lang="ts">
  import { resolve } from '$app/paths';
  import { Menu, X } from '@lucide/svelte';

  import '../app.css';

  let { children } = $props();
  let menuOpen = $state(false);

  const navigation = [
    { href: '/', label: 'Inicio' },
    { href: '/carta', label: 'Carta' },
    { href: '/reservas', label: 'Reservas' },
    { href: '/eventos', label: 'Eventos' },
  ] as const;
</script>

<svelte:head>
  <meta name="theme-color" content="#6f4e37" />
</svelte:head>

<div class="site-shell">
  <header class="site-header">
    <div class="site-header__inner">
      <a class="site-header__brand" href={resolve('/')} aria-label="Koffi-Soft, volver al inicio">
        <span class="site-header__mark" aria-hidden="true">K</span>
        <span>
          <span class="site-header__name">Koffi-Soft</span>
          <span class="site-header__tagline">Café en la Ruta Panorámica</span>
        </span>
      </a>

      <button
        class="site-header__toggle"
        type="button"
        aria-controls="primary-navigation"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        onclick={() => (menuOpen = !menuOpen)}
      >
        {#if menuOpen}
          <X size={22} aria-hidden="true" />
        {:else}
          <Menu size={22} aria-hidden="true" />
        {/if}
      </button>

      <nav
        id="primary-navigation"
        class:site-header__navigation--open={menuOpen}
        class="site-header__navigation"
        aria-label="Navegación principal"
      >
        {#each navigation as item (item.href)}
          <a class="site-header__link" href={resolve(item.href)} onclick={() => (menuOpen = false)}>
            {item.label}
          </a>
        {/each}
        <a class="site-header__cta" href={resolve('/reservas')} onclick={() => (menuOpen = false)}
          >Reservar mesa</a
        >
      </nav>
    </div>
  </header>

  <main class="site-shell__content">{@render children?.()}</main>

  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__identity">
        <p class="site-footer__name">Koffi-Soft</p>
        <p class="site-footer__copy">
          Café, paisaje y encuentros en la Ruta Panorámica de El Salvador.
        </p>
      </div>
      <div class="site-footer__contact">
        <p class="site-footer__label">Contacto</p>
        <p class="site-footer__line">
          Teléfono: <span class="site-footer__placeholder">por confirmar</span>
        </p>
        <p class="site-footer__line">
          Correo: <span class="site-footer__placeholder">por confirmar</span>
        </p>
      </div>
      <div class="site-footer__contact">
        <p class="site-footer__label">Visítanos</p>
        <p class="site-footer__line">Ruta Panorámica</p>
        <p class="site-footer__line">El Salvador · ubicación por confirmar</p>
      </div>
    </div>
    <p class="site-footer__legal">
      © {new Date().getFullYear()} Koffi-Soft. Información sujeta a confirmación.
    </p>
  </footer>
</div>

<style>
  /* El layout es dueño de la navegación global y conserva el contenido de las páginas desacoplado. */
  .site-shell {
    min-block-size: 100dvh;
    display: flex;
    flex-direction: column;
  }

  .site-shell__content {
    flex: 1;
  }

  .site-header {
    position: sticky;
    inset-block-start: 0;
    z-index: 10;
    border-block-end: 1px solid var(--border);
    background: color-mix(in oklab, var(--background) 92%, transparent);
    backdrop-filter: blur(12px);
  }

  .site-header__inner,
  .site-footer__inner {
    inline-size: min(100% - 2rem, var(--container-max));
    margin-inline: auto;
  }

  .site-header__inner {
    min-block-size: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-lg);
  }

  .site-header__brand {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    color: var(--foreground);
    text-decoration: none;
  }

  .site-header__mark {
    display: grid;
    place-items: center;
    inline-size: 2.5rem;
    block-size: 2.5rem;
    border-radius: var(--radius-full);
    color: var(--primary-foreground);
    background: var(--primary);
    font-family: Georgia, serif;
    font-size: 1.4rem;
    font-weight: 700;
  }

  .site-header__name,
  .site-header__tagline {
    display: block;
  }

  .site-header__name {
    font-family: Georgia, serif;
    font-size: 1.1rem;
    font-weight: 700;
  }

  .site-header__tagline {
    color: var(--muted-foreground);
    font-size: 0.72rem;
  }

  .site-header__toggle {
    display: grid;
    place-items: center;
    inline-size: 2.75rem;
    block-size: 2.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    color: var(--foreground);
    background: var(--card);
    cursor: pointer;
  }

  .site-header__navigation {
    position: absolute;
    inset-inline: 1rem;
    inset-block-start: 4.75rem;
    display: none;
    flex-direction: column;
    gap: 0.25rem;
    padding: var(--space-sm);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--card);
    box-shadow: var(--shadow-md);
  }

  .site-header__navigation--open {
    display: flex;
  }

  .site-header__link,
  .site-header__cta {
    padding: 0.65rem 0.8rem;
    border-radius: var(--radius-sm);
    color: var(--foreground);
    font-size: 0.95rem;
    text-decoration: none;
  }

  .site-header__link:hover,
  .site-header__link:focus-visible {
    background: var(--muted);
  }

  .site-header__cta {
    color: var(--primary-foreground);
    background: var(--primary);
    text-align: center;
  }

  .site-footer {
    margin-block-start: 5rem;
    padding-block: 3rem 1.5rem;
    color: var(--primary-foreground);
    background: var(--coffee-900);
  }

  .site-footer__inner {
    display: grid;
    gap: var(--space-xl);
  }

  .site-footer__name,
  .site-footer__label,
  .site-footer__copy,
  .site-footer__line {
    margin: 0;
  }

  .site-footer__name {
    font-family: Georgia, serif;
    font-size: 1.4rem;
    font-weight: 700;
  }

  .site-footer__copy,
  .site-footer__contact {
    color: color-mix(in oklab, var(--primary-foreground) 75%, transparent);
    font-size: 0.9rem;
  }

  .site-footer__label {
    margin-block-end: 0.45rem;
    color: var(--primary-foreground);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .site-footer__placeholder {
    color: var(--sand-300);
  }

  .site-footer__legal {
    inline-size: min(100% - 2rem, var(--container-max));
    margin: 2rem auto 0;
    padding-block-start: 1rem;
    border-block-start: 1px solid color-mix(in oklab, var(--primary-foreground) 20%, transparent);
    color: color-mix(in oklab, var(--primary-foreground) 60%, transparent);
    font-size: 0.8rem;
    text-align: center;
  }

  @media (min-width: 48rem) {
    .site-header__inner,
    .site-footer__inner {
      inline-size: min(100% - 3rem, var(--container-max));
    }

    .site-header__toggle {
      display: none;
    }

    .site-header__navigation {
      position: static;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.35rem;
      padding: 0;
      border: 0;
      background: transparent;
      box-shadow: none;
    }

    .site-header__cta {
      margin-inline-start: 0.35rem;
    }

    .site-footer__inner {
      grid-template-columns: 1.5fr 1fr 1fr;
    }
  }
</style>
