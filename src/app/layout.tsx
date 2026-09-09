import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SessionProvider from "@/components/SessionProvider";
import SkipToContent from "@/components/SkipToContent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://petsaathi-blue.vercel.app"),
  title: "PetSaathi | Trusted Pet Walkers & Sitters in India",
  description: "Find trusted, verified, and caring pet sitters and dog walkers near you. India's premium pet care service.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PetSaathi",
  },
  openGraph: {
    title: "PetSaathi | Trusted Pet Walkers & Sitters in India",
    description: "Find trusted, verified, and caring pet sitters and dog walkers near you. India's premium pet care service.",
    url: "https://petsaathi-blue.vercel.app",
    siteName: "PetSaathi",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PetSaathi | Trusted Pet Walkers & Sitters in India",
    description: "Find trusted, verified, and caring pet sitters and dog walkers near you. India's premium pet care service.",
  },
};

export const viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans selection:bg-primary-500 selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "PetSaathi",
              "url": "https://petsaathi-blue.vercel.app",
              "description": "Find trusted, verified, and caring pet sitters and dog walkers near you. India's premium pet care service.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              }
            })
          }}
        />
        <SkipToContent />
        <SessionProvider>
          <CustomCursor />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
