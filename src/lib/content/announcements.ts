/** Fragmento de un párrafo: texto plano o un enlace detectado en el mensaje. */
export interface AnnouncementTextSegment {
  kind: 'text' | 'link';
  value: string;
}

/** Párrafo listo para renderizar sin HTML crudo. */
export interface AnnouncementParagraph {
  lines: AnnouncementTextSegment[][];
}

const urlPattern = /https?:\/\/[^\s<>"']+/giu;
const trailingPunctuation = /[),.;:!?]+$/u;

/**
 * Separa el mensaje en párrafos y líneas, y convierte URLs en enlaces.
 * El aviso se guarda como texto; no se interpreta HTML del administrador.
 */
export function formatAnnouncementMessage(message: string): AnnouncementParagraph[] {
  return message
    .replaceAll('\r\n', '\n')
    .split(/\n{2,}/u)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => ({
      lines: block.split('\n').map((line) => linkifyLine(line)),
    }));
}

/** Fecha del aviso en la zona de la sede, por ejemplo "26 de abril de 2026". */
export function formatAnnouncementDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('es-SV', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/El_Salvador',
  }).format(date);
}

/** Rechaza esquemas ejecutables antes de renderizar una CTA editorial. */
export function isSafeAnnouncementCtaUrl(value: string): boolean {
  if (/[\u0000-\u001f\u007f\\]/u.test(value)) return false;
  if (value.startsWith('/')) return !value.startsWith('//');
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) && /^https?:\/\//iu.test(value);
  } catch {
    return false;
  }
}

export function isExternalAnnouncementUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) && /^https?:\/\//iu.test(value);
  } catch {
    return false;
  }
}

function linkifyLine(line: string): AnnouncementTextSegment[] {
  const segments: AnnouncementTextSegment[] = [];
  let cursor = 0;

  for (const match of line.matchAll(urlPattern)) {
    const index = match.index ?? 0;
    if (index > cursor) pushText(segments, line.slice(cursor, index));

    const { href, trailing } = splitTrailingPunctuation(match[0]);
    if (href) segments.push({ kind: 'link', value: href });
    if (trailing) pushText(segments, trailing);
    cursor = index + match[0].length;
  }

  if (cursor < line.length) pushText(segments, line.slice(cursor));
  if (segments.length === 0) segments.push({ kind: 'text', value: '' });
  return segments;
}

function pushText(segments: AnnouncementTextSegment[], value: string): void {
  const previous = segments.at(-1);
  if (previous?.kind === 'text') {
    previous.value += value;
    return;
  }
  segments.push({ kind: 'text', value });
}

function splitTrailingPunctuation(raw: string): { href: string; trailing: string } {
  const trailing = raw.match(trailingPunctuation)?.[0] ?? '';
  return { href: raw.slice(0, raw.length - trailing.length), trailing };
}
