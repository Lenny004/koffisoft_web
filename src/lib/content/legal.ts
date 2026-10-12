import { siteContent } from '$lib/content/site';

export type LegalHref =
  '/legal' | '/privacidad' | '/cookies' | '/condiciones' | '/contacto' | '/reservas' | '/eventos';

export type LegalInline = string | { text: string; href: LegalHref };

export type LegalBlock =
  | { kind: 'paragraph'; content: LegalInline[] }
  | { kind: 'list'; items: string[] }
  | { kind: 'facts'; rows: Array<{ label: string; value: string }> };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  href: '/legal' | '/privacidad' | '/cookies' | '/condiciones';
  navLabel: string;
  title: string;
  description: string;
  sections: LegalSection[];
};

const identityRows: LegalBlock = {
  kind: 'facts',
  rows: [
    { label: 'Identidad', value: 'Koffi-Soft (razón social por confirmar)' },
    { label: 'Documento tributario', value: 'Por confirmar' },
    { label: 'Dirección', value: siteContent.contact.address },
    { label: 'Correo', value: siteContent.contact.email },
    { label: 'Teléfono', value: siteContent.contact.phone },
  ],
};

const contactParagraph: LegalBlock = {
  kind: 'paragraph',
  content: [
    'Mientras el canal definitivo no esté confirmado, las aclaraciones se solicitan desde la página de ',
    { text: 'contacto', href: '/contacto' },
    '.',
  ],
};

