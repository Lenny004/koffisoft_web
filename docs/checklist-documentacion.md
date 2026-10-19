# Checklist documentación (funciones y métodos)

Auditoría: `node scripts/audit-docs.mjs` y `node scripts/generate-checklist.mjs`.
Criterio: bloque `/**` en español inmediatamente encima de cada declaración de función o método.

## Leyenda

| Símbolo | Significado |
| --- | --- |
| [x] | Todas las funciones detectadas documentadas |
| [~] | Parcial |
| [ ] | Pendiente |
| [-] | Sin funciones declaradas |

## Resumen

| Métrica | Cantidad |
| --- | ---: |
| files | 121 |
| completo | 31 |
| parcial | 0 |
| pendiente | 0 |
| sinFunciones | 90 |

## Archivos

| | Archivo | Funciones | Doc |
| --- | --- | ---: | ---: |
| [-] | `src/app.d.ts` | — | — |
| [x] | `src/lib/analytics.ts` | 2 | 2 |
| [x] | `src/lib/api/mappers.ts` | 6 | 6 |
| [-] | `src/lib/api/types.ts` | — | — |
| [x] | `src/lib/components/public/allergen-selector.svelte` | 1 | 1 |
| [-] | `src/lib/components/public/catalog-hero.svelte` | — | — |
| [x] | `src/lib/components/public/catalog-rail.svelte` | 1 | 1 |
| [-] | `src/lib/components/public/category-card.svelte` | — | — |
| [x] | `src/lib/components/public/legal-document.svelte` | 1 | 1 |
| [-] | `src/lib/components/public/menu-item-card.svelte` | — | — |
| [-] | `src/lib/components/public/pagination.svelte` | — | — |
| [-] | `src/lib/components/public/product-detail.svelte` | — | — |
| [x] | `src/lib/components/public/reservation-flow.svelte` | 8 | 8 |
| [-] | `src/lib/components/public/section-heading.svelte` | — | — |
| [x] | `src/lib/components/public/seo-head.svelte` | 1 | 1 |
| [-] | `src/lib/components/public/status-message.svelte` | — | — |
| [-] | `src/lib/components/ui/alert/alert.svelte` | — | — |
| [-] | `src/lib/components/ui/alert/index.ts` | — | — |
| [-] | `src/lib/components/ui/badge/badge.svelte` | — | — |
| [-] | `src/lib/components/ui/badge/index.ts` | — | — |
| [-] | `src/lib/components/ui/button/button.svelte` | — | — |
| [-] | `src/lib/components/ui/button/index.ts` | — | — |
| [-] | `src/lib/components/ui/card/card-content.svelte` | — | — |
| [-] | `src/lib/components/ui/card/card-description.svelte` | — | — |
| [-] | `src/lib/components/ui/card/card-header.svelte` | — | — |
| [-] | `src/lib/components/ui/card/card-title.svelte` | — | — |
| [-] | `src/lib/components/ui/card/card.svelte` | — | — |
| [-] | `src/lib/components/ui/card/index.ts` | — | — |
| [x] | `src/lib/components/ui/combobox/combobox.svelte` | 4 | 4 |
| [-] | `src/lib/components/ui/combobox/index.ts` | — | — |
| [-] | `src/lib/components/ui/combobox/types.ts` | — | — |
| [-] | `src/lib/components/ui/command/command-dialog.svelte` | — | — |
| [-] | `src/lib/components/ui/command/command-empty.svelte` | — | — |
| [-] | `src/lib/components/ui/command/command-group.svelte` | — | — |
| [-] | `src/lib/components/ui/command/command-input.svelte` | — | — |
| [-] | `src/lib/components/ui/command/command-item.svelte` | — | — |
| [-] | `src/lib/components/ui/command/command-link-item.svelte` | — | — |
| [-] | `src/lib/components/ui/command/command-list.svelte` | — | — |
| [-] | `src/lib/components/ui/command/command-loading.svelte` | — | — |
| [-] | `src/lib/components/ui/command/command-separator.svelte` | — | — |
| [-] | `src/lib/components/ui/command/command-shortcut.svelte` | — | — |
| [-] | `src/lib/components/ui/command/command.svelte` | — | — |
| [-] | `src/lib/components/ui/command/index.ts` | — | — |
| [-] | `src/lib/components/ui/dialog/body.svelte` | — | — |
| [-] | `src/lib/components/ui/dialog/close.svelte` | — | — |
| [-] | `src/lib/components/ui/dialog/content.svelte` | — | — |
| [-] | `src/lib/components/ui/dialog/description.svelte` | — | — |
| [-] | `src/lib/components/ui/dialog/footer.svelte` | — | — |
| [-] | `src/lib/components/ui/dialog/header.svelte` | — | — |
| [-] | `src/lib/components/ui/dialog/index.ts` | — | — |
| [-] | `src/lib/components/ui/dialog/root.svelte` | — | — |
| [-] | `src/lib/components/ui/dialog/title.svelte` | — | — |
| [-] | `src/lib/components/ui/dialog/trigger.svelte` | — | — |
| [-] | `src/lib/components/ui/form-field.svelte` | — | — |
| [-] | `src/lib/components/ui/input/index.ts` | — | — |
| [-] | `src/lib/components/ui/input/input.svelte` | — | — |
| [-] | `src/lib/components/ui/label/index.ts` | — | — |
| [-] | `src/lib/components/ui/label/label.svelte` | — | — |
| [-] | `src/lib/components/ui/popover/index.ts` | — | — |
| [-] | `src/lib/components/ui/popover/popover-close.svelte` | — | — |
| [-] | `src/lib/components/ui/popover/popover-content.svelte` | — | — |
| [-] | `src/lib/components/ui/popover/popover-portal.svelte` | — | — |
| [-] | `src/lib/components/ui/popover/popover-trigger.svelte` | — | — |
| [-] | `src/lib/components/ui/popover/popover.svelte` | — | — |
| [-] | `src/lib/components/ui/select/index.ts` | — | — |
| [-] | `src/lib/components/ui/select/select.svelte` | — | — |
| [-] | `src/lib/components/ui/table/body.svelte` | — | — |
| [-] | `src/lib/components/ui/table/caption.svelte` | — | — |
| [-] | `src/lib/components/ui/table/cell.svelte` | — | — |
| [-] | `src/lib/components/ui/table/empty.svelte` | — | — |
| [-] | `src/lib/components/ui/table/footer.svelte` | — | — |
| [-] | `src/lib/components/ui/table/head.svelte` | — | — |
| [-] | `src/lib/components/ui/table/header.svelte` | — | — |
| [-] | `src/lib/components/ui/table/index.ts` | — | — |
| [-] | `src/lib/components/ui/table/pagination.svelte` | — | — |
| [-] | `src/lib/components/ui/table/root.svelte` | — | — |
| [-] | `src/lib/components/ui/table/row.svelte` | — | — |
| [-] | `src/lib/components/ui/textarea/index.ts` | — | — |
| [-] | `src/lib/components/ui/textarea/textarea.svelte` | — | — |
| [x] | `src/lib/content/announcements.ts` | 7 | 7 |
| [-] | `src/lib/content/form-options.ts` | — | — |
| [x] | `src/lib/content/legal.ts` | 1 | 1 |
| [x] | `src/lib/content/menu-examples.ts` | 3 | 3 |
| [x] | `src/lib/content/menu.ts` | 5 | 5 |
| [x] | `src/lib/content/reservation-turns.ts` | 4 | 4 |
| [-] | `src/lib/content/site.ts` | — | — |
| [x] | `src/lib/seo.ts` | 2 | 2 |
| [x] | `src/lib/server/api/client.ts` | 29 | 29 |
| [x] | `src/lib/server/validation.ts` | 12 | 12 |
| [-] | `src/lib/utils.ts` | — | — |
| [-] | `src/lib/validation/limits.ts` | — | — |
| [x] | `src/routes/+layout.server.ts` | 1 | 1 |
| [x] | `src/routes/+layout.svelte` | 3 | 3 |
| [x] | `src/routes/+page.server.ts` | 1 | 1 |
| [-] | `src/routes/+page.svelte` | — | — |
| [-] | `src/routes/alergenos/+page.svelte` | — | — |
| [x] | `src/routes/analytics/page-view/+server.ts` | 1 | 1 |
| [x] | `src/routes/avisos/+page.server.ts` | 1 | 1 |
| [x] | `src/routes/avisos/+page.svelte` | 1 | 1 |
| [x] | `src/routes/carta/[slug]/+page.server.ts` | 1 | 1 |
| [-] | `src/routes/carta/[slug]/+page.svelte` | — | — |
| [x] | `src/routes/carta/+page.server.ts` | 1 | 1 |
| [-] | `src/routes/carta/+page.svelte` | — | — |
| [-] | `src/routes/condiciones/+page.svelte` | — | — |
| [-] | `src/routes/contacto/+page.server.ts` | — | — |
| [-] | `src/routes/contacto/+page.svelte` | — | — |
| [-] | `src/routes/cookies/+page.svelte` | — | — |
| [x] | `src/routes/eventos/+page.server.ts` | 1 | 1 |
| [x] | `src/routes/eventos/+page.svelte` | 1 | 1 |
| [-] | `src/routes/legal/+page.svelte` | — | — |
| [-] | `src/routes/nosotros/+page.svelte` | — | — |
| [x] | `src/routes/preview/[token]/+page.server.ts` | 1 | 1 |
| [x] | `src/routes/preview/[token]/+page.svelte` | 3 | 3 |
| [-] | `src/routes/privacidad/+page.svelte` | — | — |
| [-] | `src/routes/promociones/+page.svelte` | — | — |
| [x] | `src/routes/reservas/+page.server.ts` | 1 | 1 |
| [-] | `src/routes/reservas/+page.svelte` | — | — |
| [x] | `src/routes/robots.txt/+server.ts` | 1 | 1 |
| [-] | `src/routes/senderismo/+page.svelte` | — | — |
| [x] | `src/routes/sitemap.xml/+server.ts` | 1 | 1 |
| [-] | `src/routes/ubicacion/+page.svelte` | — | — |