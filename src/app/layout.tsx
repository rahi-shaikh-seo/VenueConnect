import type { Metadata } from "next";
import { Inter, Jost, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "VenueConnect | Find Wedding Venues & Vendors in Gujarat",
  description: "Discover and book the best wedding venues, banquet halls, photographers, and more in Ahmedabad, Surat, Baroda, and across Gujarat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jost.variable} ${cormorantGaramond.variable} antialiased font-sans`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
