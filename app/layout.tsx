import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "AudarOqu",
    description: "Learn English by reading books",
};

import { LanguageProvider } from "@/contexts/LanguageContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased" suppressHydrationWarning>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}
