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
  setLayouts: () => {},
  getUserInfo: async () => Promise.resolve({} as UserInfoContextType),
  // handleUserInfo: () => {},
  setBio: () => {},
  setExperiences: () => {},
  setProjects: () => {},
  setSkills: () => {},
  setTestimonials: () => {},
  setContacts: () => {},
});

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const { userId } = useParams();

  const [bio, setBio] = useState<IBioType>();
  const [experiences, setExperiences] = useState<IExperienceType[]>();
  const [projects, setProjects] = useState<IProjectType[]>();
  const [skills, setSkills] = useState<ISkillType[]>();
  const [testimonials, setTestimonials] = useState<ITestimonialType[]>();
  const [userContacts, setContacts] = useState<IContactType>();
  const [userLayouts, setLayouts] = useState<ILayoutType>({
    id: "1",
    heroLayout: "1",
    expLayout: "1",
    projectsLayout: "1",
    skillsLayout: "1",
  });
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

  // const handleUserInfo = async (userId: string) => {
  //   try {
  //     const data = await getUserInfoById(userId);
  //     const { bio, user, contacts, layouts } = data;
  //     setBio({ ...bio });
  //     setExperiences(user.ExperiencesList);
  //     setProjects(user.ProjectsList);
  //     setSkills(user.SkillsList);
  //     setTestimonials(user.Testimonials);
  //     setContacts({ ...contacts });
  //     setLayouts({ ...layouts });
  //     return data;
  //   } catch (err) {
  //     setError((err as Error).message);
  //     return;
  //   }
  // };
  useEffect(() => {
    getUserInfoById(userId ? userId : user?.id)
      .then((data) => {
        const { bio, user, contacts, layouts } = data;
        setBio({ ...bio });
        setExperiences(user?.ExperiencesList);
        setProjects(user?.ProjectsList);
        setSkills(user?.SkillsList);
        setTestimonials(user?.Testimonials);
        setContacts({ ...contacts });
        setLayouts({ ...layouts });
      })
      .catch((error) => {
        setError(error.message);
        return;
      });
  }, [user?.id, userId]);

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
        setLayouts: (newLayout: ILayoutType) => setLayouts({ ...newLayout }),
        getUserInfo: (userId: string) => getUserInfoById(userId),
        setBio: (bio: IBioType) => setBio({ ...bio }),
        setExperiences: (experience: IExperienceType[]) =>
          setExperiences(experience),
        setProjects: (projects: IProjectType[]) => setProjects(projects),
        setSkills: (skills: ISkillType[]) => setSkills(skills),
        setTestimonials: (testimonials: ITestimonialType[]) =>
          setTestimonials(testimonials),
        setContacts: (contacts: IContactType) => setContacts({ ...contacts }),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
