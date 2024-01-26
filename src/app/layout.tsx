import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "burrito.place",
  description: "feed of burritos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-burrito-200">{children}</body>
    </html>
  );
}
