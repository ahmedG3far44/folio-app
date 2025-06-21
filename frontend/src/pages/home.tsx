import { IFeatureType } from "@/lib/types";
import {
  memo,
  useMemo,
  useState,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import { easeIn, easeInOut, motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

import Container from "@/components/Container";
// import videoOne from "../assets/videos/video-1.mp4";
import videoTwo from "../assets/videos/video-2.mp4";
import gifShowcase from "../assets/videos/showcase.gif";

import {
  Atom,
  BookAIcon,
  Crop,
  FilePen,
  Github,
  LucideBox,
  LucideUser,
} from "lucide-react";

import SecondaryBtn from "@/components/buttons/SecondaryBtn";
import PrimaryBtn from "@/components/buttons/PrimaryBtn";
import Logo from "@/components/Logo";
import User from "@/components/User";
import Image from "@/components/ui/image";
// Lazy load heavy components
// const VideoGallerySection = lazy(() => import("VideoGallerySection"));

// Memoized profile image component with loading optimization
const ProfileImage = memo(() => (
  <motion.div
    initial={{ scale: 0.8 }}
    whileHover={{ scale: 1 }}
    whileTap={{ scale: 1 }}
    className="cursor-pointer w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-purple-500"
  >
    <Image
      width={40}
      height={40}
      className="w-full h-full object-cover"
      src="https://media.licdn.com/dms/image/v2/D4D03AQHYaJyb47RqrA/profile-displayphoto-shrink_200_200/B4DZZUMvChGwAc-/0/1745169347596?e=1750896000&v=beta&t=qAnlNxEDOKbQxJN98k-layJMsZmnZtPpeDJfZDFseCo"
      alt="profile developer"
    />
  </motion.div>
));
ProfileImage.displayName = "ProfileImage";

// Optimized FeatureCard with reduced re-renders
const FeatureCard = memo(({ feature }: { feature: IFeatureType }) => (
  <motion.div
    whileHover={{ translateY: -5 }}
    transition={{ duration: 0.2, ease: easeInOut }}
    className="w-full h-full cursor-pointer"
  >
    <div className="w-full h-full border flex justify-start items-start flex-col gap-4 p-4 bg-zinc-950 rounded-xl shadow-md border-zinc-800 text-white">
      <div className="w-full flex justify-start items-center gap-4">
        <div className="border border-zinc-500 text-zinc-500 rounded-lg p-2">
          {feature.icon}
        </div>
        <h1 className="text-xl text-zinc-300 font-bold">{feature.title}</h1>
      </div>
      <p className="text-sm text-zinc-300">{feature.text}</p>
    </div>
  </motion.div>
));
FeatureCard.displayName = "FeatureCard";

// Optimized HeroSection with better animation handling
const HeroSection = memo(({ isLogged }: { isLogged: boolean }) => (
  <section className="lg:h-screen p-4 flex flex-col items-center justify-center lg:gap-4 relative">
    <motion.div
      className="hidden lg:block opacity-25 blur-3xl absolute left-10 top-10 bg-gradient-to-br from-purple-500 to-blue-500 w-96 h-96 rounded-full animate-around z-1"
      initial={false}
    />
    <motion.div
      className="hidden lg:block opacity-25 blur-3xl absolute right-10 bottom-10 bg-gradient-to-br from-purple-500 to-blue-500 w-96 h-96 rounded-full animate-around-back z-1"
      initial={false}
    />

    <div className="flex flex-col items-center justify-center space-y-4 z-5">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: easeInOut }}
        className="lg:text-6xl text-3xl flex flex-col items-center justify-center font-black"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-purple-500"
        >
          Build a Portfolio,
        </motion.span>{" "}
        <motion.span
          className="text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Share What You Do Best
        </motion.span>
      </motion.h1>
      <p className="text-sm lg:w-1/2 w-3/4 text-center text-zinc-400">
        Easily create a digital profile that reflects your talents and
        experience. Share your skills, feedback, and success stories with a
        style that's totally you
      </p>
      <div className="w-[30%] flex items-center gap-2">
        {!isLogged && (
          <SecondaryBtn path="signup">get started now</SecondaryBtn>
        )}
        <PrimaryBtn
          className="flex-1 text-nowrap flex justify-center items-center gap-2"
          path="https://github.com/ahmedG3far44/Presento-Online-Platform"
          target="_blank"
        >
          <Github size={20} />
          Github Repo
        </PrimaryBtn>
      </div>
      <div>
        <p className="lg:text-sm text-[12px] mt-2 text-zinc-400">
          Designed & created by{" "}
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
            <ProfileImage />
          </Link>
        </div>
      </div>
    </div>
  </section>
));
HeroSection.displayName = "HeroSection";

