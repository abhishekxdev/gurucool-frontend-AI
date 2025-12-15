import { ThemeProvider } from "@/components/ui/theme-provides";
import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import { Instrument_Serif, Inter, Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GuruCool AI",
  description:
    "An intelligent AI-powered learning platform that helps students and educators enhance their educational experience with personalized guidance and smart tools.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} antialiased ${instrumentSerif.className} ${inter.variable}  bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ViewTransitions>
            <main className="">{children}</main>
          </ViewTransitions>
          <Toaster position="bottom-center" theme="system" />
        </ThemeProvider>
      </body>
    </html>
  );
}
