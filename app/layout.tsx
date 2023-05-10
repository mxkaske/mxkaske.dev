import { ThemeProvider } from "@/components/theme/theme-provider";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";

const inter = Inter({ subsets: ["latin"] });

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export const metadata = {
  title: "craft.mxkaske.com",
  description: "My personal craft corner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ colorScheme: "system" }}>
      <body className={`${inter.className} ${calSans.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
