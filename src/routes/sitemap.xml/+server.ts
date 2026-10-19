import type { RequestHandler } from './$types';

import { env } from '$env/dynamic/private';

const API_TIMEOUT_MS = 8_000;

/** Proxy del sitemap XML generado por la API con timeout y respuesta 503 ante fallos. */
export const GET: RequestHandler = async ({ fetch }) => {
  if (!env.API_BASE_URL) {
    return new Response('Sitemap no disponible.\n', {
      status: 503,
      headers: { 'content-type': 'application/xml; charset=utf-8' },
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const response = await fetch(
      new URL('sitemap.xml', `${env.API_BASE_URL.replace(/\/$/u, '')}/`),
      {
        signal: controller.signal,
        headers: { Accept: 'application/xml' },
      },
    );
    return new Response(await response.text(), {
      status: response.ok ? 200 : 503,
      headers: { 'content-type': 'application/xml; charset=utf-8' },
    });
  } catch {
    return new Response('Sitemap no disponible.\n', {
      status: 503,
      headers: { 'content-type': 'application/xml; charset=utf-8' },
    });
  } finally {
    clearTimeout(timeout);
  }
};
