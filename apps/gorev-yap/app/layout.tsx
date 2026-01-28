import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@repo/ui";

const outfit = Outfit({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
    title: "Dijital Havuz | Sosyal Görev Platformu",
    description: "Görev ver, etkileşimini artır.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
            <body className={cn("min-h-screen bg-background font-sans antialiased", outfit.className)}>
                {children}
            </body>
        </html>
    );
}
