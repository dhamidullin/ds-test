import type { Metadata } from "next";
import "./globals.css";
import { FC } from "react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Task Manager - a test project for ",
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
