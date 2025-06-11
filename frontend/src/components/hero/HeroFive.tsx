import { IBioType, IContactType } from "@/lib/types";

import { useTheme } from "@/contexts/ThemeProvider";

import { Card } from "../ui/card";

import Resume from "../cards/Resume";
import ShowUserContacts from "../cards/ShowUserContacts";

function HeroFive({
  bioInfo,
  contacts,
}: {
  bioInfo: IBioType;
  contacts: IContactType;
}) {
  const { activeTheme } = useTheme();
  return (
    <div className="max-w-xl mx-auto text-center space-y-8">
      {/* Profile Image */}
      <div className="relative inline-block">
        <div className="w-[200px] h-[200px] mx-auto rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-lg">
          <img
            loading="lazy"
            property="true"
            width={200}
            height={200}
            className="w-full h-full object-cover"
            src={bioInfo?.heroImage}
            alt={bioInfo?.jobTitle}
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div
            className="w-4 h-4 rounded-full border-2 border-white"
            style={{ backgroundColor: activeTheme.primaryText }}
          ></div>
        </div>
      </div>

      {/* Name and Title */}
      <div>
        <h2 className="text-3xl lg:text-5xl font-black mb-2">
          {bioInfo?.bioName}
        </h2>
        <h3 className="text-lg lg:text-xl font-semibold opacity-70">
          {bioInfo?.jobTitle}
        </h3>
      </div>

      {/* Bio */}
      <Card
        style={{
          backgroundColor: activeTheme.cardColor,
          color: activeTheme.secondaryText,
          border: `1px solid ${activeTheme.borderColor}`,
        }}
        className="p-6 text-left"
      >
        <p className="text-center leading-relaxed">{bioInfo?.bio}</p>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <ShowUserContacts contacts={contacts} />
        <Resume />
      </div>
    </div>
  );
}

export default HeroFive;
