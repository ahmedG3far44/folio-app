import { IBioType, IContactType } from "@/lib/types";
import ShowUserContacts from "../cards/ShowUserContacts";
import { Card } from "../ui/card";
import Resume from "../cards/Resume";
import { useTheme } from "@/contexts/ThemeProvider";

function Hero({
  bioInfo,
  contacts,
}: {
  bioInfo: IBioType;
  contacts: IContactType;
}) {
  const { activeTheme } = useTheme();
  return (
    <div className="lg:w-3/4 w-full p-4 m-auto flex flex-col justify-start lg:justify-center items-center gap-8 mb-16 lg:gap-16">
      <div className=" flex justify-around items-center gap-8 lg:gap-16 flex-wrap lg:flex-nowrap ">
        <div className="w-[250px] h-[250px] rounned-xl overflow-hidden ">
          <img
            className="w-full h-full object-cover rounded-xl"
            src={bioInfo?.heroImage}
            alt={bioInfo?.bio}
          />
        </div>
        <div className="flex flex-col justify-center items-center  lg:items-start gap-4">
          <h2 className="text-5xl font-bold text-center lg:text-start">
            {bioInfo?.bioName}
          </h2>
          <h3 className="text-2xl font-semibold text-center lg:text-start">
            {bioInfo?.jobTitle}
          </h3>
          <ShowUserContacts contacts={contacts} />
          <Resume />
        </div>
      </div>
      <Card
        style={{
          backgroundColor: activeTheme.cardColor,
          color: activeTheme.secondaryText,
          border: `1px solid ${activeTheme.borderColor}`,
        }}
        className="w-full p-4"
      >
        <p>{bioInfo?.bio}</p>
      </Card>
    </div>
  );
}

export default Hero;
