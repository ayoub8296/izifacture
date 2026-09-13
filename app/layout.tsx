import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import StorageInitializer from "@/components/StorageInitializer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "izi facture — Facturation SaaS pour PME et Entrepreneurs",
  description: "Solution moderne de facturation et devis en FCFA pour entrepreneurs en Afrique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('izi_theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased min-h-screen transition-colors duration-200">
        <ThemeProvider>
          <StorageInitializer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
