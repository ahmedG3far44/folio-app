import "./globals.css";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "./components/ui/themes/theme-provider";
import { Toaster } from "./components/ui/shadcn/toaster";
import NextTopLoader from "nextjs-toploader";
import { AuthProvider } from "./contexts/AuthProvider";

const pop = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: `Portfolio`,
  description: "create your own portfolio with less code experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={pop.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader />
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
