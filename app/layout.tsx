import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import { Analytics } from "@vercel/analytics/next";

// Configuración de la fuente Outfit globalmente
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abogados de Inmigración Manuel Solís | Houston, TX",
  description:
    "Abogados de inmigración en Houston, TX. Arregla tu estatus migratorio sin salir del país. Llama ahora al +1 (346) 460-7278.",
  keywords: [
    "abogados de inmigración",
    "immigration lawyer Houston",
    "abogado Manuel Solís",
    "arreglar papeles sin salir",
    "consulta migratoria",
    "inmigración Estados Unidos",
    "visa",
    "residencia",
    "green card",
    "deportación",
  ],
  icons: {
    icon: "/LogoInformacion.png",
    apple: "/LogoInformacion.png",
  },
  // Dominio REAL del despliegue. Estaba en links.manuelsolis.com, que no
  // existe (NXDOMAIN): el canonical apuntaba a un dominio muerto y la imagen
  // al compartir el enlace salía rota. Si se configura ese subdominio en
  // Vercel/DNS, cambiarlo aquí y en el JSON-LD de abajo.
  metadataBase: new URL("https://contactform-socialmedias.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      es: "/es/links",
      en: "/en/links",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_US",
    alternateLocale: "en_US",
    siteName: "Manuel Solís Law Firm",
    title: "Abogados de Inmigración Manuel Solís | Houston, TX",
    description:
      "Arregla tu estatus migratorio sin salir del país con los Abogados Manuel Solís. Llama al +1 (346) 460-7278.",
    images: [
      {
        url: "/LogoInformacion.png",
        width: 800,
        height: 800,
        alt: "Manuel Solís Law Firm - Abogados de Inmigración",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abogados de Inmigración Manuel Solís",
    description:
      "Arregla tu estatus migratorio sin salir del país con los Abogados Manuel Solís.",
    images: ["/LogoInformacion.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#001540",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={outfit.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LegalService",
              name: "Manuel Solís Law Firm",
              description:
                "Abogados de inmigración en Houston, TX. Arregla tu estatus migratorio sin salir del país.",
              url: "https://contactform-socialmedias.vercel.app",
              telephone: "+1-346-460-7278",
              image: "https://contactform-socialmedias.vercel.app/LogoInformacion.png",
              areaServed: {
                "@type": "Country",
                name: "US",
              },
              serviceType: "Immigration Law",
              sameAs: [
                "https://www.facebook.com/AbogadoManuelSolisOficial/",
                "https://www.instagram.com/abogadomanuelsolisoficial/",
                "https://www.youtube.com/channel/UCWD61mNBq6qJ0BMhj_-a4Vg",
                "https://www.tiktok.com/@abogadomanuelsolisoficial",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#001540] text-white antialiased overflow-x-hidden">
        {/* Envolvemos toda la app con el proveedor de idioma */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}