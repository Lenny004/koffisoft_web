import { describe, expect, it } from 'vitest';

import { analyticsResource, createAnalyticsPayload } from './analytics';

describe('analíticas públicas', () => {
  it('clasifica páginas, platos, eventos y avisos', () => {
    expect(analyticsResource('/carta/cafe-de-la-casa')).toEqual({
      resourceType: 'menu_item',
      resourceKey: 'cafe-de-la-casa',
    });
    expect(analyticsResource('/eventos/celebracion')).toEqual({
      resourceType: 'event',
      resourceKey: 'celebracion',
    });
    expect(analyticsResource('/avisos/horario')).toEqual({
      resourceType: 'announcement',
      resourceKey: 'horario',
    });
  });

  it('no genera payload para previews ni incluye cookies o IP', () => {
    expect(createAnalyticsPayload('/preview/token', 'location-1', '')).toBeNull();
    expect(createAnalyticsPayload('/carta', 'location-1', 'https://search.example')).toEqual({
      path: '/carta',
      locationId: 'location-1',
      resourceType: 'page',
      resourceKey: 'menu',
      referer: 'https://search.example',
      isPreview: false,
    });
  });
});
