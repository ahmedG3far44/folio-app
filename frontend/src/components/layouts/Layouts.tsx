import { ReactNode, ChangeEvent, FormEvent, useState } from "react";
import { IActiveLayout } from "@/lib/types";

import { useUser } from "@/contexts/UserProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { LucideSave } from "lucide-react";

import toast from "react-hot-toast";
import SubmitButton from "../submit-button";
import layoutJson from "@/lib/layouts.json";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

export const ApplyLayout = ({
  sectionName,
  type,
  children,
}: {
  children: ReactNode;
  type: string | "parent" | "child";
  sectionName:
    | string
    | "heroLayout"
    | "expLayout"
    | "projectsLayout"
    | "skillsLayout";
}) => {
  const { layouts } = useUser();
  const { heroLayout, expLayout, projectsLayout, skillsLayout } = layoutJson;
  let activeLayoutSection: IActiveLayout;
  switch (sectionName) {
    case "heroLayout":
      activeLayoutSection = heroLayout;
      break;
    case "expLayout":
      activeLayoutSection = expLayout;
      break;
    case "projectsLayout":
      activeLayoutSection = projectsLayout;
      break;
    case "skillsLayout":
      activeLayoutSection = skillsLayout;
      break;
    default:
      break;
  }
  const { parent, child } = activeLayoutSection! as IActiveLayout;
  return (
    <div
      className={
        sectionName === "heroLayout"
          ? layouts?.heroLayout === "1"
            ? type === "parent"
              ? parent.default
              : child.default
            : layouts?.heroLayout === "2"
            ? type === "parent"
              ? parent.medium
              : child.medium
            : layouts?.heroLayout === "3"
            ? type === "parent"
              ? parent.minimal
              : child.minimal
            : layouts?.heroLayout === "4"
            ? type === "parent"
              ? parent.wizard
              : child.wizard
            : layouts?.heroLayout === "5"
            ? type === "parent"
              ? parent.accent
              : child.accent
            : "1"
          : sectionName === "expLayout"
          ? layouts?.expLayout === "1"
            ? type === "parent"
              ? parent.default
              : child.default
            : layouts?.expLayout === "2"
            ? type === "parent"
              ? parent.medium
              : child.medium
            : layouts?.expLayout === "3"
            ? type === "parent"
              ? parent.minimal
              : child.minimal
            : layouts?.expLayout === "4"
            ? type === "parent"
              ? parent.wizard
              : child.wizard
            : layouts?.expLayout === "5"
            ? type === "parent"
              ? parent.accent
              : child.accent
            : "1"
          : sectionName === "projectsLayout"
          ? layouts?.projectsLayout === "1"
            ? type === "parent"
              ? parent.default
              : child.default
            : layouts?.projectsLayout === "2"
            ? type === "parent"
              ? parent.medium
              : child.medium
            : layouts?.projectsLayout === "3"
            ? type === "parent"
              ? parent.minimal
              : child.minimal
            : layouts?.projectsLayout === "4"
            ? type === "parent"
              ? parent.wizard
              : child.wizard
            : layouts?.projectsLayout === "5"
            ? type === "parent"
              ? parent.accent
              : child.accent
            : "1"
          : sectionName === "skillsLayout"
          ? layouts?.skillsLayout === "1"
            ? type === "parent"
              ? parent.default
              : child.default
            : layouts?.skillsLayout === "2"
            ? type === "parent"
              ? parent.medium
              : child.medium
            : layouts?.skillsLayout === "3"
            ? type === "parent"
              ? parent.minimal
              : child.minimal
            : layouts?.skillsLayout === "4"
            ? type === "parent"
              ? parent.wizard
              : child.wizard
            : layouts?.skillsLayout === "5"
            ? type === "parent"
              ? parent.accent
              : child.accent
            : "1"
          : "1"
      }
    >
      {children}
    </div>
  );
};

export const ChangeLayoutForm = ({ sectionName }: { sectionName: string }) => {
  const { token } = useAuth();
  const { activeTheme, defaultTheme } = useTheme();
  const { isLogged } = useAuth();
  const [pending, setPending] = useState<boolean>(false);
  const { layouts, setLayouts } = useUser();
  const { heroLayout, expLayout, projectsLayout, skillsLayout } = layouts;
  const handleChangeLayout = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!layouts) return;
      if (!token) return;
      setPending(true);
      const response = await fetch(`${URL_SERVER}/layouts/${layouts?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(layouts),
      });
      if (!response.ok) {
        throw new Error("change layout failed");
      }
      const data = await response.json();
      toast.success("layout changed success");
      return data;
    } catch (err) {
      toast.error((err as Error).message);
      return;
    } finally {
      setPending(false);
    }
  };
  return (
    <form
      onSubmit={handleChangeLayout}
      className="ml-auto flex justify-end items-center gap-4 lg:gap-2  "
    >
      <select
        defaultValue={
          layouts && sectionName === "heroLayout"
            ? heroLayout
            : sectionName === "projectsLayout"
            ? projectsLayout
            : sectionName === "expLayout"
            ? expLayout
            : sectionName === "skillsLayout"
            ? skillsLayout
            : ""
        }
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          if (e.target) {
            const { name, value } = e.target;
            if (layouts) {
              setLayouts({ ...layouts, [name]: value });
            }
          }
        }}
        name={sectionName}
        id={sectionName}
        style={
          isLogged
            ? {
                backgroundColor: activeTheme.cardColor,
                borderColor: activeTheme.borderColor,
                color: activeTheme.primaryText,
              }
            : {
                backgroundColor: defaultTheme.cardColor,
                borderColor: defaultTheme.borderColor,
                color: defaultTheme.primaryText,
              }
        }
        className="appearance-none  w-full py-1 px-4 rounded-md  border focus:border-blue-500 focus:ring focus:ring-blue-500/20 focus:outline-none cursor-pointer relative pr-10 shadow-sm hover:opacity-65 transition-colors duration-200"
      >
        <option value="1">Default</option>
        <option value="2">Medium</option>
        <option value="3">Minimal</option>
        <option value="4">Wizard</option>
        <option value="5">Accent</option>
      </select>
      <SubmitButton loading={pending} type="submit">
        <LucideSave
          color={isLogged ? activeTheme.primaryText : defaultTheme.primaryText}
        />
      </SubmitButton>
    </form>
  );
};
