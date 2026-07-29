import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetSaathi | Trusted Pet Walkers & Sitters in India",
  description: "Find trusted, verified, and caring pet sitters and dog walkers near you. India's premium pet care service.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PetSaathi",
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
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
