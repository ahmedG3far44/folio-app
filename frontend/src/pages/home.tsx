import { IFeatureType, IProjectType } from "@/lib/types";
import { memo, useMemo, useState, useEffect } from "react";
import { easeIn, easeInOut, motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Container from "@/components/Container";
import videoOne from "../assets/videos/video-1.mp4";
import videoTwo from "../assets/videos/video-2.mp4";

import {
  Atom,
  BookAIcon,
  Crop,
  FilePen,
  Github,
  LucideBox,
  User,
} from "lucide-react";

const FeatureCard = memo(({ feature }: { feature: IFeatureType }) => (
  <motion.div
    whileHover={{ translateY: -5 }}
    transition={{ duration: 0.2, ease: easeInOut }}
    className="w-full h-full cursor-pointer"
  >
    <Card className="w-full h-full border flex justify-start items-start flex-col p-4">
      <div className="w-full  flex justify-start items-center gap-4">
        <div className="border rounded-lg p-2">{feature.icon}</div>
        <h1 className="text-lg font-bold">{feature.title}</h1>
      </div>

      <p className="text-sm text-zinc-300">{feature.text}</p>
    </Card>
  </motion.div>
));
FeatureCard.displayName = "FeatureCard";

const HeroSection = memo(({ isLogged }: { isLogged: boolean }) => (
  <section className="lg:h-screen p-4 flex flex-col items-center justify-center lg:gap-4 relative">
    <motion.div className="hidden lg:block opacity-25 blur-3xl absolute left-10 top-10 bg-gradient-to-br from-purple-500 to-blue-500 w-96 h-96 rounded-full animate-around z-1" />
    <motion.div className="hidden lg:block opacity-25 blur-3xl absolute right-10 bottom-10 bg-gradient-to-br from-purple-500 to-blue-500 w-96 h-96 rounded-full animate-around-back z-1" />

    <div className="flex flex-col items-center justify-center space-y-4 z-5">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="lg:text-6xl text-3xl flex flex-col items-center justify-center font-black"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-purple-500"
        >
          Build a Portfolio,
        </motion.span>{" "}
        <motion.span
          className="text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Share What You Do Best
        </motion.span>
      </motion.h1>
      <p className="text-sm lg:w-1/2 w-3/4 text-center text-zinc-400">
        Easily create a digital profile that reflects your talents and
        experience. Share your skills, feedback, and success stories with a
        style that's totally you
      </p>
      <div className="space-x-4 my-4">
        {!isLogged && (
          <Link to="/login">
            <Button>Start Now</Button>
          </Link>
        )}
        <Link
          target="_blank"
          to="https://github.com/ahmedG3far44/Presento-Online-Platform"
        >
          <Button>
            <Github size={20} />
            Github Source
          </Button>
        </Link>
      </div>
      <div>
        <p className="lg:text-sm text-[12px] mt-2 text-zinc-400">
          Designed & created by Developer{" "}
          <Link
            target="_blank"
            className="hover:underline hover:text-purple-500"
            to="https://www.linkedin.com/in/ahmed-gaafar-5a3478201/"
          >
            @ahmedG3far44
          </Link>
        </p>
        <div className="flex items-center justify-center gap-2 p-4">
          <Link
            target="_blank"
            className="hover:underline hover:text-purple-500"
            to="https://www.linkedin.com/in/ahmed-gaafar-5a3478201/"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 1 }}
              className="cursor-pointer w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-purple-500"
            >
              <img
                loading="lazy"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                src="https://media.licdn.com/dms/image/v2/D4D03AQHYaJyb47RqrA/profile-displayphoto-shrink_200_200/B4DZZUMvChGwAc-/0/1745169347596?e=1750896000&v=beta&t=qAnlNxEDOKbQxJN98k-layJMsZmnZtPpeDJfZDFseCo"
                alt="profile developer"
              />
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  </section>
));
HeroSection.displayName = "HeroSection";

const VideoSection = memo(
  ({
    activeState,
    project,
  }: {
    activeState: boolean;
    project: IProjectType;
  }) => (
    <section className="w-full p-4 flex flex-col items-center justify-center lg:gap-4 gap-2 relative">
      <motion.h1
        initial={{ scaleY: 0, opacity: 0 }}
        whileInView={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: easeIn }}
        className="lg:text-6xl text-4xl font-black text-purple-500 text-center lg:my-4"
      >
        Video Section{" "}
      </motion.h1>

      <div className="hidden w-[400px] h-[400px] lg:block opacity-25 blur-3xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full z-1" />
      <motion.div
        initial={{ opacity: 0, scaleY: 0.5, scaleX: 0.5, translateY: 20 }}
        whileInView={{ opacity: 1, scaleY: 1, scaleX: 1, translateY: 0 }}
        transition={{ duration: 0.5, ease: easeInOut }}
        className="p-4 w-full h-auto lg:w-3/4 lg:h-auto rounded-2xl shadow-xl lg:my-20 z-5 relative"
      >
        <div
          className={`bg-zinc-800 rounded-2xl ${
            activeState ? "animate-fade-reverse block" : "hidden"
          } absolute w-96 h-96 -z-1 shadow-2xl`}
        >
          <img
            loading="lazy"
            width={384}
            height={384}
            className="w-full h-full object-cover rounded-2xl"
            src={project.thumbnail}
            alt="project thumbnail image"
          />
        </div>
        <div
          className={`bg-zinc-800 rounded-2xl  ${
            activeState ? "animate-fade block" : "hidden"
          } absolute w-96 h-96 -z-1 shadow-2xl`}
        >
          <img
            loading="lazy"
            width={384}
            height={384}
            className="w-full h-full object-cover rounded-2xl"
            src={project.ImagesList[0].url}
            alt="project thumbnail image"
          />
        </div>

        <video
          preload="metadata"
          autoPlay
          muted
          loop
          playsInline
          width={400}
          height={400}
          className="w-full h-full rounded-2xl object-cover z-4 shadow-2xl border border-zinc-900"
        >
          <source src={videoOne} />
        </video>
      </motion.div>
    </section>
  )
);
VideoSection.displayName = "VideoSection";

