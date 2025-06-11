import { IBioType, IContactType } from "@/lib/types";

import { useTheme } from "@/contexts/ThemeProvider";

import { Card } from "../ui/card";

import Resume from "../cards/Resume";
import ShowUserContacts from "../cards/ShowUserContacts";

function HeroTwo({
  bioInfo,
  contacts,
}: {
  bioInfo: IBioType;
  contacts: IContactType;
}) {
  const { activeTheme } = useTheme();
  return (
    <div className="grid lg:grid-cols-2 gap-2 items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-[300px] h-[300px] rounded-full overflow-hidden shadow-xl">
          <img
            loading="lazy"
            property="true"
            width={300}
            height={300}
            className="w-full h-full object-cover"
            src={bioInfo?.heroImage}
            alt={bioInfo?.jobTitle}
          />
        </div>
        <div className="flex items-center gap-4">
          <ShowUserContacts contacts={contacts} />
          <Resume />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-center lg:text-left">
          <h2 className="text-4xl lg:text-4xl font-black mb-2">
            {bioInfo?.bioName}
          </h2>
          <h3 className="text-xl lg:text-2xl font-semibold">
            {bioInfo?.jobTitle}
          </h3>
        </div>

        <Card
          style={{
            backgroundColor: activeTheme.cardColor,
            color: activeTheme.secondaryText,
            border: `1px solid ${activeTheme.borderColor}`,
          }}
          className="p-6"
        >
          <p className="text-sm leading-relaxed">{bioInfo?.bio}</p>
        </Card>
      </div>
    </div>
  );
}

export default HeroTwo;
