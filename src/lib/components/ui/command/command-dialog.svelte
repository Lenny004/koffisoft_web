<script lang="ts">
  import type { Command as CommandPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import type { WithoutChildrenOrChild } from '$lib/utils.js';

  import Command from './command.svelte';

  let {
    open = $bindable(false),
    ref = $bindable(null),
    value = $bindable(''),
    title = 'Paleta de comandos',
    description = 'Busca un comando para ejecutar',
    children,
    ...restProps
  }: WithoutChildrenOrChild<CommandPrimitive.RootProps> & {
    open?: boolean;
    title?: string;
    description?: string;
    children: Snippet;
  } = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="overflow-hidden p-0">
    <Dialog.Header class="sr-only">
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{description}</Dialog.Description>
    </Dialog.Header>
    <Command
      class="[&_[data-slot=command-input-wrapper]]:h-12 **:data-[slot=command-input-wrapper]:h-12 [&_[data-command-input-wrapper]_svg]:h-5 [&_[data-command-input-wrapper]_svg]:w-5 [&_[data-slot=command-input]]:h-12 [&_[data-slot=command-item]]:px-2 [&_[data-slot=command-item]]:py-3 [&_[data-slot=command-item]_svg]:h-5 [&_[data-slot=command-item]_svg]:w-5"
      {...restProps}
      bind:value
      bind:ref
      {children}
    />
  </Dialog.Content>
</Dialog.Root>