export const legalDocuments: LegalDocument[] = [
  {
    href: '/legal',
    navLabel: 'Aviso legal y condiciones de uso',
    title: 'Aviso legal y condiciones de uso',
    description: 'Condiciones provisionales de uso del sitio público de Koffi-Soft.',
    sections: [
      {
        id: 'titular',
        title: 'Titular del sitio',
        blocks: [
          identityRows,
          {
            kind: 'paragraph',
            content: [
              'Koffi-Soft es el titular de este sitio y el prestador de la información publicada sobre la cafetería, la carta y las solicitudes de visita. La razón social, el documento tributario y los canales definitivos quedan pendientes de confirmación antes de publicar el texto aprobado.',
            ],
          },
        ],
      },
      {
        id: 'objeto',
        title: 'Objeto',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'Estas condiciones regulan el acceso y la navegación del sitio público. Consultar la carta, ver la ubicación o enviar una solicitud no crea, por sí solo, una reserva confirmada ni un contrato de prestación de servicios.',
            ],
          },
        ],
      },
      {
        id: 'uso',
        title: 'Uso del sitio',
        blocks: [
          {
            kind: 'paragraph',
            content: ['Quien navega el sitio se compromete a utilizarlo de forma lícita y a no:'],
          },
          {
            kind: 'list',
            items: [
              'alterar el funcionamiento del sitio ni intentar acceder a áreas privadas o a datos de otras personas;',
              'usar los formularios para enviar información falsa o contenidos ajenos a una consulta, reserva o evento;',
              'reutilizar de forma automatizada la carta, los precios o la disponibilidad publicados.',
            ],
          },
        ],
      },
      {
        id: 'contenido',
        title: 'Contenido publicado',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'La carta, los alérgenos, la disponibilidad y las condiciones que muestra el sitio dependen de la información publicada por Koffi-Soft y pueden requerir confirmación directa. Un precio o un horario visible no sustituye la confirmación del equipo cuando la operación así lo indique.',
            ],
          },
        ],
      },
      {
        id: 'propiedad',
        title: 'Propiedad de los contenidos',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'Los textos, la marca, el logotipo y las fotografías del sitio se publican para informar la visita. Su reproducción fuera de ese uso queda pendiente de las condiciones que apruebe el titular.',
            ],
          },
        ],
      },
      {
        id: 'enlaces',
        title: 'Enlaces',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'El sitio puede enlazar redes sociales u otros sitios. Esos destinos tienen sus propias condiciones y no forman parte de este aviso.',
            ],
          },
        ],
      },
      {
        id: 'contacto-legal',
        title: 'Contacto',
        blocks: [contactParagraph],
      },
    ],
  },
  {
    href: '/privacidad',
    navLabel: 'Política de privacidad',
    title: 'Política de privacidad',
    description: 'Información provisional sobre el tratamiento de datos personales en Koffi-Soft.',
    sections: [
      {
        id: 'responsable',
        title: 'Responsable del tratamiento',
        blocks: [
          identityRows,
          {
            kind: 'paragraph',
            content: [
              'Koffi-Soft informa, con carácter provisional, de cómo trata los datos personales que se recogen a través de este sitio. El texto definitivo debe citar la normativa salvadoreña aplicable y las medidas organizativas aprobadas. Hasta entonces, esta página no sustituye una política revisada por asesoría legal.',
            ],
          },
        ],
      },
      {
        id: 'finalidad',
        title: 'Finalidad del tratamiento',
        blocks: [
          {
            kind: 'paragraph',
            content: ['Los datos se usan solo para estas finalidades:'],
          },
          {
            kind: 'list',
            items: [
              'atender solicitudes de reserva, cotizaciones de eventos y mensajes de contacto;',
              'responder la consulta y, si hace falta, pedir un dato que falte para gestionarla;',
              'mostrar la carta, la ubicación y la información de la visita;',
              'recordar en el propio navegador la preferencia de tema claro u oscuro.',
            ],
          },
          {
            kind: 'paragraph',
            content: [
              'No se usan para otra finalidad, salvo obligación legal. El sitio no envía boletines ni comunicaciones comerciales no solicitadas. La preferencia de tema permanece en el navegador y no se envía como dato de cuenta.',
            ],
          },
        ],
      },
      {
        id: 'legitimacion',
        title: 'Base del tratamiento',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'La base es la gestión de la solicitud que la persona envía y, cuando un formulario lo pida de forma expresa, su consentimiento. Si no se facilitan los datos necesarios, no es posible tramitar esa reserva, cotización o mensaje.',
            ],
          },
        ],
      },
      {
        id: 'destinatarios',
        title: 'Destinatarios',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'Los datos de los formularios se tratan para operar el sitio y llegar al equipo de Koffi-Soft. No se ceden a terceros para publicidad. El detalle de encargados técnicos y el lugar de alojamiento quedan por confirmar en la revisión legal.',
            ],
          },
          {
            kind: 'paragraph',
            content: [
              'El sitio no guarda sesiones ni tokens de autenticación en el navegador. La única preferencia local del shell público es el tema visual.',
            ],
          },
        ],
      },
      {
        id: 'derechos',
        title: 'Derechos de las personas',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'Puedes solicitar acceso, rectificación, supresión u oposición respecto de los datos enviados por los formularios del sitio. La autoridad de control competente y el plazo de conservación se indicarán en el texto aprobado.',
            ],
          },
          contactParagraph,
        ],
      },
      {
        id: 'informacion',
        title: 'Información que recibimos',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'Cada formulario publica sus propios campos: por ejemplo, identificación de contacto, fecha, horario o el detalle de un evento. No se pide un documento de identidad para navegar la carta ni para leer esta política.',
            ],
          },
        ],
      },
      {
        id: 'redes',
        title: 'Redes sociales',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'Los enlaces a redes llevan a plataformas de terceros. El tratamiento que ocurra allí lo define cada plataforma. Los perfiles oficiales y las reglas de moderación de Koffi-Soft están por confirmar.',
            ],
          },
        ],
      },
      {
        id: 'seguridad',
        title: 'Medidas de seguridad',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'El sitio se construye para que los formularios viajen al servicio que corresponda y para no dejar credenciales en el navegador. Las medidas organizativas concretas se documentarán cuando el texto legal esté aprobado.',
            ],
          },
        ],
      },
      {
        id: 'idioma',
        title: 'Idioma',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'El idioma de esta política es el español. Si más adelante existiera otra versión, prevalecerá el texto en español aprobado por Koffi-Soft.',
            ],
          },
        ],
      },
      {
        id: 'cambios',
        title: 'Cambios de esta política',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'Esta versión es provisional y será sustituida por el texto aprobado antes de considerar publicada la política definitiva. La fecha de esa versión se mostrará junto al documento cuando exista.',
            ],
          },
        ],
      },
    ],
  },
  {
    href: '/cookies',
    navLabel: 'Política de cookies',
    title: 'Política de cookies',
    description: 'Información provisional sobre cookies y almacenamiento local en Koffi-Soft.',
    sections: [
      {
        id: 'que-son',
        title: 'Qué son las cookies',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'Una cookie es un pequeño archivo que un sitio puede guardar en el navegador. También existe otro almacenamiento local, distinto de una cookie, que el sitio puede usar para recordar una preferencia en ese mismo dispositivo.',
            ],
          },
        ],
      },
      {
        id: 'que-usa',
        title: 'Qué usa este sitio',
        blocks: [
          {
            kind: 'paragraph',
            content: ['En la versión actual del sitio público:'],
          },
          {
            kind: 'list',
            items: [
              'no se instalan cookies de analítica ni de publicidad de terceros;',
              'no se guarda una sesión de cliente en el navegador;',
              'la preferencia de tema claro u oscuro se guarda en el almacenamiento local del navegador, bajo la clave del tema visual, y solo se lee para pintar la interfaz.',
            ],
          },
        ],
      },
      {
        id: 'gestion',
        title: 'Cómo gestionarlas',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'Puedes borrar el almacenamiento local y las cookies desde la configuración del navegador. Si borras la preferencia de tema, el sitio volverá a mostrarse con el tema claro hasta que elijas otro.',
            ],
          },
        ],
      },
      {
        id: 'cambios-cookies',
        title: 'Cambios',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'Si más adelante se incorporan cookies de medición o de un servicio externo, esta página describirá su finalidad, duración y forma de rechazo antes de activarlas.',
            ],
          },
        ],
      },
    ],
  },
  {
    href: '/condiciones',
    navLabel: 'Condiciones de reservas',
    title: 'Condiciones de reservas',
    description: 'Condiciones provisionales para solicitar mesa o cotizar un evento en Koffi-Soft.',
    sections: [
      {
        id: 'alcance',
        title: 'Alcance',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'El formulario de reservas envía una solicitud. La mesa queda pendiente de la respuesta del equipo: enviar el formulario no confirma la visita ni bloquea un cupo por sí solo.',
            ],
          },
        ],
      },
      {
        id: 'solicitud',
        title: 'Datos de la solicitud',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'La solicitud pide los datos publicados en el formulario de ',
              { text: 'reservas', href: '/reservas' },
              '. La disponibilidad que muestra el sitio procede del servicio de reservas y puede cambiar antes de la confirmación.',
            ],
          },
        ],
      },
      {
        id: 'eventos',
        title: 'Eventos y grupos',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'Una celebración o un grupo se cotiza desde ',
              { text: 'eventos', href: '/eventos' },
              '. Esa solicitud tampoco equivale a una reserva cerrada ni a un precio aprobado.',
            ],
          },
        ],
      },
      {
        id: 'cambios-reserva',
        title: 'Cambios y cancelaciones',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'Los plazos de cambio, la tolerancia de llegada y las condiciones de cancelación están por confirmar. No se publican penalizaciones ni anticipos hasta que el equipo apruebe esas reglas.',
            ],
          },
        ],
      },
      {
        id: 'contacto-reservas',
        title: 'Contacto',
        blocks: [
          {
            kind: 'paragraph',
            content: [
              'Horario de atención: ',
              siteContent.contact.hours,
              ' Para una aclaración sobre una solicitud ya enviada, usa ',
              { text: 'contacto', href: '/contacto' },
              '.',
            ],
          },
        ],
      },
    ],
  },
];

export function getLegalDocument(href: LegalDocument['href']): LegalDocument {
  const document = legalDocuments.find((item) => item.href === href);
  if (!document) {
    throw new Error(`Documento legal no encontrado: ${href}`);
  }
  return document;
}
