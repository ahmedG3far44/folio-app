import { IBioType, IContactType } from "@/lib/types";

import { useTheme } from "@/contexts/ThemeProvider";

import Resume from "../cards/Resume";
import ShowUserContacts from "../cards/ShowUserContacts";
import Image from "../ui/image";

function HeroTwo({
  bioInfo,
  contacts,
}: {
  bioInfo: IBioType;
  contacts: IContactType;
}) {
  const { activeTheme } = useTheme();
  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-[280px] h-[280px] rounded-full overflow-hidden">
          <Image
            property="true"
            width={280}
            height={280}
            className="w-full h-full object-cover"
            src={bioInfo?.heroImage}
            alt={bioInfo?.jobTitle}
          />
        </div>
        <div className="flex items-center gap-3">
          <ShowUserContacts contacts={contacts} />
          <Resume />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="text-center lg:text-left space-y-1.5">
          <h2 className="text-4xl lg:text-5xl font-black leading-tight">
            {bioInfo?.bioName}
          </h2>
          <h3
            className="text-xl lg:text-2xl font-semibold"
            style={{ color: activeTheme.secondaryText }}
          >
            {bioInfo?.jobTitle}
          </h3>
        </div>

        {bioInfo?.bio && (
          <div
            className="text-base leading-relaxed"
            style={{ color: activeTheme.secondaryText }}
          >
            <p>{bioInfo.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroTwo;