const VideoGallerySection = memo(() => (
  <section className="w-full lg:h-[700px] h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-4 p-4">
    <div className="border rounded-2xl lg:col-start-1 lg:col-end-3 border-zinc-900">
      <video
        preload="metadata"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full rounded-2xl object-cover"
      >
        <source src={videoTwo} />
      </video>
    </div>

    <div className="border rounded-2xl border-zinc-900">
      <video
        preload="metadata"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full rounded-2xl object-cover"
        src="https://cdn.dribbble.com/userupload/42966560/file/original-4272fa71322d0c6c4ea70a926afa441a.mp4"
      />
    </div>
    <div className="border rounded-2xl lg:col-start-1 lg:col-end-2 border-zinc-900">
      <video
        preload="metadata"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full rounded-2xl object-cover"
        src="https://cdn.dribbble.com/userupload/15153126/file/original-e020287a0dc270092df19c2738aff2c0.mp4"
      />
    </div>
    <div className="border rounded-2xl lg:col-start-2 lg:col-end-4 border-zinc-900">
      <video
        preload="metadata"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full rounded-2xl object-cover"
        src="https://cdn.dribbble.com/userupload/42966560/file/original-4272fa71322d0c6c4ea70a926afa441a.mp4"
      />
    </div>
  </section>
));
VideoGallerySection.displayName = "VideoGallerySection";

const FeaturesSection = memo(
  ({ featuresCard }: { featuresCard: IFeatureType[] }) => (
    <>
      <div className="p-4 w-full flex items-center justify-center">
        <motion.h1
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: easeIn }}
          className="lg:text-6xl text-4xl font-black text-purple-500"
        >
          Main Features{" "}
        </motion.h1>
      </div>
      <section className="w-full p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-4 ">
        {featuresCard.length > 0 && (
          <>
            {featuresCard?.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </>
        )}
      </section>
    </>
  )
);
FeaturesSection.displayName = "FeaturesSection";

function LandingPage() {
  const { isLogged } = useAuth();
  const [activeState, setActive] = useState(false);

  // Memoize data that doesn't change
  const featuresCard = useMemo(
    () => [
      {
        icon: <User size={25} />,
        title: "Personalized Tech Portfolio",
        text: "Create a fully customizable portfolio showcasing personal details and expertise for professional presentation.",
      },
      {
        icon: <BookAIcon size={25} />,
        title: "Work Experience Highlights",
        text: "Add and highlight key work experiences and career progress in the tech industry.",
      },
      {
        icon: <LucideBox size={25} />,
        title: "Project Showcases",
        text: "Display projects with descriptions, links, and visuals to demonstrate impactful work.",
      },
      {
        icon: <Atom size={25} />,
        title: "Skills Breakdown",
        text: "List and categorize technical skills, tools, and programming languages for easy understanding",
      },
      {
        icon: <Crop size={25} />,
        title: "Dynamic Layout Customization",
        text: "Choose from multiple layouts to tailor portfolio design to personal preferences.",
      },
      {
        icon: <FilePen size={25} />,
        title: "Interactive Section Management",
        text: "Easily customize and reorder sections like About Me, Work Experience, and Projects.",
      },
    ],
    []
  );

  const project = useMemo(
    () => ({
      id: "1",
      thumbnail:
        "https://cdn.dribbble.com/userupload/31715740/file/original-14e1787118d0682a81e76edf4b1a54ef.png?resize=1024x768&vertical=center",
      title: "project title",
      description: "lorem",
      ImagesList: [
        {
          id: "1",
          url: "https://cdn.dribbble.com/userupload/31715773/file/original-fea36c2dbe1b311e3633ed7d8e779777.png?resize=1024x768&vertical=center",
        },
      ],
      source: "",
      tags: [
        {
          id: "1",
          tagName: "tags",
        },
      ],
    }),
    []
  );

  // Use throttled scroll handler to improve performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setActive(scrollY >= 800 && scrollY <= 1650);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full flex flex-col justify-between items-center m-auto min-h-screen overflow-hidden bg-zinc-950 text-white">
      <Container>
        <Header />
        <HeroSection isLogged={isLogged} />
        <VideoSection activeState={activeState} project={project} />
        <VideoGallerySection />
        <FeaturesSection featuresCard={featuresCard} />

        <section className="w-full lg:h-96 p-4 flex flex-col items-center justify-center gap-4">
          <Card className="p-4 border">
            <h1>Hero</h1>
            <p>
              passionate Front-End Developer with a strong focus on creating
              responsive, user-friendly, and visually appealing web
              applications. I love turning
            </p>
          </Card>
        </section>
      </Container>
      <Footer />
    </div>
  );
}

export default LandingPage;
