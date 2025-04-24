import type { Metadata } from "next";
import "./globals.css";
import { FC } from "react";
import { Toaster } from "sonner";
import { getSiteUrl } from "@/lib/config";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Task Manager",
    template: "%s | Task Manager", // Template for page-specific titles
  },
  description: "A simple todo application built with Next.js, Express, and PostgreSQL.",
  openGraph: {
    title: "Task Manager",
    description: "A simple todo application built with Next.js, Express, and PostgreSQL.",
    url: siteUrl,
    siteName: "Task Manager",
    images: [
      {
        url: '/og-image.png',
        width: 782,
        height: 388,
        alt: 'Task Manager Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Task Manager",
    description: "A simple todo application built with Next.js, Express, and PostgreSQL.",
  },
};

const RootLayout: FC<Readonly<{ children: React.ReactNode }>> = ({ children }) => {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

export default RootLayout
