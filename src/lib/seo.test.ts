import { describe, expect, it } from 'vitest';

import { defaultSeo, pageKeyForPath } from './seo';

describe('SEO público', () => {
  it('mapea páginas públicas y deja el detalle de plato para su recurso', () => {
    expect(pageKeyForPath('/')).toBe('home');
    expect(pageKeyForPath('/carta')).toBe('menu');
    expect(pageKeyForPath('/carta/cafe-de-la-casa')).toBeNull();
  });

  it('genera defaults absolutos para canonical e imagen OG', () => {
    expect(defaultSeo('home', 'https://site.example/')).toMatchObject({
      canonicalUrl: 'https://site.example/',
      ogImageUrl: 'https://site.example/brand/logo-primary.png',
    });
  });
});
