import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IEC Department Classifier",
  description: "Find the best department for you with our intelligent classification system",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preload" href="/workspace/IEC-dept-classifier-game/app/fonts/ITC Avant Garde Gothic Std Book.otf" as="font" type="font/otf" crossOrigin="" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}