import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { getSiteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getSiteConfig();
  return {
    title: {
      default: cfg.metaTitle,
      template: `%s · ${cfg.brandName}`,
    },
    description: cfg.metaDescription,
    openGraph: {
      title: cfg.metaTitle,
      description: cfg.metaDescription,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
