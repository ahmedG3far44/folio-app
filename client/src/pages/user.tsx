import { IThemeType } from "@/lib/types";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { useUser } from "@/contexts/UserProvider";

import toast from "react-hot-toast";
import Header from "@/components/Header";
import Loader from "@/components/loader";
import Hero from "@/components/sections/Hero";
import Footer from "@/components/Footer";
import ErrorMessage from "@/components/ErrorMessage";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectSection from "@/components/sections/ProjectSection";
import SkillSection from "@/components/sections/SkillSection";
import TestimonialSection from "@/components/sections/TestimonialSection";

const URL_SERVER = import.meta.env.VITE_API_URL as string;

function UserPage() {
  const { isAdmin } = useAuth();
  const { userId } = useParams();
  const { activeTheme, setActiveTheme } = useTheme();
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
      return { data: "error", message: (err as Error).message };
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    getUserInfoById(userId as string)
      .then((data) => {
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
        return;
      });

    async function fetchTheme(userId: string) {
      try {
        setPending(true);
        const theme = await getUnAuthorizedActiveTheme(userId);

        if (theme) {
          setActiveTheme(theme);
        }
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setPending(false);
      }
    }
    fetchTheme(userId as string);
  }, [userId]);

  const getUnAuthorizedActiveTheme = async (userId: string) => {
    try {
      if (!userId) return;

      const response = await fetch(`${URL_SERVER}/theme/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          "can't get user active theme, please check your connection!!"
        );
      }
      const data = await response.json();

      const theme: IThemeType = data.data;

      return theme;
    } catch (err) {
      console.log((err as Error).message);
      return;
    }
  };

  const generateStructuredData = () => {
    if (!bio) return null;

    const structuredData: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: bio.bioName || "Tech Professional",
      jobTitle: bio.jobTitle || "Software Developer",
      description: bio.bio || bio.bio,
      url: `${window.location.origin}/user/${userId}`,
      ...(bio.heroImage && { image: bio.heroImage }),
      ...(contacts?.github && { github: contacts.github }),
      ...(contacts?.linkedin && { linkedin: contacts.linkedin }),
    };

    if (projects.length > 0) {
      structuredData["workExample"] = projects.map((project) => ({
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        ...(project.source && { url: project.source }),
        ...(project.thumbnail && { image: project.thumbnail }),
        ...(project.tags &&
          project.tags.length > 0 && {
            keywords: project.tags.map((tag) => tag.tagName).join(", "),
          }),
      }));
    }

    return structuredData;
  };

  const generateMetaDescription = () => {
    if (!bio)
      return "Professional tech portfolio showcasing projects, skills, and experience.";

    const parts = [];
    if (bio.bioName) parts.push(bio.bioName);
    if (bio.jobTitle || bio.jobTitle) parts.push(bio.jobTitle);
    if (bio.bio || bio.bio) {
      const bioText = (bio.bio || bio.bio).substring(0, 100);
      parts.push(bioText);
    }

    return (
      parts.join(" - ") + ". View portfolio, projects, skills, and experience."
    );
  };

  const generatePageTitle = () => {
    if (!bio) return "Portfolio | Folio";

    const name = bio?.bioName || "Tech Professional";
    const role = bio?.jobTitle || "Software Developer";

    if (role) {
      return `${name} - ${role} | Portfolio`;
    }
    return `${name} | Portfolio`;
  };

  const generateKeywords = () => {
    const keywords = ["portfolio", "tech professional"];

    if (bio?.jobTitle) keywords.push(bio.jobTitle);

    skills.forEach((skill) => {
      if (skill.skillName) keywords.push(skill.skillName);
    });

    return keywords.slice(0, 15).join(", ");
  };

  if (isAdmin) return <Navigate to={"/dashboard/insights"} />;
  if (error) return <ErrorMessage message={error} />;

  if (pending)
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: activeTheme?.backgroundColor, color: activeTheme?.primaryText }}
      >
        <Loader size="lg" />
      </div>
    );

  const structuredData = generateStructuredData();

  return (
    <>
      <Helmet>
        <title>{generatePageTitle()}</title>
        <meta name="title" content={generatePageTitle()} />
        <meta name="description" content={generateMetaDescription()} />
        <meta name="keywords" content={generateKeywords()} />
        <link
          rel="canonical"
          href={`${window.location.origin}/user/${userId}`}
        />

        <meta property="og:type" content="profile" />
        <meta
          property="og:url"
          content={`${window.location.origin}/user/${userId}`}
        />
        <meta property="og:title" content={generatePageTitle()} />
        <meta property="og:description" content={generateMetaDescription()} />
        {bio?.heroImage && <meta property="og:image" content={bio.heroImage} />}
        {bio?.bioName && (
          <meta
            property="profile:first_name"
            content={bio.bioName.split(" ")[0]}
          />
        )}
        {bio?.bioName && (
          <meta
            property="profile:last_name"
            content={bio.bioName.split(" ").slice(1).join(" ")}
          />
        )}

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={`${window.location.origin}/user/${userId}`}
        />
        <meta property="twitter:title" content={generatePageTitle()} />
        <meta property="twitter:description" content={generateMetaDescription()} />
        {bio?.heroImage && (
          <meta property="twitter:image" content={bio.heroImage} />
        )}

        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        {bio?.bioName && <meta name="author" content={bio.bioName} />}

        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>

      <div
        style={{
          backgroundColor: activeTheme?.backgroundColor,
          color: activeTheme?.primaryText,
        }}
        className="w-full min-h-screen flex flex-col"
      >
        {!userId ? (
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="text-center space-y-4">
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight">404</h1>
              <p className="text-lg opacity-60">No profile found for this user.</p>
            </div>
          </main>
        ) : (
          <>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Header />
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-24 md:space-y-32 lg:space-y-40 py-8 md:py-12">
                <section id="hero"><Hero bioInfo={bio} contacts={contacts} /></section>

                {experiences.length > 0 && (
                  <section id="experience">
                    <h2 className="text-sm font-semibold tracking-widest uppercase mb-6" style={{ color: activeTheme?.secondaryText }}>
                      Experience
                    </h2>
                    <ExperienceSection experiences={experiences} />
                  </section>
                )}

                {projects.length > 0 && (
                  <section id="projects">
                    <h2 className="text-sm font-semibold tracking-widest uppercase mb-6" style={{ color: activeTheme?.secondaryText }}>
                      Projects
                    </h2>
                    <ProjectSection projects={projects} />
                  </section>
                )}

                {skills.length > 0 && (
                  <section id="skills">
                    <h2 className="text-sm font-semibold tracking-widest uppercase mb-6" style={{ color: activeTheme?.secondaryText }}>
                      Skills
                    </h2>
                    <SkillSection skills={skills} />
                  </section>
                )}

                {testimonials.length > 0 && (
                  <section id="testimonials">
                    <h2 className="text-sm font-semibold tracking-widest uppercase mb-6" style={{ color: activeTheme?.secondaryText }}>
                      Testimonials
                    </h2>
                    <TestimonialSection testimonials={testimonials} />
                  </section>
                )}
              </div>
            </main>

            <Footer />
          </>
        )}
      </div>
    </>
  );
}

export default UserPage;
