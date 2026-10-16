import { describe, expect, it } from 'vitest';

import {
  formatAnnouncementDate,
  formatAnnouncementMessage,
  isSafeAnnouncementCtaUrl,
} from './announcements';

describe('formatAnnouncementMessage', () => {
  it('conserva párrafos y convierte las direcciones web en enlaces', () => {
    const paragraphs = formatAnnouncementMessage(
      'Estimados clientes,\n\nUn sitio falso, https://ejemplo.falso, está imitando a Koffi-Soft.',
    );

    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]?.lines).toEqual([[{ kind: 'text', value: 'Estimados clientes,' }]]);
    expect(paragraphs[1]?.lines[0]).toEqual([
      { kind: 'text', value: 'Un sitio falso, ' },
      { kind: 'link', value: 'https://ejemplo.falso' },
      { kind: 'text', value: ', está imitando a Koffi-Soft.' },
    ]);
  });
});

describe('formatAnnouncementDate', () => {
  it('formatea la vigencia en la zona horaria de El Salvador', () => {
    expect(formatAnnouncementDate('2026-04-26T18:00:00.000Z')).toBe('26 de abril de 2026');
    expect(formatAnnouncementDate(null)).toBeNull();
  });
});

describe('isSafeAnnouncementCtaUrl', () => {
  it('acepta rutas relativas y URLs HTTP(S)', () => {
    expect(isSafeAnnouncementCtaUrl('/reservas')).toBe(true);
    expect(isSafeAnnouncementCtaUrl('https://koffi.example/reservas')).toBe(true);
    expect(isSafeAnnouncementCtaUrl('http://localhost:5173/reservas')).toBe(true);
  });

  it.each([
    'javascript:alert(1)',
    'data:text/html,<script>x</script>',
    'vbscript:msgbox(1)',
    'ftp://externo.example',
    'https:\\externo.example',
    '//externo.example',
  ])('rechaza CTA insegura %s', (value) => expect(isSafeAnnouncementCtaUrl(value)).toBe(false));
});
