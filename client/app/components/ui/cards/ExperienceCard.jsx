"use client";
import Image from "next/image";
import NoImage from "@/public/noImage.png";
import { MdOutlineLocationOn } from "react-icons/md";

function ExperienceCard({
  cName,
  cLogo,
  position,
  role,
  start,
  end,
  location,
  layoutStyle,
}) {
  const duration = {
    years: new Date(end).getFullYear() - new Date(start).getFullYear(),
    month: null,
  };
  if (duration.years < 1) {
    duration.month =
      new Date(end).getMonth() + 1 - new Date(start).getMonth() + 1;
  }
  const { month, years } = duration;
  return (
    <div
      className={layoutStyle === "3" ? "experience_card-3" : "experience_card"}
    >
      <div className="experience_head">
        <Image
          width={40}
          height={40}
          alt={"experience company logo image"}
          src={!!cLogo ? cLogo : NoImage}
          className={"experience_cLogo"}
        />

        <div>
          <h1 className={"experience_heading_text"}>{!!cName && cName}</h1>
          <h2 className={"experience_secondary_text"}>
            {!!position && position}
          </h2>
        </div>

        <div className="experience_duration">
          <span>Duration:</span>
          <div>
            {!!years && (
              <span>
                {years} {years === 1 ? "year" : "years"}
              </span>
            )}
            {!!month && (
              <span>
                {month} {month === 1 ? "month" : "months"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="experience_body">
        <summary className="manage_content_lines text-wrap overflow-hidden max-w-full">
          {role}
        </summary>
        {/* <button>read more</button> */}

        <div
          className="flex justify-start items-center gap-2
        "
        >
          <span>
            <MdOutlineLocationOn size={20} />
          </span>{" "}
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
}

export default ExperienceCard;
