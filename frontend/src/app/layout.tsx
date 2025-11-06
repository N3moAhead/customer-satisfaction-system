import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import "./globals.css"
import { siteConfig } from "./siteConfig"

import { Sidebar } from "@/components/ui/navigation/Sidebar"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://github.com/N3moAhead/customer-satisfaction-system",
  ),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [],
  authors: [
    {
      name: "N3moAhead",
      url: "github.com/N3moAhead",
    },
    {
      name: "Driemtax",
      url: "https://github.com/Driemtax",
    },
    {
      name: "lucascherzer",
      url: "https://github.com/lucascherzer",
    },
  ],
  creator: "yourname",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} overflow-y-scroll scroll-auto antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950`}
        suppressHydrationWarning
      >
        <div className="mx-auto max-w-screen-2xl">
          <ThemeProvider defaultTheme="system" attribute="class">
            <Sidebar />
            <main className="lg:pl-72">{children}</main>
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
