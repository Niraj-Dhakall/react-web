"use client";
import Script from "next/script";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ActivePageProvider } from "./context/ActivePageContext";
import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'YOUR_GA_ID');
        `}
      </Script>
      <body className="min-h-screen flex flex-col bg-black text-white">
        <Providers>
          <ActivePageProvider>
            <Navbar />
            <main className="flex-grow py-6 container mx-auto px-4">
              {children}
            </main>
            <Footer />
          </ActivePageProvider>
        </Providers>
      </body>
    </html>
  );
}
