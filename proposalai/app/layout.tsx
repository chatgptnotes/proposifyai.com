import type { Metadata } from "next";
import "./globals.css";
import VersionFooter from "@/components/VersionFooter";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";
import CommandPalette from "@/components/CommandPalette";
import QuickActionsMenu from "@/components/QuickActionsMenu";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Proposify AI - AI-Powered Proposal Management",
  description: "Close deals faster with AI-powered proposals. Transform hours of proposal work into minutes with proposifyai.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
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
        {children}
        <CommandPalette />
        <KeyboardShortcutsModal />
        <QuickActionsMenu />
        <VersionFooter />
      </body>
    </html>
  );
}
