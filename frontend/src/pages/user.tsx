// import Footer from "@/components/Footer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/loader";
// import NavigationMenu from "@/components/NavigationMenu";
import ExperienceSection from "@/components/sections/ExperienceSection";
import Hero from "@/components/sections/Hero";
import ProjectSection from "@/components/sections/ProjectSection";
import SkillSection from "@/components/sections/SkillSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import { useTheme } from "@/contexts/ThemeProvider";
// import { useTheme } from "@/contexts/ThemeProvider";
// import { useAuth } from "@/contexts/AuthProvider";
import { useUser } from "@/contexts/UserProvider";
import { useParams } from "react-router-dom";

// const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function UserPage() {
  const { userId } = useParams();
  const { activeTheme } = useTheme();
  const {
    pending,
    bio,
    experiences,
    projects,
    testimonials,
    skills,
    contacts,
  } = useUser();
  // const { themesList } = useTheme();

  return (
    <div
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.primaryText,
      }}
      className="w-full min-h-screen flex flex-col justify-between items-center"
    >
      <div className="max-w-full w-full lg:w-3/4  m-auto min-h-screen p-4 flex flex-col gap-4 ">
        {!userId ? (
          <div className="min-h-full w-3/4 m-auto flex flex-col items-center justify-start text-2xl text-zinc-500 font-bold">
            <h1 className="text-4xl font-black">404 not found</h1>
            <h4>there is not user profile found.</h4>
          </div>
        ) : (
          <>
            {pending ? (
              <div className="min-h-screen w-full flex items-center justify-center">
                <Loader size="md" />
              </div>
            ) : (
              <div className="w-full space-y-20">
                <Header />
                <Hero bioInfo={bio} contacts={contacts} />
                <ExperienceSection experiences={experiences} />
                <ProjectSection projects={projects} />
                <SkillSection skills={skills} />
                <TestimonialSection testimonials={testimonials} />
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default UserPage;
