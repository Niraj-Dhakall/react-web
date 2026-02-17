"use client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomThemeProvider from "./components/ThemeProvider";
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
