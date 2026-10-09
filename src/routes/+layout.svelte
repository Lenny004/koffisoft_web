<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import {
    ArrowUpRight,
    Camera,
    Mail,
    MapPin,
    Menu,
    MessageCircle,
    Moon,
    Mountain,
    Music2,
    Phone,
    Sun,
    X,
  } from '@lucide/svelte';

  import '../app.css';

  let { children } = $props();
  let menuOpen = $state(false);
  let darkMode = $state(false);

  const navigation = [
    { href: '/', label: 'Inicio' },
    { href: '/carta', label: 'Carta' },
    { href: '/promociones', label: 'Promociones' },
    { href: '/reservas', label: 'Reservas' },
    { href: '/eventos', label: 'Eventos' },
  ] as const;

  function isActive(href: string): boolean {
    return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
  }

  function toggleTheme(): void {
    darkMode = !darkMode;
    const theme = darkMode ? 'dark' : 'light';
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    try {
      localStorage.setItem('koffi-theme', theme);
    } catch {
      // La sesión sigue funcionando aunque el navegador bloquee el almacenamiento local.
    }
  }

  onMount(() => {
    darkMode = document.documentElement.dataset.theme === 'dark';
  });
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && (menuOpen = false)} />

<svelte:head>
  <meta name="theme-color" content="#173a2a" />
  <meta name="description" content="Koffi-Soft: café, cocina y montaña en la Ruta Panorámica." />
</svelte:head>

