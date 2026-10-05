import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { Header } from "~/app/_components/header";

export const metadata: Metadata = {
  title: "Perf Shop",
  description: "Mock e-commerce app for performance testing",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="bg-gray-50 text-gray-900">
        <Header />
        {children}
      </body>
    </html>
  );
}
