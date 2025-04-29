import { ISkillType } from "@/lib/types";
import SkillCard from "../cards/SkillCard";
import { useAuth } from "@/contexts/AuthProvider";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ChagneLayoutForm } from "./ProjectSection";
import { useUser } from "@/contexts/UserProvider";
import layoutJson from "@/lib/layouts.json";
import { ReactNode } from "react";
// import { useTheme } from "@/contexts/ThemeProvider";
// import { Card } from "../ui/card";

function SkillSection({ skills }: { skills: ISkillType[] }) {
  const { isLogged } = useAuth();

  return (
    <>
      {isLogged && <ChagneLayoutForm sectionName="skillsLayout" />}
      {skills.length > 0 ? (
        <ApplyLayout sectionName="skillsLayout" type="parent">
          {skills.map((skill: ISkillType) => {
            return <SkillCard key={skill.id} skill={skill} />;
          })}
        </ApplyLayout>
      ) : (
        <div className="w-full flex items-center justify-center">
          {isLogged && (
            <Link to={"/profile/skills"}>
              <Button type="button">add skills</Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default SkillSection;

export interface IActiveLayout {
  parent: {
    default: string;
    meduim: string;
    minimal: string;
    wizzard: string;
    accent: string;
  };
  child: {
    default: string;
    meduim: string;
    minimal: string;
    wizzard: string;
    accent: string;
  };
}
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
  // const { activeTheme } = useTheme();
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
              ? parent.minimal
              : child.minimal
            : layouts?.heroLayout === "3"
            ? type === "parent"
              ? parent.meduim
              : child.meduim
            : layouts?.heroLayout === "4"
            ? type === "parent"
              ? parent.wizzard
              : child.wizzard
            : layouts?.heroLayout === "5"
            ? type === "parent"
              ? parent.default
              : child.default
            : "1"
          : sectionName === "expLayout"
          ? layouts?.expLayout === "1"
            ? type === "parent"
              ? parent.default
              : child.default
            : layouts?.expLayout === "2"
            ? type === "parent"
              ? parent.minimal
              : child.minimal
            : layouts?.expLayout === "3"
            ? type === "parent"
              ? parent.meduim
              : child.meduim
            : layouts?.expLayout === "4"
            ? type === "parent"
              ? parent.wizzard
              : child.wizzard
            : layouts?.expLayout === "5"
            ? type === "parent"
              ? parent.default
              : child.default
            : "1"
          : sectionName === "projectsLayout"
          ? layouts?.projectsLayout === "1"
            ? type === "parent"
              ? parent.default
              : child.default
            : layouts?.projectsLayout === "2"
            ? type === "parent"
              ? parent.minimal
              : child.minimal
            : layouts?.projectsLayout === "3"
            ? type === "parent"
              ? parent.meduim
              : child.meduim
            : layouts?.projectsLayout === "4"
            ? type === "parent"
              ? parent.wizzard
              : child.wizzard
            : layouts?.projectsLayout === "5"
            ? type === "parent"
              ? parent.default
              : child.default
            : "1"
          : sectionName === "skillsLayout"
          ? layouts?.skillsLayout === "1"
            ? type === "parent"
              ? parent.default
              : child.default
            : layouts?.skillsLayout === "2"
            ? type === "parent"
              ? parent.minimal
              : child.minimal
            : layouts?.skillsLayout === "3"
            ? type === "parent"
              ? parent.meduim
              : child.meduim
            : layouts?.skillsLayout === "4"
            ? type === "parent"
              ? parent.wizzard
              : child.wizzard
            : layouts?.skillsLayout === "5"
            ? type === "parent"
              ? parent.default
              : child.default
            : "1"
          : ""
      }
    >
      {children}
    </div>
  );
};
