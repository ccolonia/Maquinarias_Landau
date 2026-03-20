import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Maquinarias Landau | Potencia y Precisión desde 1949",
  description: "Distribuidores oficiales de Bosch y Makita. Más de 75 años liderando en herramientas industriales. Venta de maquinaria eléctrica y neumática con servicio técnico propio.",
  keywords: ["Maquinarias Landau", "Bosch", "Makita", "herramientas industriales", "maquinaria eléctrica", "maquinaria neumática", "servicio técnico", "Colombia"],
  authors: [{ name: "Maquinarias Landau" }],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "Maquinarias Landau | Potencia y Precisión desde 1949",
    description: "Distribuidores oficiales de Bosch y Makita. Más de 75 años liderando en herramientas industriales.",
    url: "https://maquinariaslandau.com",
    siteName: "Maquinarias Landau",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maquinarias Landau",
    description: "Distribuidores oficiales de Bosch y Makita. Más de 75 años de experiencia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${inter.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
