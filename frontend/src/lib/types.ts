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
  profile?: string;
  name: string;
  position: string;
  text?: string;
  video?: string;
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
