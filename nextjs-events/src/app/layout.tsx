
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/components/ClientProvider";
import AuthGuard from "@/components/AuthGuard"; 
import Navbar from "@/components/ui/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Eventos App',
  description: 'Sistema de Reservas de Eventos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProvider>
          <AuthGuard>
          {token && <Navbar />}
            {children}
          </AuthGuard>
        </ClientProvider>
      </body>
    </html>
  );
}
