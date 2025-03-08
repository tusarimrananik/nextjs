import type { Metadata } from "next";
import "./globals.css";
import { JetBrains_Mono } from 'next/font/google';
import Navbar from "@/components/Navbar"
import { SessionProvider } from "next-auth/react";
import QueryProvider from "@/components/QueryProvider";


const jetBrainsMono = JetBrains_Mono({
  variable: '--font-hacker',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false, // Disables auto adjustment for monospace fonts
});


export const metadata: Metadata = {
  title: "Social Hacker",
  description: "Social Hacker is a tool that allows you to hack any social media account.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (


    <html lang="en" className="dark">

      <SessionProvider>


        <body
          className={`${jetBrainsMono.variable} ${jetBrainsMono.variable} antialiased`}
        >
          <Navbar />


          <QueryProvider>
            {children}
          </QueryProvider>

        </body>

      </SessionProvider>

    </html >
  );
}
