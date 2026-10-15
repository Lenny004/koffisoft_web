import { describe, expect, it } from 'vitest';

import { mapSiteContent } from './mappers';

describe('mapSiteContent', () => {
  it('convierte sede, horario y perfil en contenido público', () => {
    const content = mapSiteContent({
      locationId: 'location-1',
      location: {
        name: 'Koffi-Soft',
        addressLine: 'Km 20',
        municipality: 'Comasagua',
        department: 'La Libertad',
        phone: '+503 7000',
        email: 'hola@koffisoft.com',
        timezone: 'America/El_Salvador',
      },
      hours: [
        {
          id: 'hour-1',
          serviceType: 'public',
          dayOfWeek: 1,
          opensAt: '08:00',
          closesAt: '18:00',
          crossesMidnight: false,
          active: true,
        },
      ],
      overrides: [],
      profile: {
        heroEyebrow: 'Casa',
        heroTitle: 'Hero editable',
        heroDescription: 'Texto',
        heroImageUrl: null,
        aboutTitle: 'Nosotros',
        aboutDescription: 'Historia',
        aboutMission: 'Misión',
        aboutVision: 'Visión',
        aboutTeam: [],
        socialFacebookUrl: 'https://facebook.com/koffisoft',
        socialInstagramUrl: null,
        socialTikTokUrl: null,
      },
    });
    expect(content.hero.title).toBe('Hero editable');
    expect(content.contact.hours).toContain('Lun 08:00–18:00');
    expect(content.social.facebook).toContain('facebook.com');
  });
});
