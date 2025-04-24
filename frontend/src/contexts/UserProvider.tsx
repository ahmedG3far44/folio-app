import {
  IBioType,
  IContactType,
  IExperienceType,
  ILayoutType,
  IProjectType,
  ISkillType,
  ITestimonialType,
  UserInfoContextType,
} from "@/lib/types";

import { FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useAuth } from "./AuthProvider";
import { useParams } from "react-router-dom";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

export const UserContext = createContext<UserInfoContextType>({
  bio: {
    id: "",
    jobTitle: "",
    heroImage: "",
    bio: "",
    bioName: "",
  },
  experiences: [],
  projects: [],
  skills: [],
  testimonials: [],
  layouts: {
    id: "",
    heroLayout: "",
    expLayout: "",
    skillsLayout: "",
    projectsLayout: "",
  },
  contacts: {
    id: "",
    linkedin: "",
    github: "",
    youtube: "",
    twitter: "",
  },
  pending: false,
  error: "",
  getUserInfo: async () => Promise.resolve({} as UserInfoContextType),
});

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const params = useParams();

  const [bio, setBio] = useState<IBioType>();
  const [experiences, setExperiences] = useState<IExperienceType[]>();
  const [projects, setProjects] = useState<IProjectType[]>();
  const [skills, setSkills] = useState<ISkillType[]>();
  const [testimonials, setTestimonials] = useState<ITestimonialType[]>();
  const [userContacts, setContacts] = useState<IContactType>();
  const [userLayouts, setLayouts] = useState<ILayoutType>();
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

  useEffect(() => {
    if (!user?.id) return;

    getUserInfoById((params.userId as string) || user.id)
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
      .catch((error) => {
        setError(error.message);
        return;
      });
  }, [user?.id, params.userId]);

  return (
    <UserContext.Provider
      value={{
        bio: bio as IBioType,
        experiences: experiences || [],
        projects: projects || [],
        skills: skills || [],
        testimonials: testimonials || [],
        contacts: userContacts as IContactType,
        layouts: userLayouts as ILayoutType,
        pending,
        error: error || "",
        getUserInfo: () => getUserInfoById(user?.id || ""),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
