"use client";
import { useState } from "react";
import Hero from "./Hero";
import ExpLayout from "./ExpLayout";
import ProjectsLayout from "./ProjectsLayout";
import SkillsLayout from "./SkillsLayout";
import Testimonials from "./Testimonials";

function MainProfilePreviewSection({
  layouts,
  ExperiencesList,
  ProjectsList,
  SkillsList,
  contacts,
  TestimonialsList,
  bio,
  isLogged,
}) {
  const [layoutStyle, setLayouts] = useState(layouts);

  return (
    <>
      <Hero
        bio={bio}
        layouts={layoutStyle}
        setLayouts={setLayouts}
        contacts={contacts}
        isLogged={isLogged}
      />
      <ExpLayout
        layouts={layoutStyle}
        setLayouts={setLayouts}
        ExperiencesList={ExperiencesList}
        isLogged={isLogged}
      />
      <ProjectsLayout
        layouts={layoutStyle}
        setLayouts={setLayouts}
        ProjectsList={ProjectsList}
        isLogged={isLogged}
      />
      <SkillsLayout
        layouts={layoutStyle}
        setLayouts={setLayouts}
        SkillsList={SkillsList}
        isLogged={isLogged}
      />
      <Testimonials TestimonialsList={TestimonialsList} isLogged={isLogged} />
    </>
  );
}

export default MainProfilePreviewSection;
