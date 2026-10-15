export const editorialPlaceholder = true;

export interface SiteContent {
  contact: { email: string; phone: string; address: string; hours: string };
  hero: { eyebrow: string; title: string; description: string; imageUrl: string | null };
  about: {
    title: string;
    description: string;
    mission: string;
    vision: string;
    team: { name: string; role: string; description: string }[];
  };
  social: { facebook: string | null; instagram: string | null; tikTok: string | null };
  promotions: { title: string; description: string; label: string }[];
  hikingStages: { title: string; description: string; image: string }[];
}

export const siteContent: SiteContent = {
  contact: {
    email: 'Por confirmar',
    phone: 'Por confirmar',
    address: 'Ruta Panorámica, El Salvador',
    hours: 'Horario por confirmar con el equipo de Koffi-Soft.',
  },
  hero: {
    eyebrow: 'Carta de la casa',
    title: 'Descubre los favoritos del café y la cocina de montaña',
    description: 'Platos, bebidas y postres para elegir con calma.',
    imageUrl: null,
  },
  about: {
    title: 'Nosotros',
    description:
      'Koffi-Soft nace como un punto de encuentro para disfrutar la montaña con los cinco sentidos.',
    mission:
      'Crear pausas memorables alrededor del café, la cocina y el paisaje de montaña, con una atención cercana para cada visita.',
    vision:
      'Ser un punto de encuentro reconocido en la Ruta Panorámica por su calidez, sus sabores y el respeto por el entorno.',
    team: [
      {
        name: 'Equipo de hospitalidad',
        role: 'Atención y experiencia',
        description: 'Contenido editorial provisional pendiente de confirmación.',
      },
      {
        name: 'Equipo de cocina',
        role: 'Café y cocina',
        description: 'Contenido editorial provisional pendiente de confirmación.',
      },
      {
        name: 'Equipo de montaña',
        role: 'Experiencias y eventos',
        description: 'Contenido editorial provisional pendiente de confirmación.',
      },
    ],
  },
  social: { facebook: null, instagram: null, tikTok: null },
  promotions: [
    {
      title: 'Próximamente en Koffi-Soft',
      description:
        'Las promociones publicadas aparecerán aquí cuando exista un endpoint confirmado para esta sección.',
      label: 'Contenido provisional',
    },
    {
      title: 'Una pausa para compartir',
      description:
        'Este espacio queda preparado para comunicar novedades sin inventar precios, vigencias o condiciones.',
      label: 'Contenido provisional',
    },
  ],
  hikingStages: [
    {
      title: 'Inicio del recorrido',
      description:
        'Una introducción editorial al sendero y al paisaje de la Ruta Panorámica. Texto provisional pendiente de validación operativa.',
      image: '/experiences/hiking-1.jpg',
    },
    {
      title: 'Experiencia del recorrido',
      description:
        'Un tramo para descubrir el entorno con calma. La información definitiva de dificultad, duración y recomendaciones queda pendiente.',
      image: '/experiences/hiking-2.png',
    },
    {
      title: 'Final del recorrido',
      description:
        'El cierre de la experiencia con una vista amplia de la montaña. El punto exacto y las condiciones de acceso deben confirmarse.',
      image: '/experiences/hiking-panorama.png',
    },
  ],
} as const;
