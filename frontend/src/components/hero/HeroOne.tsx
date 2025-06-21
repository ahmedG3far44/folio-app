import { IBioType, IContactType } from "@/lib/types";
import { Card } from "../ui/card";
import { useTheme } from "@/contexts/ThemeProvider";
import Resume from "../cards/Resume";
import ShowUserContacts from "../cards/ShowUserContacts";
import Image from "../ui/image";

function HeroOne({
  bioInfo,
  contacts,
}: {
  bioInfo: IBioType;
  contacts: IContactType;
}) {
  const { activeTheme } = useTheme();
  return (
    <>
      <div className="w-[250px] h-[250px] min-w-[250px] mini-h-[250px] rounned-4xl overflow-hidden ">
        <Image
          property="true"
          width={250}
          height={250}
          className="w-full h-full object-cover rounded-4xl"
          src={bioInfo?.heroImage}
          alt={bioInfo?.jobTitle}
        />
      </div>

      <div className="flex flex-col justify-center items-center  lg:items-start gap-2 lg:gap-4">
        <h2 className="lg:text-5xl text-3xl font-black text-center lg:text-start">
          {bioInfo?.bioName}
        </h2>
        <h3 className="lg:text-2xl text-2xl font-semibold text-center lg:text-start">
          {bioInfo?.jobTitle}
        </h3>
        <ShowUserContacts contacts={contacts} />
        <Resume />
      </div>

      <Card
        style={{
          backgroundColor: activeTheme.cardColor,
          color: activeTheme.secondaryText,
          border: `1px solid ${activeTheme.borderColor}`,
        }}
        className="w-full lg:w-3/4 md:w-full p-4 m-4"
      >
        <p>{bioInfo?.bio}</p>
      </Card>
    </>
  );
}

export default HeroOne;
