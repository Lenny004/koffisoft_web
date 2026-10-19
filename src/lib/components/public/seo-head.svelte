<script lang="ts">
  /**
   * Metadatos Open Graph, Twitter y canonical compartidos por las páginas públicas.
   */
  import type { SeoMetadata } from '$lib/seo';

  let {
    metadata,
    jsonLd,
  }: {
    metadata: SeoMetadata;
    jsonLd?: Record<string, unknown>;
  } = $props();

  /** Serializa JSON-LD como fragmento HTML seguro para inyectar con `{@html}`. */
  function jsonLdScript(value: Record<string, unknown>): string {
    const openTag = `${String.fromCharCode(60)}script type="application/ld+json">`;
    const closeTag = `${String.fromCharCode(60)}/script>`;
    return `${openTag}${JSON.stringify(value).replaceAll('<', '\\u003c')}${closeTag}`;
  }
</script>

<svelte:head>
  <title>{metadata.metaTitle}</title>
  <meta name="description" content={metadata.metaDescription} />
  {#if metadata.noindex}<meta name="robots" content="noindex,nofollow" />{/if}
  <link rel="canonical" href={metadata.canonicalUrl} />
  <meta property="og:title" content={metadata.metaTitle} />
  <meta property="og:description" content={metadata.metaDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={metadata.canonicalUrl} />
  {#if metadata.ogImageUrl}<meta property="og:image" content={metadata.ogImageUrl} />{/if}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={metadata.metaTitle} />
  <meta name="twitter:description" content={metadata.metaDescription} />
  {#if metadata.ogImageUrl}<meta name="twitter:image" content={metadata.ogImageUrl} />{/if}
  {#if jsonLd}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html jsonLdScript(jsonLd)}
  {/if}
</svelte:head>
