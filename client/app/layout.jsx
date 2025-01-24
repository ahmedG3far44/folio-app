import "./globals.css";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@themes/theme-provider";
import { Toaster } from "@shadcn/toaster";
import NextTopLoader from "nextjs-toploader";
import credentials from "@credentials";
const pop = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "400", "500", "600", "700", "800", "900"],
});

const { user, isLogged } = await credentials();
export const metadata = {
  title: isLogged ? `${user.given_name} Portfolio` : "Presento Portfolio App",
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
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