// Optimized VideoSection with Intersection Observer
const VideoSection = memo(({ activeState }: { activeState?: boolean }) => (
  <section className="w-full p-4 flex flex-col items-center justify-center lg:gap-4 gap-2 relative">
    <motion.h1
      initial={{ scaleY: 0, opacity: 0 }}
      whileInView={{ scaleY: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.3, ease: easeIn }}
      className="lg:text-6xl text-4xl font-black text-purple-500 text-center lg:my-4"
    >
      Show Casing Our Features {activeState}
    </motion.h1>

    <div className="hidden w-[400px] h-[400px] lg:block opacity-25 blur-3xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full z-1" />
    <motion.div
      initial={{ opacity: 0, scaleY: 0.5, scaleX: 0.5, translateY: 20 }}
      whileInView={{ opacity: 1, scaleY: 1, scaleX: 1, translateY: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: easeInOut }}
      className="p-4 w-[700px]  flex items-center justify-center  rounded-2xl overflow-hidden shadow-xl lg:my-20 z-5 relative"
    >
      <Image
        property="true"
        className="rounded-2xl object-cover z-4 shadow-2xl border border-zinc-950"
        src={gifShowcase}
        alt="Animated example"
        width={700}
      />
    </motion.div>
  </section>
));
VideoSection.displayName = "VideoSection";

// Optimized VideoGallerySection with lazy loading
const VideoGalleryComponent = memo(() => (
  <section className="w-full lg:h-[700px] h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-4 p-4">
    <div className="border rounded-2xl lg:col-start-1 lg:col-end-3 border-zinc-900">
      <video
        preload="none"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full rounded-2xl object-cover"
      >
        <source src={videoTwo} type="video/mp4" />
      </video>
    </div>

    <div className="border rounded-2xl border-zinc-900">
      <video
        preload="none"
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
        preload="none"
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
        preload="none"
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
VideoGalleryComponent.displayName = "VideoGalleryComponent";

// Optimized FeaturesSection with virtual rendering consideration
const FeaturesSection = memo(
  ({ featuresCard }: { featuresCard: IFeatureType[] }) => (
    <>
      <div className="p-4 w-full flex items-center justify-center">
        <motion.h1
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3, ease: easeIn }}
          className="lg:text-6xl text-4xl font-black text-purple-500"
        >
          Main Features
        </motion.h1>
      </div>
      <section className="w-full p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-4">
        {featuresCard.map((feature, index) => (
          <FeatureCard key={`feature-${index}`} feature={feature} />
        ))}
      </section>
    </>
  )
);
FeaturesSection.displayName = "FeaturesSection";

function LandingPage() {
  const { isLogged } = useAuth();
  const [activeState, setActive] = useState(false);

  const featuresCard = useMemo(
    () => [
      {
        icon: <LucideUser size={25} />,
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
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const newActiveState = scrollY >= 800 && scrollY <= 1650;
    if (newActiveState !== activeState) {
      setActive(newActiveState);
    }
  }, [activeState]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const throttledHandleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(handleScroll, 16);
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [handleScroll]);

  return (
    <div className="w-full flex flex-col justify-between gap-20 items-center m-auto min-h-screen overflow-hidden bg-zinc-950 text-white">
      <Container>
        <header className="w-full flex justify-between  items-center p-4  lg:p-8">
          <Logo />
          <div>
            {isLogged ? (
              <div className="flex items-center space-x-4">
                <User dashboard={false} />
              </div>
            ) : (
              <div className="space-x-4">
                <div className="space-x-4">
                  <PrimaryBtn path="login">login</PrimaryBtn>
                  <SecondaryBtn path="signup">signup</SecondaryBtn>
                </div>
              </div>
            )}
          </div>
        </header>
        <HeroSection isLogged={isLogged} />
        <VideoSection activeState={activeState} />
        <motion.h1
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3, ease: easeIn }}
          className="lg:text-5xl text-4xl font-black text-purple-500 text-center lg:my-8"
        >
          Variant Customized Portfolio Page
        </motion.h1>
        <Suspense
          fallback={
            <div className="w-full h-[700px] bg-zinc-900 rounded-2xl animate-pulse" />
          }
        >
          <VideoGalleryComponent />
        </Suspense>
        <FeaturesSection featuresCard={featuresCard} />
      </Container>
      <Footer />
    </div>
  );
}

export default LandingPage;

function Footer() {
  const { isLogged, user } = useAuth();
  return (
    <footer className="w-full flex items-center justify-center mt-auto bg-zinc-900">
      <div className="lg:w-3/4 w-[90%] mx-auto  py-12">
        <div className="flex justify-between items-start lg:items-center flex-col md:flex-row lg:flex-row">
          <div className="md:col-span-1 w-full lg:w-1/2">
            <Logo />
            <p className=" text-sm mb-6 mt-4 w-full lg:w-1/2">
              Showcase your creative work with a professional portfolio. Build,
              share, and grow your online presence with our easy-to-use
              platform.
            </p>
          </div>

          <div className="flex items-end flex-col justify-center gap-2">
            {isLogged ? (
              <div className="flex items-center gap-2 py-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    className="object-cover w-full h-full"
                    width={40}
                    height={40}
                    src={user?.picture as string}
                    alt={user.name as string}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold">{user.name}</h3>
                  <h4 className="text-sm">{user.email}</h4>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start justify-start gap-4">
                <PrimaryBtn className="w-full text-center" path={"login"}>
                  login
                </PrimaryBtn>
                <SecondaryBtn path={"signup"}>create account</SecondaryBtn>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start lg:items-center">
          <div className="text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Folio. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
