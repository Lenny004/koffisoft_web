import { describe, expect, it } from 'vitest';

import { legalDocuments } from './legal';

describe('documentos legales', () => {
  it('publica los cuatro módulos con secciones propias', () => {
    expect(legalDocuments.map((document) => document.href)).toEqual([
      '/legal',
      '/privacidad',
      '/cookies',
      '/condiciones',
    ]);

    for (const document of legalDocuments) {
      expect(document.sections.length).toBeGreaterThan(2);
      const ids = document.sections.map((section) => section.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
