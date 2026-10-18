import { describe, expect, it } from 'vitest';

import { CONTACT_TOPIC_VALUES, EVENT_TYPE_VALUES } from './form-options';

describe('catálogos de combobox públicos', () => {
  it('expone los asuntos de contacto del contrato', () => {
    expect(CONTACT_TOPIC_VALUES).toEqual(['general', 'reservation', 'event', 'feedback', 'other']);
  });

  it('expone los tipos de evento del contrato', () => {
    expect(EVENT_TYPE_VALUES).toEqual([
      'Wedding',
      'Birthday',
      'Corporate',
      'Meeting',
      'Anniversary',
      'Other',
    ]);
  });
});
