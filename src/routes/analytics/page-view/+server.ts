import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const NO_CONTENT = { status: 204 } as const;

/** Proxy server-only que evita publicar API_BASE_URL y no reenvía cookies. */
export const POST: RequestHandler = async ({ request, fetch, url }) => {
  const apiBaseUrl = env.API_BASE_URL?.replace(/\/$/u, '');
  if (!apiBaseUrl) return new Response(null, NO_CONTENT);

  const body = await request.text();
  if (!body) return new Response(null, NO_CONTENT);

  const origin = env.ORIGIN || url.origin;
  const headers = new Headers({
    accept: 'application/json',
    'content-type': 'application/json',
    origin,
    referer: request.headers.get('referer') || `${origin}/`,
  });
  const userAgent = request.headers.get('user-agent');
  if (userAgent) headers.set('user-agent', userAgent);

  try {
    await fetch(`${apiBaseUrl}/analytics/page-view`, {
      method: 'POST',
      headers,
      body,
      credentials: 'omit',
    });
  } catch {
    // La métrica no debe bloquear ni cambiar la navegación pública.
  }

  return new Response(null, NO_CONTENT);
};
