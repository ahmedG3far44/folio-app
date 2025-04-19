import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

function LandingPage() {
  return (
    <div className="p-4 w-full flex flex-col justify-between items-center md:p-8 lg:p-10 lg:w-3/4 m-auto min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default LandingPage;
