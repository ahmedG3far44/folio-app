// import Footer from "@/components/Footer";
import ErrorMessage from "@/components/ErrorMessage";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/loader";
// import NavigationMenu from "@/components/NavigationMenu";
import ExperienceSection from "@/components/sections/ExperienceSection";
import Hero from "@/components/sections/Hero";
import ProjectSection from "@/components/sections/ProjectSection";
import SkillSection from "@/components/sections/SkillSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
// import { useTheme } from "@/contexts/ThemeProvider";
// import { useAuth } from "@/contexts/AuthProvider";
import { useUser } from "@/contexts/UserProvider";
import { useEffect, useState } from "react";
// import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function UserPage() {
  const { isAdmin } = useAuth();
  const { userId } = useParams();
  // const { userId } = params;
  const { activeTheme } = useTheme();
  const {
    bio,
    experiences,
    projects,
    testimonials,
    skills,
    contacts,
    setBio,
    setExperiences,
    setSkills,
    setTestimonials,
    setContacts,
    setProjects,
    setLayouts,
  } = useUser();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getUserInfoById = async (id: string) => {
    try {
      setPending(true);
      const response = await fetch(`${URL_SERVER}/user/${id}`);
      const info = await response.json();
      return info.data;
    } catch (err) {
      return { data: "error", message: err };
    } finally {
      setPending(false);
    }
  };
  console.log(userId, "my user params");
  useEffect(() => {
    getUserInfoById(userId as string)
      .then((data) => {
        console.log(data);
        const { bio, user, contacts, layouts } = data;
        setBio({ ...bio });
        setExperiences(user.ExperiencesList);
        setProjects(user.ProjectsList);
        setSkills(user.SkillsList);
        setTestimonials(user.Testimonials);
        setContacts({ ...contacts });
        setLayouts({ ...layouts });
      })
      .catch((err) => {
        setError(err.message);
        console.log((err as Error).message);
        return;
      });
  }, [userId]);

  if (isAdmin) return <Navigate to={"/dashboard/insights"} />;
  if (error) return <ErrorMessage message={error} />;
  return (
    <div
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.primaryText,
      }}
      className="w-full min-h-screen flex flex-col justify-between items-center"
    >
      <div className="max-w-full w-full lg:w-3/4  m-auto min-h-screen  flex flex-col gap-4 ">
        {!userId ? (
          <div className="min-h-full w-3/4 m-auto flex flex-col items-center justify-start text-2xl  font-bold">
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
              <div className="w-full flex flex-col items-center justify-around gap-20 p-4 lg:p-8">
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