<div class="site-shell">
  <header class="site-header">
    <div class="site-header__inner">
      <a class="site-header__brand" href={resolve('/')} aria-label="Koffi-Soft, volver al inicio">
        <img class="site-header__logo" src="/brand/logo-primary.png" alt="Koffi-Soft" />
        <span class="site-header__brand-copy">
          <span class="site-header__name">Koffi-Soft</span>
          <span class="site-header__tagline">Café y montaña</span>
        </span>
      </a>

      <div class="site-header__actions">
        <button
          class="site-header__theme"
          type="button"
          aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
          aria-pressed={darkMode}
          onclick={toggleTheme}
        >
          {#if darkMode}<Sun size={19} aria-hidden="true" />{:else}<Moon
              size={19}
              aria-hidden="true"
            />{/if}
        </button>
        <button
          class="site-header__toggle"
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onclick={() => (menuOpen = !menuOpen)}
        >
          {#if menuOpen}<X size={22} aria-hidden="true" />{:else}<Menu
              size={22}
              aria-hidden="true"
            />{/if}
        </button>
      </div>

      <nav
        id="primary-navigation"
        class:site-header__navigation--open={menuOpen}
        class="site-header__navigation"
        aria-label="Navegación principal"
      >
        {#each navigation as item (item.href)}
          <a
            class:site-header__link--active={isActive(item.href)}
            class="site-header__link"
            href={resolve(item.href)}
            aria-current={isActive(item.href) ? 'page' : undefined}
            onclick={() => (menuOpen = false)}>{item.label}</a
          >
        {/each}
        <a class="site-header__cta" href={resolve('/reservas')} onclick={() => (menuOpen = false)}>
          Reservar mesa <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </nav>
    </div>
    {#if menuOpen}<button
        class="site-header__backdrop"
        type="button"
        aria-label="Cerrar menú"
        onclick={() => (menuOpen = false)}
      ></button>{/if}
  </header>

  <main class="site-shell__content">{@render children?.()}</main>

  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__identity">
        <img class="site-footer__logo" src="/brand/logo-light.png" alt="Koffi-Soft" />
        <p class="site-footer__copy">Café, cocina y encuentros con vista a la montaña.</p>
        <div class="site-footer__social" aria-label="Redes sociales">
          <a href="https://www.facebook.com" aria-label="Facebook de Koffi-Soft"
            ><MessageCircle size={19} aria-hidden="true" /></a
          >
          <a href="https://www.instagram.com" aria-label="Instagram de Koffi-Soft"
            ><Camera size={19} aria-hidden="true" /></a
          >
          <a href="https://www.tiktok.com" aria-label="TikTok de Koffi-Soft"
            ><Music2 size={19} aria-hidden="true" /></a
          >
        </div>
      </div>

      <div class="site-footer__column">
        <p class="site-footer__label">Descubre</p>
        <a href={resolve('/carta')}>Carta</a>
        <a href={resolve('/promociones')}>Promociones</a>
        <a href={resolve('/senderismo')}>Senderismo</a>
        <a href={resolve('/nosotros')}>Nosotros</a>
      </div>

      <div class="site-footer__column">
        <p class="site-footer__label">Planifica tu visita</p>
        <a href={resolve('/reservas')}>Reservas</a>
        <a href={resolve('/eventos')}>Eventos</a>
        <a href={resolve('/ubicacion')}><MapPin size={15} aria-hidden="true" /> Ubicación</a>
        <a href={resolve('/contacto')}><Mail size={15} aria-hidden="true" /> Contacto</a>
      </div>

      <div class="site-footer__column site-footer__column--contact">
        <p class="site-footer__label">Ruta Panorámica</p>
        <p><MapPin size={15} aria-hidden="true" /> El Salvador</p>
        <p><Phone size={15} aria-hidden="true" /> Teléfono por confirmar</p>
        <p><Mountain size={15} aria-hidden="true" /> Horario por confirmar</p>
      </div>
    </div>
    <div class="site-footer__bottom">
      <span>© {new Date().getFullYear()} Koffi-Soft</span>
      <span class="site-footer__legal-links">
        <a href={resolve('/legal')}>Términos</a>
        <a href={resolve('/privacidad')}>Privacidad</a>
      </span>
    </div>
  </footer>
</div>

<style>
  /* Shell público único: la navegación se presenta como offcanvas en móvil sin duplicar el DOM. */
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
    z-index: var(--z-sticky);
    color: var(--foreground);
    background: color-mix(in oklab, var(--background) 92%, transparent);
    border-block-end: 1px solid var(--border);
    backdrop-filter: blur(1rem);
  }

  .site-header__inner,
  .site-footer__inner,
  .site-footer__bottom {
    inline-size: min(calc(100% - 2rem), var(--container-max));
    margin-inline: auto;
  }

  .site-header__inner {
    position: relative;
    min-block-size: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
  }

  .site-header__brand {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    color: var(--foreground);
    text-decoration: none;
  }

  .site-header__logo {
    inline-size: 2.8rem;
    block-size: 2.8rem;
    object-fit: contain;
  }

  .site-header__brand-copy {
    display: grid;
    gap: 0.1rem;
  }

  .site-header__name {
    font-family: var(--font-family-display);
    font-size: 1.25rem;
    font-weight: var(--font-weight-bold);
  }

  .site-header__tagline {
    color: var(--text-muted);
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .site-header__actions {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    margin-inline-start: auto;
  }

  .site-header__theme,
  .site-header__toggle {
    display: grid;
    place-items: center;
    inline-size: 2.75rem;
    block-size: 2.75rem;
    color: var(--foreground);
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    cursor: pointer;
  }

  .site-header__theme:hover,
  .site-header__toggle:hover {
    color: var(--primary-foreground);
    background: var(--primary);
  }

  .site-header__navigation {
    position: fixed;
    inset-block: 0;
    inset-inline-end: 0;
    z-index: var(--z-modal);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    inline-size: min(20rem, 86vw);
    padding: 6rem var(--space-lg) var(--space-lg);
    background: var(--surface-brand);
    box-shadow: var(--shadow-lg);
    transform: translateX(100%);
    visibility: hidden;
    transition: transform var(--transition-base);
  }

  .site-header__navigation--open {
    transform: translateX(0);
    visibility: visible;
  }

  .site-header__link,
  .site-header__cta {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
    padding: 0.75rem var(--space-sm);
    color: var(--text-on-brand);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
    text-decoration: none;
  }

  .site-header__link:hover,
  .site-header__link--active {
    background: color-mix(in oklab, var(--primary) 45%, transparent);
  }

  .site-header__cta {
    margin-block-start: var(--space-sm);
    color: var(--primary-foreground);
    background: var(--primary);
    font-weight: var(--font-weight-bold);
  }

  .site-header__backdrop {
    position: fixed;
    inset: 0;
    z-index: calc(var(--z-modal) - 1);
    background: color-mix(in oklab, var(--coffee-950) 50%, transparent);
    border: 0;
    cursor: pointer;
  }

  .site-footer {
    margin-block-start: var(--space-2xl);
    padding-block: var(--space-2xl) var(--space-lg);
    color: var(--text-on-brand);
    background: var(--surface-brand);
  }

  .site-footer__inner {
    display: grid;
    gap: var(--space-xl);
  }

  .site-footer__identity {
    max-inline-size: 18rem;
  }

  .site-footer__logo {
    inline-size: 5rem;
    block-size: 5rem;
    object-fit: contain;
  }

  .site-footer__copy,
  .site-footer__column p {
    margin: var(--space-sm) 0 0;
    color: color-mix(in oklab, var(--text-on-brand) 76%, transparent);
    font-size: var(--font-size-sm);
  }

  .site-footer__social {
    display: flex;
    gap: var(--space-sm);
    margin-block-start: var(--space-md);
  }

  .site-footer__social a {
    display: grid;
    place-items: center;
    inline-size: 2.5rem;
    block-size: 2.5rem;
    color: var(--text-on-brand);
    border: 1px solid color-mix(in oklab, var(--text-on-brand) 40%, transparent);
    border-radius: var(--radius-full);
  }

  .site-footer__column {
    display: grid;
    align-content: start;
    gap: var(--space-sm);
  }

  .site-footer__column a,
  .site-footer__column p {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    margin: 0;
    color: color-mix(in oklab, var(--text-on-brand) 82%, transparent);
    font-size: var(--font-size-sm);
    text-decoration: none;
  }

  .site-footer__column a:hover,
  .site-footer__social a:hover {
    color: var(--text-on-brand);
    border-color: var(--text-on-brand);
  }

  .site-footer__column .site-footer__label {
    margin-block-end: var(--space-xs);
    color: var(--text-on-brand);
    font-size: 0.75rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .site-footer__bottom {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--space-md);
    margin-block-start: var(--space-xl);
    padding-block-start: var(--space-md);
    color: color-mix(in oklab, var(--text-on-brand) 62%, transparent);
    border-block-start: 1px solid color-mix(in oklab, var(--text-on-brand) 22%, transparent);
    font-size: 0.8rem;
  }

  .site-footer__legal-links {
    display: flex;
    gap: var(--space-md);
  }

  .site-footer__legal-links a {
    color: inherit;
    text-decoration: none;
  }

  @media (min-width: 48rem) {
    .site-header__inner,
    .site-footer__inner,
    .site-footer__bottom {
      inline-size: min(calc(100% - 3rem), var(--container-max));
    }

    .site-header__toggle {
      display: none;
    }

    .site-header__navigation {
      position: static;
      flex-direction: row;
      align-items: center;
      inline-size: auto;
      padding: 0;
      background: transparent;
      box-shadow: none;
      transform: none;
      visibility: visible;
    }

    .site-header__link,
    .site-header__cta {
      padding: 0.55rem 0.65rem;
      color: var(--foreground);
    }

    .site-header__link:hover,
    .site-header__link--active {
      color: var(--primary);
      background: var(--surface-warm);
    }

    .site-header__cta {
      margin-block-start: 0;
      margin-inline-start: var(--space-xs);
      color: var(--primary-foreground);
    }

    .site-footer__inner {
      grid-template-columns: 1.4fr repeat(3, 1fr);
    }
  }
</style>
