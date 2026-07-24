import { IBioType, IContactType } from "@/lib/types";

import { useTheme } from "@/contexts/ThemeProvider";

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
      className="rounded-2xl p-6 lg:p-10"
      style={{
        backgroundColor: activeTheme.backgroundColor,
        border: `1px solid ${activeTheme.borderColor}`,
      }}
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        <div className="shrink-0">
          <div className="w-[260px] h-[340px] rounded-2xl overflow-hidden">
            <Image
              property="true"
              width={260}
              height={340}
              className="w-full h-full object-cover"
              src={bioInfo?.heroImage}
              alt={bioInfo?.jobTitle}
            />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="text-center lg:text-left space-y-1.5">
            <h2
              className="text-4xl lg:text-5xl font-black leading-tight"
              style={{ color: activeTheme.primaryText }}
            >
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

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center">
            <ShowUserContacts contacts={contacts} />
            <Resume />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroFour;
