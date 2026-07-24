import { IBioType, IContactType } from "@/lib/types";
import { useTheme } from "@/contexts/ThemeProvider";
import Resume from "../cards/Resume";
import ShowUserContacts from "../cards/ShowUserContacts";
import Image from "../ui/image";

function HeroOne({
  bioInfo,
  contacts,
}: {
  bioInfo: IBioType;
  contacts: IContactType;
}) {
  const { activeTheme } = useTheme();
  return (
    <div className="flex flex-col items-center lg:items-start gap-8 lg:gap-10">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 w-full">
        <div className="w-[240px] h-[240px] shrink-0 rounded-3xl overflow-hidden">
          <Image
            property="true"
            width={240}
            height={240}
            className="w-full h-full object-cover"
            src={bioInfo?.heroImage}
            alt={bioInfo?.jobTitle}
          />
        </div>

        <div className="flex flex-col items-center lg:items-start gap-4 flex-1">
          <div className="space-y-1.5 text-center lg:text-left">
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
          <ShowUserContacts contacts={contacts} />
          <Resume />
        </div>
      </div>

      {bioInfo?.bio && (
        <div
          className="w-full max-w-prose text-base leading-relaxed"
          style={{ color: activeTheme.secondaryText }}
        >
          <p>{bioInfo.bio}</p>
        </div>
      )}
    </div>
  );
}

export default HeroOne;
