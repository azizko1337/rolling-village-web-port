import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Rolling Village",
  description: "Port gry planszowej Print&Play The Rolling Village do przeglądarki.",
  authors: [{ name: "Antoni Załupka", url: "https://azalupka.cc" }, {name: "Bartłomiej Marzec", url: "https://www.bartlomiejmarzec.pl/"},],
  keywords: ["The Rolling Village", "Rolling Village", "gra planszowa", "board game", "print and play", "P&P", "planszówka", "planszowa", "game", "browser game", "web game"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Patrick+Hand&family=Rock+Salt&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
