<script lang="ts">
  /**
   * Combobox accesible: select nativo sin JS y, tras hidratar, búsqueda con Command/Popover.
   */
  import CheckIcon from '@lucide/svelte/icons/check';
  import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
  import { onMount, tick } from 'svelte';

  import * as Command from '$lib/components/ui/command/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { cn } from '$lib/utils.js';
  import type { ComboboxOption } from './types';

  let {
    id,
    name,
    required = false,
    disabled = false,
    placeholder,
    searchPlaceholder = 'Buscar…',
    emptyText = 'No hay coincidencias.',
    options,
    value = $bindable(''),
    allowEmpty = false,
    invalid = false,
    class: className = '',
    onValueChange,
  }: {
    id: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder: string;
    searchPlaceholder?: string;
    emptyText?: string;
    options: ComboboxOption[];
    value?: string;
    allowEmpty?: boolean;
    invalid?: boolean;
    class?: string;
    onValueChange?: (next: string) => void;
  } = $props();

  let open = $state(false);
  let enhanced = $state(false);
  let triggerRef = $state<HTMLButtonElement | null>(null);

  const selected = $derived(options.find((option) => option.value === value));
  const displayLabel = $derived(selected?.label ?? placeholder);
  const nativeId = $derived(enhanced ? `${id}-native` : id);

  onMount(() => {
    enhanced = true;
  });

  /** Actualiza el valor enlazado y notifica al padre mediante `onValueChange`. */
  function emit(next: string): void {
    value = next;
    onValueChange?.(next);
  }

  /** Cierra el popover y devuelve el foco al botón disparador para continuar con teclado. */
  function closeAndFocusTrigger(): void {
    open = false;
    void tick().then(() => triggerRef?.focus());
  }

  /** Confirma una opción (permitiendo vaciar si `allowEmpty`) y cierra el desplegable. */
  function choose(next: string): void {
    emit(allowEmpty && next === value ? '' : next);
    closeAndFocusTrigger();
  }

  /** Propaga cambios del `<select>` nativo usado antes de la mejora progresiva. */
  function handleNativeChange(event: Event): void {
    const target = event.currentTarget;
    if (target instanceof HTMLSelectElement) emit(target.value);
  }
</script>

<!--
  Sin JS se ve el select nativo (formularios y required). Tras hidratar,
  el select queda accesible solo para envío y el Command/Popover toma el teclado.
-->
<div class={cn('combobox', enhanced ? 'is-enhanced' : undefined, className)}>
  <select
    id={nativeId}
    class="combobox__native field-control"
    {name}
    {required}
    {disabled}
    bind:value
    tabindex={enhanced ? -1 : 0}
    aria-hidden={enhanced ? 'true' : undefined}
    aria-invalid={invalid || undefined}
    onchange={handleNativeChange}
  >
    <option value="">{placeholder}</option>
    {#each options as option (option.value || option.label)}
      <option value={option.value} disabled={option.disabled}>{option.label}</option>
    {/each}
  </select>

  {#if enhanced}
    <Popover.Root bind:open>
      <Popover.Trigger bind:ref={triggerRef}>
        {#snippet child({ props })}
          <button
            {...props}
            {id}
            type="button"
            class="combobox__trigger field-control"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={`${id}-list`}
            aria-invalid={invalid || undefined}
            {disabled}
          >
            <span class="combobox__value" class:combobox__value--placeholder={!selected}>
              {displayLabel}
            </span>
            <ChevronsUpDownIcon class="combobox__icon size-4 shrink-0" aria-hidden="true" />
          </button>
        {/snippet}
      </Popover.Trigger>
      <Popover.Content
        class="z-[var(--z-modal)] w-[var(--bits-popover-anchor-width)] p-0"
        align="start"
        strategy="fixed"
        trapFocus={true}
      >
        <Command.Root label={placeholder}>
          <Command.Input placeholder={searchPlaceholder} autofocus />
          <Command.List id={`${id}-list`} aria-label="Sugerencias">
            <Command.Empty>{emptyText}</Command.Empty>
            <Command.Group>
              {#each options as option (option.value || option.label)}
                <Command.Item
                  value={`${option.label} ${option.value}`.trim()}
                  keywords={option.keywords}
                  disabled={option.disabled}
                  data-checked={value === option.value}
                  onSelect={() => choose(option.value)}
                >
                  <CheckIcon
                    class={cn('size-4', value === option.value ? 'opacity-100' : 'opacity-0')}
                    aria-hidden="true"
                  />
                  <span>{option.label}</span>
                </Command.Item>
              {/each}
            </Command.Group>
          </Command.List>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
  {/if}
</div>

<style>
  /* El bloque cubre el control nativo y el disparador hidratado con la misma caja. */
  .combobox {
    position: relative;
    inline-size: 100%;
  }

  .combobox__native {
    display: block;
    inline-size: 100%;
    min-block-size: 2.5rem;
    padding-inline: 0.75rem;
    color: var(--foreground);
    background: var(--background);
    font-size: var(--font-size-sm);
  }

  .combobox.is-enhanced .combobox__native {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .combobox__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
    inline-size: 100%;
    min-block-size: 2.5rem;
    padding-inline: 0.75rem;
    padding-block: 0.5rem;
    color: var(--foreground);
    background: var(--background);
    font-size: var(--font-size-sm);
    text-align: start;
    cursor: pointer;
  }

  .combobox__trigger:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .combobox__value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .combobox__value--placeholder {
    color: var(--muted-foreground);
  }

  :global(.combobox__icon) {
    flex: 0 0 auto;
    color: var(--muted-foreground);
  }

  /* El wrapper de bits-ui copia el z-index; hay que fijarlo aquí para ganar al filtro sticky. */
  :global([data-bits-floating-content-wrapper]) {
    z-index: var(--z-modal);
  }
</style>
