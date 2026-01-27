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
  title: "Manuel Solís Law Firm | Links",
  description: "Abogados de Inmigración - Start your legal process today.",
  icons: {
    icon: "/LogoInformacion.png", // Asegúrate de que este logo exista en public/
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
      <body className="min-h-screen bg-[#001540] text-white antialiased overflow-x-hidden">
        {/* Envolvemos toda la app con el proveedor de idioma */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}