import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeProvider";
import { Outlet } from "react-router-dom";

function LandingPage() {
  const { activeTheme } = useTheme();
  return (
    <div
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.primaryText,
      }}
      className="w-full flex flex-col justify-between items-center  m-auto min-h-screen"
    >
      <Container>
        <Header />
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}

export default LandingPage;
