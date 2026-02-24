// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oasis Portal",
  description: "Cell Leader access portal",
  icons: {
    icon: "/favicon.ico", // add your own favicon later
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white antialiased">
        {/* You can add global providers here later (e.g. ThemeProvider, AuthProvider, Toaster etc.) */}
        {children}
      </body>
    </html>
  );
}