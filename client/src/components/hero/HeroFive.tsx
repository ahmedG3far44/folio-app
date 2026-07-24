import { IBioType, IContactType } from "@/lib/types";

import { useTheme } from "@/contexts/ThemeProvider";

import Resume from "../cards/Resume";
import ShowUserContacts from "../cards/ShowUserContacts";
import Image from "../ui/image";

function HeroFive({
  bioInfo,
  contacts,
}: {
  bioInfo: IBioType;
  contacts: IContactType;
}) {
  const { activeTheme } = useTheme();
  return (
    <div className="max-w-lg mx-auto text-center space-y-8">
      <div className="w-[180px] h-[180px] mx-auto rounded-full overflow-hidden">
        <Image
          property="true"
          width={180}
          height={180}
          className="w-full h-full object-cover"
          src={bioInfo?.heroImage}
          alt={bioInfo?.jobTitle}
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-4xl lg:text-5xl font-black leading-tight">
          {bioInfo?.bioName}
        </h2>
        <h3
          className="text-lg lg:text-xl font-semibold"
          style={{ color: activeTheme.secondaryText }}
        >
          {bioInfo?.jobTitle}
        </h3>
      </div>

      {bioInfo?.bio && (
        <div
          className="text-base leading-relaxed text-center"
          style={{ color: activeTheme.secondaryText }}
        >
          <p>{bioInfo.bio}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <ShowUserContacts contacts={contacts} />
        <Resume />
      </div>
    </div>
  );
}

export default HeroFive;
