import LinktreePageContent from './LinktreePageContent'
import VideoSchema from '../../VideoSchema'

export const metadata = {
  title: 'Abogados de Inmigración Manuel Solís | Houston, TX',
  description: 'Abogados de inmigración en Houston, TX. Arregla tu estatus migratorio sin salir del país con los Abogados Manuel Solís. Llama al +1 (346) 460-7278.',
  openGraph: {
    title: 'Abogados de Inmigración Manuel Solís | Houston, TX',
    description: 'Arregla tu estatus migratorio sin salir del país. Llama al +1 (346) 460-7278.',
    images: ['/LogoInformacion.png'],
  },
}

export default function LinksPage() {
  return (
    <>
      <VideoSchema />
      <LinktreePageContent />
    </>
  )
}
