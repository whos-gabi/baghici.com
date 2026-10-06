import type { Metadata, Viewport } from "next";
import { Instrument_Sans, JetBrains_Mono, Unbounded } from "next/font/google";
import Script from "next/script";
import { site } from "@/content/site";
import "./globals.css";

const display = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://baghici.com"),
  title: site.meta.title,
  description: site.meta.description,
  openGraph: {
    title: site.meta.title,
    description: site.meta.description,
    type: "website",
    url: "https://baghici.com",
    siteName: site.brand.name,
  },
  twitter: { card: "summary", title: site.meta.title, description: site.meta.description },
};

export const viewport: Viewport = { themeColor: "#0A0A0F" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The inline script below adds the "js" class before hydration, hence suppressHydrationWarning.
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Reveal animations only hide content when JS is available to show it again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-WN07WSC84E" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WN07WSC84E');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
