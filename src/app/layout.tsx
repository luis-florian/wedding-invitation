import type { Metadata, Viewport } from "next";
import { Cardo, Cormorant_Garamond, Inter } from "next/font/google";
import "@/styles/globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["500", "600", "700"]
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

const cardo = Cardo({
  subsets: ["latin"],
  variable: "--font-cardo",
  weight: "400"
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://nathalyluis.com");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Nathaly & Luis | Nuestra boda 💍",
  description: "Consulta todos los detalles del evento y confirma tu asistencia. ¡Te esperamos!",
  openGraph: {
    title: "Nathaly & Luis | Nuestra boda 💍",
    description: "Consulta todos los detalles del evento y confirma tu asistencia. ¡Te esperamos!",
    type: "website",
    locale: "es_GT",
    images: [
      {
        url: "/og-nathaly-luis.jpg",
        width: 1424,
        height: 752,
        alt: "Nathaly y Luis | Nuestra boda"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Nathaly & Luis | Nuestra boda 💍",
    description: "Consulta todos los detalles del evento y confirma tu asistencia. ¡Te esperamos!",
    images: ["/og-nathaly-luis.jpg"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable} ${cardo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
