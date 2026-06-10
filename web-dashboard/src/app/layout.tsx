import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/components/SupabaseProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlobalChain | Enterprise Supply Chain Intelligence",
  description: "Futuristic global supply chain monitoring and risk propagation platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased dark`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-body" suppressHydrationWarning>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
