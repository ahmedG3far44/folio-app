/* eslint-disable react-hooks/exhaustive-deps */
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

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

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

  // Generate structured data for the portfolio
  const generateStructuredData = () => {
    if (!bio) return null;

    const structuredData: Record<string, any> = {
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

    // Add CreativeWork for projects
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

  // Generate meta description
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

  // Generate page title
  const generatePageTitle = () => {
    if (!bio) return "Portfolio | Folio";

    const name = bio?.bioName || "Tech Professional";
    const role = bio?.jobTitle || "Software Developer";

    if (role) {
      return `${name} - ${role} | Portfolio`;
    }
    return `${name} | Portfolio`;
  };

  // Generate keywords
  const generateKeywords = () => {
    const keywords = ["portfolio", "tech professional"];

    if (bio?.jobTitle) keywords.push(bio.jobTitle);

    skills.forEach((skill) => {
      if (skill.skillName) keywords.push(skill.skillName);
      if (skill.skillName) keywords.push(skill.skillName);
    });

    return keywords.slice(0, 15).join(", ");
  };

  if (isAdmin) return <Navigate to={"/dashboard/insights"} />;
  if (error) return <ErrorMessage message={error} />;

  if (pending)
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );

  const structuredData = generateStructuredData();

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{generatePageTitle()}</title>
        <meta name="title" content={generatePageTitle()} />
        <meta name="description" content={generateMetaDescription()} />
        <meta name="keywords" content={generateKeywords()} />
        <link
          rel="canonical"
          href={`${window.location.origin}/user/${userId}`}
        />

        {/* Open Graph / Facebook */}
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

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={`${window.location.origin}/user/${userId}`}
        />
        <meta property="twitter:title" content={generatePageTitle()} />
        <meta
          property="twitter:description"
          content={generateMetaDescription()}
        />
        {bio?.heroImage && (
          <meta property="twitter:image" content={bio.heroImage} />
        )}

        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        {bio?.bioName && <meta name="author" content={bio.bioName} />}

        {/* Structured Data */}
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
        className="w-full min-h-screen flex flex-col justify-between items-center"
      >
        <div className="max-w-full w-full lg:w-3/4 m-auto min-h-screen flex flex-col gap-4">
          {!userId ? (
            <main className="min-h-full w-3/4 m-auto flex flex-col items-center justify-start text-2xl font-bold">
              <h1 className="text-4xl font-black">404 Not Found</h1>
              <h2>There is no user profile found.</h2>
            </main>
          ) : (
            <main className="w-full flex flex-col items-center justify-around gap-20 p-4 lg:p-8">
              <Header />
              <Hero bioInfo={bio} contacts={contacts} />
              {experiences.length > 0 && (
                <ExperienceSection experiences={experiences} />
              )}
              {projects.length > 0 && <ProjectSection projects={projects} />}
              {skills.length > 0 && <SkillSection skills={skills} />}
              {testimonials.length > 0 && (
                <TestimonialSection testimonials={testimonials} />
              )}
            </main>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default UserPage;
