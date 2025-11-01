import type { Metadata } from "next";
import "./globals.css";
import VersionFooter from "@/components/VersionFooter";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";
import CommandPalette from "@/components/CommandPalette";
import QuickActionsMenu from "@/components/QuickActionsMenu";
import SkipLinks from "@/components/SkipLinks";
import { Toaster } from "react-hot-toast";
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://proposifyai.com'),
  title: {
    default: "Proposify AI - AI-Powered Proposal Management",
    template: "%s | Proposify AI"
  },
  description: "Close deals faster with AI-powered proposals. Transform 8 hours of proposal work into 5 minutes with AI. Generate, track, and close deals with proposifyai.com",
  keywords: ["AI proposals", "proposal software", "proposal management", "AI-powered proposals", "sales proposals", "business proposals", "proposal generator", "proposal automation", "sales automation", "B2B sales"],
  authors: [{ name: "Bettroi", url: "https://proposifyai.com" }],
  creator: "Bettroi",
  publisher: "Proposify AI",
  applicationName: "Proposify AI",
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Proposify AI",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#3b82f6',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://proposifyai.com",
    title: "Proposify AI - AI-Powered Proposal Management",
    description: "Close deals faster with AI-powered proposals. Transform 8 hours of proposal work into 5 minutes. Win more business with intelligent proposals.",
    siteName: "Proposify AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Proposify AI - AI-Powered Proposal Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Proposify AI - AI-Powered Proposal Management",
    description: "Transform 8 hours of proposal work into 5 minutes with AI. Close more deals faster.",
    images: ["/og-image.png"],
    creator: "@proposifyai",
  },
  alternates: {
    canonical: "https://proposifyai.com",
  },
  verification: {
    google: "verification_token_here",
  },
  other: {
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <SkipLinks />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <main id="main-content" role="main">
          {children}
        </main>
        <CommandPalette />
        <KeyboardShortcutsModal />
        <QuickActionsMenu />
        <footer id="footer" role="contentinfo">
          <VersionFooter />
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
