export const editorialPlaceholder = true;

export const siteContent = {
  contact: {
    email: 'Por confirmar',
    phone: 'Por confirmar',
    address: 'Ruta Panorámica, El Salvador',
    hours: 'Horario por confirmar con el equipo de Koffi-Soft.',
  },
  about: {
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
  legal: {
    termsTitle: 'Términos de uso',
    privacyTitle: 'Política de privacidad',
    placeholder:
      'Este contenido legal es provisional y debe ser reemplazado por el texto aprobado antes de publicar el sitio en producción.',
  },
} as const;
