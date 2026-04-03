import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";

// Configuración de la fuente Outfit globalmente
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abogados de Inmigración Manuel Solís | Consulta Gratis",
  description:
    "Abogados de inmigración en Houston, TX. Arregla tu estatus migratorio sin salir del país. Consulta gratuita. Llama ahora al 1-888-676-1238.",
  keywords: [
    "abogados de inmigración",
    "immigration lawyer Houston",
    "abogado Manuel Solís",
    "arreglar papeles sin salir",
    "consulta migratoria gratis",
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
  metadataBase: new URL("https://links.manuelsolis.com"),
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
    title: "Abogados de Inmigración Manuel Solís | Consulta Gratis",
    description:
      "Arregla tu estatus migratorio sin salir del país con los Abogados Manuel Solís. Consulta gratuita. Llama al 1-888-676-1238.",
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
      "Arregla tu estatus migratorio sin salir del país. Consulta gratuita.",
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
              url: "https://links.manuelsolis.com",
              telephone: "+1-888-676-1238",
              image: "https://links.manuelsolis.com/LogoInformacion.png",
              areaServed: {
                "@type": "Country",
                name: "US",
              },
              serviceType: "Immigration Law",
              priceRange: "Consulta Gratis",
              sameAs: [
                "https://www.facebook.com/AbogadoManuelSolisOficial/",
                "https://www.instagram.com/abogadomanuelsolisoficial/",
                "https://www.youtube.com/channel/UCWD61mNBq6qJ0BMhj_-a4Vg",
                "https://www.tiktok.com/@abogadomanuelsolisoficial",
                "https://www.linkedin.com/company/manuel-solis-law-firm/",
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
      </body>
    </html>
  );
}