import { IBioType, IContactType } from "@/lib/types";

import { useTheme } from "@/contexts/ThemeProvider";

import { Card } from "../ui/card";

import Resume from "../cards/Resume";
import ShowUserContacts from "../cards/ShowUserContacts";
import Image from "../ui/image";

function HeroFour({
  bioInfo,
  contacts,
}: {
  bioInfo: IBioType;
  contacts: IContactType;
}) {
  const { activeTheme } = useTheme();
  return (
    <div
      className="min-h-[500px] rounded-2xl p-8 border-0"
      style={{
        backgroundColor: activeTheme.backgroundColor,
      }}
    >
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-shrink-0">
          <div className="w-[280px] h-[350px] rounded-2xl overflow-hidden">
            <Image
              property="true"
              width={280}
              height={350}
              className="w-full h-full object-cover"
              src={bioInfo?.heroImage}
              alt={bioInfo?.jobTitle}
            />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="text-center lg:text-left">
            <h2
              className="text-4xl lg:text-5xl font-black mb-3"
              style={{ color: activeTheme.primaryText }}
            >
              {bioInfo?.bioName}
            </h2>
            <h3
              className="text-xl lg:text-2xl font-semibold"
              style={{ color: activeTheme.primaryText }}
            >
              {bioInfo?.jobTitle}
            </h3>
          </div>

          {/* Bio Card */}
          <Card
            style={{
              backgroundColor: activeTheme.cardColor,
              color: activeTheme.secondaryText,
              border: `1px solid ${activeTheme.borderColor}`,
            }}
            className="p-6"
          >
            <p className="text-base leading-relaxed">{bioInfo?.bio}</p>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
            <ShowUserContacts contacts={contacts} />
            <Resume />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroFour;
