import { IBioType, IContactType } from "@/lib/types";

import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";

import { Card } from "../ui/card";

import Resume from "../cards/Resume";
import ShowUserContacts from "../cards/ShowUserContacts";
import { ApplyLayout, ChangeLayoutForm } from "../layouts/Layouts";

function Hero({
  bioInfo,
  contacts,
}: {
  bioInfo: IBioType;
  contacts: IContactType;
}) {
  const { activeTheme } = useTheme();
  const { isLogged } = useAuth();
  return (
    <>
      {isLogged && <ChangeLayoutForm sectionName="heroLayout" />}
      <ApplyLayout type="parent" sectionName="heroLayout">
        <div className="flex flex-col justify-center items-center gap-8">
          <div className=" flex justify-around items-center gap-8 lg:gap-16 flex-wrap lg:flex-nowrap ">
            <div className="w-[250px] h-[250px] rounned-4xl overflow-hidden ">
              <img
                loading="lazy"
                property="true"
                width={250}
                height={250}
                className="w-full h-full object-cover rounded-4xl"
                src={bioInfo?.heroImage}
                alt={bioInfo?.bio}
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
          </div>
          <Card
            style={{
              backgroundColor: activeTheme.cardColor,
              color: activeTheme.secondaryText,
              border: `1px solid ${activeTheme.borderColor}`,
            }}
            className="w-full lg:w-3/4 md:w-full p-4"
          >
            <p>{bioInfo?.bio}</p>
          </Card>
        </div>
      </ApplyLayout>
    </>
  );
}

export default Hero;
