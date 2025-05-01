import { ReactNode } from "react";

export interface IUserType {
  id: string;
  name: string | null;
  email: string | null;
  picture: string | null;
  role: string | "USER" | "ADMIN";
  resume: string;
}

export interface IAuthContextType {
  user: IUserType;
  token: string;
  isLogged: boolean;
  isAdmin: boolean;
  login: ({ user, token }: { user: IUserType; token: string }) => void;
  logout: () => void;
}

export interface UserInfoContextType {
  bio: IBioType;
  experiences: IExperienceType[];
  projects: IProjectType[];
  skills: ISkillType[];
  testimonials: ITestimonialType[];
  layouts: ILayoutType;
  contacts: IContactType;
  pending: boolean;
  error: string;
  setLayouts: (newLayout: ILayoutType) => void;
  getUserInfo: (userId: string) => Promise<UserInfoContextType>;
  // handleUserInfo: (id: string) => void;
  setBio: (bio: IBioType) => void;
  setExperiences: (newExperience: IExperienceType[]) => void;
  setProjects: (newProjects: IProjectType[]) => void;
  setSkills: (newSkill: ISkillType[]) => void;
  setTestimonials: (newTestimonials: ITestimonialType[]) => void;
  setContacts: (contacts: IContactType) => void;
}

export interface IBioType {
  id: string;
  bio: string;
  heroImage: string;
  bioName: string;
  jobTitle: string;
}
export interface IProjectType {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  ImagesList: IProjectImagesType[];
  tags?: IProjectTagType[];
  source: string;
  likes?: number;
  views?: number;
}
export interface IProjectImagesType {
  id: string;
  url: string;
}
export interface IProjectTagType {
  id: string;
  tagName: string;
}
export interface ITestimonialType {
  id: string;
  profile: string;
  name: string;
  feedback: string;
  video: string;
  position: string;
  createdAt: Date;
}
export interface ISkillType {
  id: string;
  skillName: string;
  skillLogo: string;
}
export interface IExperienceType {
  id: string;
  cName: string;
  cLogo: string;
  position: string;
  duration: string;
  role: string;
  location: string;
}
export interface ILayoutType {
  id: string;
  heroLayout: string;
  expLayout: string;
  projectsLayout: string;
  skillsLayout: string;
}
export interface IContactType {
  id: string;
  linkedin: string;
  github: string;
  youtube: string;
  twitter: string;
}

export interface UploadFileType {
  url: string | null;
  size: number;
  name: string;
  type: string;
}
export interface IThemeType {
  id?: string;
  backgroundColor: string;
  cardColor: string;
  primaryText: string;
  secondaryText: string;
  borderColor: string;
}

export interface IFeatureType {
  icon: ReactNode;
  title: string;
  text: string;
}

export interface ThemeContextType {
  activeTheme: IThemeType;
  themesList: IThemeType[];
  switchTheme: ({ newActiveTheme }: { newActiveTheme: IThemeType }) => void;
}

export interface IActiveLayout {
  parent: {
    default: string;
    medium: string;
    minimal: string;
    wizzard: string;
    accent: string;
  };
  child: {
    default: string;
    medium: string;
    minimal: string;
    wizzard: string;
    accent: string;
  };
}