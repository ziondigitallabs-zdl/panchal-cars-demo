import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Panchal Cars | Best Used Cars in Vadodara",
  description: "Panchal Cars is Vadodara's trusted used car dealership in Manjalpur. Buy and sell quality second-hand cars at affordable prices. Ready to drive!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-cream text-ink" suppressHydrationWarning>
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
