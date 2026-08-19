import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const wpOrigin = process.env.WORDPRESS_API_URL
  ? new URL(process.env.WORDPRESS_API_URL).origin
  : undefined;

export const metadata: Metadata = {
  title: {
    default: "Mobit",
    template: "%s | Mobit",
  },
  description: "A headless WordPress site built with Next.js.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Warm up the connection to the WP media/API origin so the first
            image and API request don't pay DNS/TLS/TCP setup cost. */}
        {wpOrigin && <link rel="preconnect" href={wpOrigin} crossOrigin="" />}
        {wpOrigin && <link rel="dns-prefetch" href={wpOrigin} />}
      </head>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
