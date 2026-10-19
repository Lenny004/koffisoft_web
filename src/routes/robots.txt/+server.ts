import type { RequestHandler } from './$types';

import { env } from '$env/dynamic/private';

const API_TIMEOUT_MS = 8_000;

/** Proxy de robots.txt desde la API o reglas mínimas de respaldo si no hay configuración. */
export const GET: RequestHandler = async ({ fetch }) => {
  if (!env.API_BASE_URL) {
    return new Response('User-agent: *\nAllow: /\n', {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const response = await fetch(
      new URL('robots.txt', `${env.API_BASE_URL.replace(/\/$/u, '')}/`),
      {
        signal: controller.signal,
        headers: { Accept: 'text/plain' },
      },
    );
    return new Response(await response.text(), {
      status: response.ok ? 200 : 503,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  } catch {
    return new Response('User-agent: *\nAllow: /\n', {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  } finally {
    clearTimeout(timeout);
  }
};
