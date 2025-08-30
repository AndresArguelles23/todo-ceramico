import type { Metadata } from "next";
import "../styles/globals.css"; // si lo usas

export const metadata: Metadata = {
  title: {
    default: "Todo ceramico",
    template: "%s | Todo ceramico",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
