import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IEC Department Classifier",
  description:
    "Find the best department for you with our intelligent classification system",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const themeColor = "#0a0a0a";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="preload"
          href="/fonts/ITC Avant Garde Gothic Std Book.otf"
          as="font"
          type="font/otf"
          crossOrigin=""
        />
      </head>
      <body className="antialiased">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
