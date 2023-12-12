import { BGGrid } from "@/components/craft/bg-grid";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export const metadata: Metadata = {
  title: "craft.mxkaske.dev",
  description: "Never stop crafting.",
  metadataBase: new URL("https://craft.mxkaske.dev"),
  twitter: {
    images: [`/api/og`],
    card: "summary_large_image",
    title: "craft.mxkaske.dev",
    description: "Never stop crafting.",
  },
  openGraph: {
    type: "website",
    images: [`/api/og`],
    title: "craft.mxkaske.dev",
    description: "Never stop crafting.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ colorScheme: "system" }}>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BGGrid>{children}</BGGrid>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
