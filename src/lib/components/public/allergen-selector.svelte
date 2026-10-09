<script lang="ts">
  import { Bean, CircleAlert, Egg, Fish, Leaf, Milk, Nut, Wheat } from '@lucide/svelte';

  export type AllergenOption = { code: string; label: string };

  let {
    options,
    selected = [] as string[],
    onChange,
  } = $props<{
    options: AllergenOption[];
    selected?: string[];
    onChange: (codes: string[]) => void;
  }>();

  const icons = [Wheat, Milk, Egg, Fish, Nut, Nut, Wheat, Fish, Leaf, Bean, Leaf, CircleAlert];

  function toggle(code: string): void {
    onChange(
      selected.includes(code)
        ? selected.filter((item: string) => item !== code)
        : [...selected, code],
    );
  }
</script>

<div class="allergen-selector" role="group" aria-label="Selecciona alérgenos">
  {#each options as option, index (option.code)}
    {@const Icon = icons[index] ?? CircleAlert}
    <button
      class:is-selected={selected.includes(option.code)}
      class="allergen-selector__option"
      type="button"
      aria-pressed={selected.includes(option.code)}
      onclick={() => toggle(option.code)}
    >
      <span class="allergen-selector__icon" aria-hidden="true"><Icon size={22} /></span>
      <span>{option.label}</span>
    </button>
  {/each}
</div>

<style>
  /* Selector de botones reales: la selección queda disponible para teclado y lectores de pantalla. */
  .allergen-selector {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-sm);
  }

  .allergen-selector__option {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    min-block-size: 4rem;
    padding: var(--space-sm);
    color: var(--foreground);
    text-align: start;
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast),
      border-color var(--transition-fast);
  }

  .allergen-selector__option:hover {
    border-color: var(--primary);
  }

  .allergen-selector__option.is-selected {
    color: var(--primary-foreground);
    background: var(--primary);
    border-color: var(--primary);
  }

  .allergen-selector__icon {
    display: grid;
    flex: 0 0 2.5rem;
    place-items: center;
    inline-size: 2.5rem;
    block-size: 2.5rem;
    color: var(--primary);
    background: var(--surface-warm);
    border-radius: var(--radius-full);
  }

  .allergen-selector__option.is-selected .allergen-selector__icon {
    color: var(--primary);
    background: var(--primary-foreground);
  }

  @media (min-width: 40rem) {
    .allergen-selector {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (min-width: 64rem) {
    .allergen-selector {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
</style>
