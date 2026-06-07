import { IFeatureType } from "@/lib/types";
import {
  memo,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { motion } from "motion/react";
import { useAuth } from "@/contexts/AuthProvider";
import { Helmet } from "react-helmet-async";

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
import DemoCredentialsPopup from "@/components/DemoCredentialsPopup";

const FEATURE_IMAGES = [
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
];

const FeatureImage = memo(({ src, index }: { src: string; index: number }) => (
  <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-purple-500/15 to-purple-900/60 z-10" />
    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent z-10" />
    <img
      className="w-full h-full object-cover aspect-video"
      src={src}
      alt=""
      loading={index < 2 ? "eager" : "lazy"}
    />
  </div>
));
FeatureImage.displayName = "FeatureImage";

const HeroSection = memo(({ isLogged }: { isLogged: boolean }) => (
  <section className="min-h-screen flex items-center px-6 lg:px-12" aria-label="Hero section">
    <div className="w-full max-w-7xl mx-auto gap-12 lg:gap-20 items-center">
      <div className="space-y-8 z-10 flex flex-col items-center justify-center gap-8">
        <div className="space-y-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-purple-400"
          >
            Portfolio builder
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight"
          >
            <span className="text-white">Build a portfolio,</span>
            <br />
            <span className="text-purple-400">share what you do best</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-base sm:text-lg text-zinc-400 max-w-lg leading-relaxed text-center mx-auto"
          >
            Create a digital profile that reflects your talents and experience.
            Share your skills, feedback, and success stories with a style that's
            totally you.
          </motion.p>
        </div>
        <motion.nav
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-wrap items-center gap-4"
          aria-label="Primary navigation"
        >
          {!isLogged && (
            <SecondaryBtn path="signup">Get Started Now</SecondaryBtn>
          )}
          <a
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-800 transition-colors duration-150"
            href="https://github.com/ahmedG3far44/Presento-Online-Platform"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={18} />
            GitHub Repo
          </a>
        </motion.nav>
      </div>

    </div>
  </section>
));
HeroSection.displayName = "HeroSection";

const ShowcaseSection = memo(() => (
  <section className="px-6 lg:px-12 py-24 lg:py-32" aria-label="Platform showcase">
    <div className="w-full max-w-7xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-xl"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          See it in action
        </h2>
        <p className="mt-4 text-base text-zinc-400 leading-relaxed">
          From blank canvas to live portfolio in minutes. Customize every section,
          choose your layout, and publish.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        className="rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl"
      >
        <Image
          className="w-full object-cover"
          src="./showcase.gif"
          alt="Folio platform walkthrough showing portfolio creation flow"
          width={1200}
        />
      </motion.div>
    </div>
  </section>
));
ShowcaseSection.displayName = "ShowcaseSection";

const FeatureBlock = memo(
  ({
    feature,
    index,
  }: {
    feature: IFeatureType;
    index: number;
  }) => {
    const isReversed = index % 2 === 1;
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
        className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
          isReversed ? "lg:direction-rtl" : ""
        }`}
      >
        <div className={isReversed ? "lg:order-2" : ""}>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-5">
            {feature.icon}
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            {feature.title}
          </h3>
          <p className="text-base text-zinc-400 leading-relaxed max-w-md">
            {feature.text}
          </p>
        </div>
        <div
          className={isReversed ? "lg:order-1" : ""}
        >
          <FeatureImage src={FEATURE_IMAGES[index]} index={index} />
        </div>
      </motion.div>
    );
  }
);
FeatureBlock.displayName = "FeatureBlock";

const FeaturesSection = memo(
  ({ featuresCard }: { featuresCard: IFeatureType[] }) => (
    <section className="px-6 lg:px-12 py-24 lg:py-32" aria-label="Features">
      <div className="w-full max-w-7xl mx-auto space-y-20 lg:space-y-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-xl"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-3">
            Everything you need
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Main Features
          </h2>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            Six core capabilities that make building your portfolio feel natural.
          </p>
        </motion.div>

        <div className="space-y-20 lg:space-y-28">
          {featuresCard.map((feature, index) => (
            <FeatureBlock
              key={`feature-${index}`}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
);
FeaturesSection.displayName = "FeaturesSection";

const VideoGalleryComponent = memo(() => (
  <section
    className="px-6 lg:px-12 py-24 lg:py-32"
    aria-label="Portfolio template gallery"
  >
    <div className="w-full max-w-7xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-xl"
      >
        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-3">
          Templates
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Variant customized portfolio pages
        </h2>
        <p className="mt-4 text-base text-zinc-400 leading-relaxed">
          Each layout option gives your portfolio a distinct visual identity.
          Choose the one that fits your style.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-zinc-800">
          <video
            preload="none"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            aria-label="Portfolio template layout example 1"
          >
            <source src="./video-2.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="rounded-2xl overflow-hidden border border-zinc-800">
          <video
            preload="none"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            aria-label="Portfolio template layout example 2"
          >
            <source src="https://cdn.dribbble.com/userupload/42966560/file/original-4272fa71322d0c6c4ea70a926afa441a.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="rounded-2xl overflow-hidden border border-zinc-800">
          <video
            preload="none"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            aria-label="Portfolio template layout example 3"
          >
            <source src="https://cdn.dribbble.com/userupload/15153126/file/original-e020287a0dc270092df19c2738aff2c0.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-zinc-800">
          <video
            preload="none"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            aria-label="Portfolio template layout example 4"
          >
            <source src="https://cdn.dribbble.com/userupload/42966560/file/original-4272fa71322d0c6c4ea70a926afa441a.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  </section>
));

VideoGalleryComponent.displayName = "VideoGalleryComponent";

function Footer() {
  const { isLogged, user } = useAuth();
  return (
    <footer className="w-full border-t border-zinc-800 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <Logo />
            <p className="text-sm text-zinc-500 mt-4 leading-relaxed">
              Showcase your creative work with a professional portfolio. Build,
              share, and grow your online presence.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4">
            {isLogged ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    className="object-cover w-full h-full"
                    width={40}
                    height={40}
                    src={user?.picture as string}
                    alt={`${user.name} profile picture`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-300">{user.name}</p>
                  <p className="text-sm text-zinc-500">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <SecondaryBtn path="signup">Create Account</SecondaryBtn>
                <PrimaryBtn path="login">Sign In</PrimaryBtn>
              </div>
            )}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-zinc-800/50">
          <p className="text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} Folio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  const { isLogged } = useAuth();
  const [activeState, setActive] = useState(false);

  const featuresCard = useMemo(
    () => [
      {
        icon: <LucideUser size={22} />,
        title: "Personalized Tech Portfolio",
        text: "Create a fully customizable portfolio showcasing personal details and expertise for professional presentation.",
      },
      {
        icon: <BookAIcon size={22} />,
        title: "Work Experience Highlights",
        text: "Add and highlight key work experiences and career progress in the tech industry.",
      },
      {
        icon: <LucideBox size={22} />,
        title: "Project Showcases",
        text: "Display projects with descriptions, links, and visuals to demonstrate impactful work.",
      },
      {
        icon: <Atom size={22} />,
        title: "Skills Breakdown",
        text: "List and categorize technical skills, tools, and programming languages for easy understanding",
      },
      {
        icon: <Crop size={22} />,
        title: "Dynamic Layout Customization",
        text: "Choose from multiple layouts to tailor portfolio design to personal preferences.",
      },
      {
        icon: <FilePen size={22} />,
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Folio - Portfolio Builder for Tech Professionals",
    applicationCategory: "BusinessApplication",
    description:
      "Create and manage professional tech portfolios. Showcase your projects, skills, experience, and testimonials with customizable themes and layouts.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Person",
      name: "Ahmed Gaafar",
      url: "https://www.linkedin.com/in/ahmed-gaafar-5a3478201/",
    },
    featureList: [
      "Personalized Tech Portfolio",
      "Work Experience Management",
      "Project Showcases",
      "Skills Breakdown",
      "Dynamic Layout Customization",
      "Interactive Section Management",
    ],
  };

  return (
    <>
      <Helmet>
        <title>
          Folio - Build Your Professional Tech Portfolio | Portfolio Builder
        </title>
        <meta
          name="title"
          content="Folio - Build Your Professional Tech Portfolio | Portfolio Builder"
        />
        <meta
          name="description"
          content="Create stunning tech portfolios in minutes. Showcase your projects, skills, work experience, and testimonials. Free portfolio builder for developers, designers, and tech professionals."
        />
        <meta
          name="keywords"
          content="portfolio builder, tech portfolio, developer portfolio, online portfolio, portfolio website, project showcase, skills management, professional portfolio, web portfolio, portfolio creator"
        />
        <link rel="canonical" href="https://yourwebsite.com/" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/" />
        <meta
          property="og:title"
          content="Folio - Build Your Professional Tech Portfolio"
        />
        <meta
          property="og:description"
          content="Create stunning tech portfolios in minutes. Showcase your projects, skills, work experience, and testimonials."
        />
        <meta
          property="og:image"
          content="https://yourwebsite.com/og-image.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://yourwebsite.com/" />
        <meta
          property="twitter:title"
          content="Folio - Build Your Professional Tech Portfolio"
        />
        <meta
          property="twitter:description"
          content="Create stunning tech portfolios in minutes. Showcase your projects, skills, and experience."
        />
        <meta
          property="twitter:image"
          content="https://yourwebsite.com/twitter-image.jpg"
        />

        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="Ahmed Gaafar" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
        <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex justify-between items-center h-16">
              <Logo />
              <nav aria-label="User navigation">
                {isLogged ? (
                  <User dashboard={false} />
                ) : (
                  <div className="flex items-center gap-3">
                    <PrimaryBtn path="login">Sign In</PrimaryBtn>
                    <SecondaryBtn path="signup">Get Started</SecondaryBtn>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </header>

        <main>
          <div className="pt-16">
            <HeroSection isLogged={isLogged} />
            <ShowcaseSection />
            <VideoGalleryComponent />
            <FeaturesSection featuresCard={featuresCard} />
          </div>
        </main>

        <Footer />
      </div>
      <DemoCredentialsPopup />
    </>
  );
}

export default LandingPage;
