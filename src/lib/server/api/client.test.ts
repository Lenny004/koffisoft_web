import { describe, expect, it, vi } from 'vitest';

import { createApiClient } from './client';

const locationId = '20000000-0000-0000-0000-000000000001';

describe('createApiClient', () => {
  it('construye la consulta pública de carta con los filtros del contrato', async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      expect(String(input)).toBe(
        `https://api.example.test/menu?locationId=${locationId}&category=coffee&allergen=GLUTEN`,
      );
      return new Response(JSON.stringify({ categories: [] }), {
        headers: { 'content-type': 'application/json' },
      });
    });

    await createApiClient(
      { baseUrl: 'https://api.example.test', locationId },
      fetcher,
    ).getPublicMenu({ category: 'coffee', allergen: 'GLUTEN' });

    expect(fetcher).toHaveBeenCalledOnce();
  });

  it('envía la sede y el cuerpo JSON al solicitar una reserva', async () => {
    const fetcher = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.method).toBe('POST');
      expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
      expect(JSON.parse(String(init?.body))).toMatchObject({ locationId, partySize: 2 });
      return new Response(JSON.stringify({ reservationCode: 'RSV-001' }), {
        headers: { 'content-type': 'application/json' },
      });
    });

    await createApiClient(
      { baseUrl: 'https://api.example.test', locationId },
      fetcher,
    ).createReservation({
      date: '2026-10-24',
      time: '18:30',
      partySize: 2,
      contactName: 'Ana',
      contactPhone: '+503 0000-0000',
    });

    expect(fetcher).toHaveBeenCalledOnce();
  });

  it('convierte respuestas HTTP fallidas en errores tipados', async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(JSON.stringify({ message: 'Servicio no disponible' }), {
          status: 503,
          headers: { 'content-type': 'application/json' },
        }),
    );

    await expect(
      createApiClient(
        { baseUrl: 'https://api.example.test', locationId },
        fetcher,
      ).getEventCatalog(),
    ).rejects.toMatchObject({ status: 503, message: 'Servicio no disponible' });
  });

  it('aplica timeout a una API que no responde', async () => {
    const fetcher = vi.fn(
      async (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        }),
    );

    await expect(
      createApiClient(
        { baseUrl: 'https://api.example.test', locationId, timeoutMs: 5 },
        fetcher,
      ).getEventCatalog(),
    ).rejects.toMatchObject({ message: 'La API tardó demasiado en responder.' });
  });
});
