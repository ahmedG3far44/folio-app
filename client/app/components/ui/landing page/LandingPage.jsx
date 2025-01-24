import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import credentials from "@credentials";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@themes/dark-mode-toggle";
import { LuDribbble, LuGithub, LuLinkedin, LuWand2 } from "react-icons/lu";
import { TbCubePlus } from "react-icons/tb";
import { PiExcludeSquareDuotone } from "react-icons/pi";
import { PiStackPlusDuotone } from "react-icons/pi";
import { LuNewspaper } from "react-icons/lu";
import { HiOutlineLogout } from "react-icons/hi";

async function LandingPage() {
  const { isLogged, user, isAdmin } = await credentials();
  const featuresCard = [
    {
      icon: <LuWand2 size={20} />,
      title: "Personalized Tech Portfolio",
      text: "Create a fully customizable portfolio showcasing personal details and expertise for professional presentation.",
    },
    {
      icon: <LuNewspaper size={20} />,
      title: "Work Experience Highlights",
      text: "Add and highlight key work experiences and career progress in the tech industry.",
    },
    {
      icon: <TbCubePlus size={20} />,
      title: "Project Showcases",
      text: "Display projects with descriptions, links, and visuals to demonstrate impactful work.",
    },
    {
      icon: <PiExcludeSquareDuotone size={20} />,
      title: "Skills Breakdown",
      text: "List and categorize technical skills, tools, and programming languages for easy understanding",
    },
    {
      icon: <PiStackPlusDuotone size={20} />,
      title: "Dynamic Layout Customization",
      text: "Choose from multiple layouts to tailor portfolio design to personal preferences.",
    },
    {
      icon: <TbCubePlus size={20} />,
      title: "Interactive Section Management",
      text: "Easily customize and reorder sections like About Me, Work Experience, and Projects.",
    },
  ];
  const year = new Date().getFullYear();

  return (
    <>
      <main className="w-3/4 max-md:w-full m-auto flex flex-col justify-center items-center gap-4 relative p-4">
        <header className="flex justify-between items-center w-full p-4">
          <h1 className={"text-3xl font-mono font-bold"}>PRESENTO.cloud</h1>
          <div className="flex-1 ml-auto flex justify-end items-center gap-4">
            <ModeToggle theme={"none"} />
            {isLogged ? (
              <>
                {isAdmin ? (
                  <Link
                    className="px-4 py-2 rounded-md bg-purple-600 text-white"
                    href={`/${user.id}/dashboard`}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      className="hover:text-purple-500 duration-150 cursor-pointer"
                      href={`/${user.id}`}
                    >
                      {user.given_name}
                    </Link>
                    <Image
                      className="w-8 h-8 min-w-8 min-h-8 object-cover rounded-full overflow-hidden"
                      src={user.picture}
                      width={30}
                      height={30}
                    />
                  </>
                )}

                <LogoutLink className="max-md:hidden hover:bg-secondary duration-150 p-2 rounded-md">
                  <HiOutlineLogout size={20} />
                </LogoutLink>
              </>
            ) : (
              <div className="flex justify-center items-center gap-4 w-1/4">
                <LoginLink className="primary_button">Login</LoginLink>
                <RegisterLink className="secondary_button">
                  Sign Up
                </RegisterLink>
              </div>
            )}
          </div>
        </header>
        <section className={"w-full p-8 vertical gap-4 mt-10 relative"}>
          <div className="vertical gap-4 z-30">
            <h1 className={"heading_text"}>
              Build your dream portfolio, Our platform lets you showcase your
              projects and experiences in a stunning, customizable way.
            </h1>
            <h2 className={"secondary_text"}>
              Our user-friendly interface makes it a breeze to create and
              customize your portfolio.
            </h2>
            <div className="flex justify-center items-center gap-4 my-4">
              <div className="flex justify-center items-center gap-2">
                <span>
                  <LuGithub size={20} />
                </span>
                <h1>Github</h1>
              </div>
              <div className="flex justify-center items-center gap-2">
                <span>
                  <LuLinkedin size={20} />
                </span>
                <h1>Linkedin</h1>
              </div>
              <div className="flex justify-center items-center gap-2">
                <span>
                  <LuDribbble size={20} />
                </span>
                <h1>Instagram</h1>
              </div>
            </div>
            <button className={"cta_button text-white"}>Get Started Now</button>
          </div>
          <span className={"gradient_shape_one  "}></span>
          <span className={"gradient_shape_two  "}></span>
        </section>
        <section className={"vertical gap-8 w-full"}>
          <h1 className="heading_text text-center">What you will got ?? </h1>
          <div
            className={
              "w-full grid grid-cols-3 grid-flow-row gap-4 max-md:grid-cols-1"
            }
          >
            {featuresCard.map((feature, index) => {
              return (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  text={feature.text}
                />
              );
            })}
          </div>
        </section>
        <section className={"vertical gap-8 my-8"}>
          <h1 className="heading_text">Showcasing our features</h1>
          <video
            className="video-animation rounded-2xl "
            src="./images/video.mp4"
            loop
            muted
            autoPlay
            preload={"true"}
            width={800}
          ></video>
        </section>
        <section className={"bg-secondary"}></section>
      </main>
      <footer
        className={
          " w-full flex justify-around items-center m-auto bg-secondary p-8"
        }
      >
        <div className={"vertical gap-2 "}>
          <h1 className="text-3xl font-bold">Presento.io</h1>
        </div>
        <button className="github_button horizontal gap-2">
          <span>
            <LuGithub size={18} />
          </span>
          <Link href={"/"}>Open Source</Link>
        </button>
        <p>
          <span className="mr-2">{year}</span>
          designed & created by{" "}
          <Link
            className="text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-orange-500"
            target={"_bland"}
            href={""}
          >
            @ahmedG3far44
          </Link>
        </p>
      </footer>
    </>
  );
}

export function FeatureCard({ icon, title, text }) {
  return (
    <div className="p-4 bg-card rounded-md border flex flex-col justify-start items-start gap-2 max-md:justify-center max-md:items-center">
      <span>{icon}</span>
      <h1 className="text-lg font-semibold">{title}</h1>
      <p>{text}</p>
    </div>
  );
}

export default LandingPage;
