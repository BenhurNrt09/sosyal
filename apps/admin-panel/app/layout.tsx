import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@repo/ui/lib/utils";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
    title: "Admin Paneli | Sosyal Görev Platformu",
    description: "Platform yönetim paneli.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
            <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
                {children}
            </body>
        </html>
    );
}
