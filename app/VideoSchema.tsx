/**
 * VideoObject del episodio que destaca el linktree (YOUTUBE_VIDEO_ID en
 * LinktreePageContent). Fecha y duración reales del vídeo en YouTube:
 * uploadDate 2026-05-26, lengthSeconds 370. Se emite en "/" (la URL
 * canónica) y en /[lang]/links, que muestran el mismo contenido.
 */
const SITE_URL = 'https://contactform-socialmedias.vercel.app'

const VIDEO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'Uniendo Familias | Episodio 5 — Una familia, una esperanza',
  description:
    'Después de un mes de detención, y gracias a la estrategia legal de un habeas corpus, Jexis logró recuperar su libertad con el apoyo del abogado de inmigración Manuel Solís. Hoy, su experiencia se convierte en un mensaje de esperanza para quienes sienten que ya no tienen opciones.',
  thumbnailUrl: [`${SITE_URL}/uniendo-familias-ep5.jpg`],
  uploadDate: '2026-05-26',
  duration: 'PT6M10S',
  embedUrl: 'https://www.youtube.com/embed/E4scFUVVHJo',
  contentUrl: 'https://www.youtube.com/watch?v=E4scFUVVHJo',
  inLanguage: 'es',
}

export default function VideoSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(VIDEO_SCHEMA) }}
    />
  )
}
