import Image from "next/image";
import GradientText from "./heroLayouts/GradientText";

function SkillCard({ skillName, skillLogo, layoutStyle }) {
  return (
    <>
      <div
        className={`
          ${layoutStyle === "1" && "flex justify-start items-center gap-4"}
          ${
            layoutStyle === "2" &&
            "flex flex-col rounded-md  justify-center bg-primary-foreground items-center gap-2 border p-4 hover:bg-primary-foreground"
          }
          ${
            layoutStyle === "3" &&
            "flex justify-between items-center  px-4 max-sm:justify-center max-sm:gap-4 m-auto "
          }
          ${
            layoutStyle === "4" &&
            "w-full flex justify-start items-center gap-4"
          }
            ${layoutStyle === "5" && "flex justify-start items-center gap-8"}
        `}
      >
        <Image
          className={`w-10 h-10 object-cover rounded-md ml-4
              ${layoutStyle === "3" && "block"}
              ${layoutStyle === "5" && "hidden"}
              `}
          src={skillLogo}
          width={40}
          height={40}
          alt="skill logo"
        />
        {layoutStyle === "5" ? (
          <GradientText className={"border-l pl-4"}>
            {skillName.toUpperCase()}
          </GradientText>
        ) : (
          <h1
            className={` w-fit text-xl  text-nowrap font-semibold
          
            ${layoutStyle === "3" && "hidden"}
            ${layoutStyle === "4" && "text-2xl text-muted-foreground"}
            `}
          >
            {skillName.toUpperCase()}
          </h1>
        )}
      </div>
    </>
  );
}

export default SkillCard;
