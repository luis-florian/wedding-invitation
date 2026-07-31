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

export const metadata: Metadata = {
  title: "Wedding RSVP",
  description: "Invitacion digital con confirmacion de asistencia"
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
