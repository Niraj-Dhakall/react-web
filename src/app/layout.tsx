import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  Spline_Sans_Mono,
} from "next/font/google";
import "./globals.css";

/* Display face — used only for the name and the contact heading */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

/* Body face */
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

/* Utility face — labels, dates, captions, tags */
const splineMono = Spline_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-spline-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nirajd.dev"),
  title: "Niraj Dhakal — Software Engineer",
  description:
    "Software engineer with production experience building AI-powered systems and full-stack applications. Go, React, PostgreSQL, and RAG architecture — open to new-grad roles.",
  openGraph: {
    title: "Niraj Dhakal — Software Engineer",
    description:
      "Production experience building AI-powered systems and full-stack applications. Go · React · PostgreSQL · RAG.",
    url: "https://nirajd.dev",
    siteName: "nirajd.dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Niraj Dhakal — Software Engineer",
    description:
      "Production experience building AI-powered systems and full-stack applications.",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrument.variable} ${splineMono.variable}`}
    >
      <body className="antialiased">
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RWZ0R1L5BX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RWZ0R1L5BX');
          `}
        </Script>
      </body>
    </html>
  );
}
