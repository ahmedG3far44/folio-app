import { IBioType, IContactType } from "@/lib/types";

import { useTheme } from "@/contexts/ThemeProvider";

import { Card } from "../ui/card";

import Resume from "../cards/Resume";
import ShowUserContacts from "../cards/ShowUserContacts";

function HeroThree({
  bioInfo,
  contacts,
}: {
  bioInfo: IBioType;
  contacts: IContactType;
}) {
  const { activeTheme } = useTheme();
  return (
    <Card
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.secondaryText,
        border: `1px solid ${activeTheme.borderColor}`,
      }}
      className="max-w-[800px] mx-auto p-8 shadow-2xl my-10"
    >
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-[180px] h-[180px] rounded-2xl overflow-hidden flex-shrink-0">
          <img
            loading="lazy"
            property="true"
            width={180}
            height={180}
            className="w-full h-full object-cover"
            src={bioInfo?.heroImage}
            alt={bioInfo?.jobTitle}
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2
            style={{ color: activeTheme.primaryText }}
            className="text-3xl md:text-4xl font-black mb-1"
          >
            {bioInfo?.bioName}
          </h2>
          <h3
            style={{ color: activeTheme.primaryText }}
            className="text-lg md:text-xl font-semibold mb-4 opacity-80"
          >
            {bioInfo?.jobTitle}
          </h3>
          <p
            style={{ color: activeTheme.secondaryText }}
            className="text-sm md:text-base mb-4 leading-relaxed"
          >
            {bioInfo?.bio}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start">
            <ShowUserContacts contacts={contacts} />
            <Resume />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default HeroThree;
