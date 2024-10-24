import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { Nunito, Rubik } from "next/font/google"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const nunito = Nunito({
  weight: ["400", "500", "600", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-nunito"
})

const rubik = Rubik({
  weight: ["400", "500", "600", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-rubik"
})

export const metadata: Metadata = {
  title: "mustaboard",
  description: "UiO Gaming's informational screen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${nunito.variable} ${rubik.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
