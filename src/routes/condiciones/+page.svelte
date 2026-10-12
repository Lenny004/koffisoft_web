<script lang="ts">
  import LegalDocumentView from '$lib/components/public/legal-document.svelte';
  import { getLegalDocument } from '$lib/content/legal';
</script>

<LegalDocumentView document={getLegalDocument('/condiciones')} />
