import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cover Letter Generator PRO",
  description: "Craft smarter, targeted cover letters that actually get noticed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark min-h-screen">
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {children}
        </main>
        <footer className="text-center py-4 text-sm text-muted-foreground">
          Powered by The IG Network
        </footer>
      </body>
    </html>
  );
}
