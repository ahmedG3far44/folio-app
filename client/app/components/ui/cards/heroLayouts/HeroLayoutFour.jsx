import ContactsCard from "../ContactsCard";
import Image from "next/image";
import ResumeDownloadBtn from "../ResumeDownloadBtn";
import UploadImage from "../../profile/forms/UploadImage";

function HeroLayoutFour({
  name,
  summary,
  img,
  jobTitle,
  contacts,
  isLogged,
  id,
}) {
  return (
    <section className={"hero_section"}>
      <div className="flex-1 flex flex-col justify-between max-sm:justify-center max-md:justify-center max-sm:items-center max-md:items-center  items-start gap-2">
        <div className="hero_info">
          <h1 className="hero_heading_text">
            {!!name ? name : "change your name..."}
          </h1>
          <h2 className="hero_secondary_text">
            {!!jobTitle ? jobTitle : "change your Job Title...."}
          </h2>
          <ContactsCard contacts={contacts} />
          <ResumeDownloadBtn />
        </div>

        <div className="about_text">
          <summary className="overflow-hidden">
            {!!summary
              ? summary
              : "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
          </summary>
        </div>
      </div>

      <div className="hero_img">
        {img && (
          <Image priority height={320} width={320} src={img} className="img" />
        )}
        {!img && (
          <Image
            priority
            height={320}
            width={320}
            src={"/images/th.jpeg"}
            className="img"
          />
        )}
        {isLogged && (
          <UploadImage
            id={id}
            className="upload_img"
            fileFormName={"hero-image"}
            url={`upload-image/${id}`}
            acceptedTypes={"image"}
          />
        )}
      </div>
    </section>
  );
}

export default HeroLayoutFour;
