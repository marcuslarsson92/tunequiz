//app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "./components/Header";
import Footer from "./components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TuneQuiz",
  description: "App using spotify for creating quizes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
            <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-black to-blue-900 flex flex-col`}
      >
        <Providers>
          {/* Center everything inside a flex container */}
          <div className="flex flex-col items-center w-full">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center w-full">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
