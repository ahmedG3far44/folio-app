import { IBioType, IContactType } from "@/lib/types";

import { useTheme } from "@/contexts/ThemeProvider";

import Resume from "../cards/Resume";
import ShowUserContacts from "../cards/ShowUserContacts";
import Image from "../ui/image";

function HeroThree({
  bioInfo,
  contacts,
}: {
  bioInfo: IBioType;
  contacts: IContactType;
}) {
  const { activeTheme } = useTheme();
  return (
    <div
      className="max-w-2xl mx-auto rounded-2xl p-8 lg:p-10 my-8 space-y-6"
      style={{
        border: `1px solid ${activeTheme.borderColor}`,
        backgroundColor: activeTheme.cardColor,
      }}
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
        <div className="w-[160px] h-[160px] rounded-2xl overflow-hidden shrink-0">
          <Image
            property="true"
            width={160}
            height={160}
            className="w-full h-full object-cover"
            src={bioInfo?.heroImage}
            alt={bioInfo?.jobTitle}
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="space-y-1">
            <h2
              style={{ color: activeTheme.primaryText }}
              className="text-3xl md:text-4xl font-black leading-tight"
            >
              {bioInfo?.bioName}
            </h2>
            <h3
              className="text-lg md:text-xl font-semibold"
              style={{ color: activeTheme.secondaryText }}
            >
              {bioInfo?.jobTitle}
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center md:justify-start">
            <ShowUserContacts contacts={contacts} />
            <Resume />
          </div>
        </div>
      </div>

      {bioInfo?.bio && (
        <div
          className="text-sm md:text-base leading-relaxed"
          style={{ color: activeTheme.secondaryText }}
        >
          <p>{bioInfo.bio}</p>
        </div>
      )}
    </div>
  );
}

export default HeroThree;
