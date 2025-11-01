import { IBioType, IContactType } from "@/lib/types";
import { useAuth } from "@/contexts/AuthProvider";
import { useUser } from "@/contexts/UserProvider";

import { ChangeLayoutForm } from "../layouts/Layouts";

import HeroOne from "../hero/HeroOne";
import HeroTwo from "../hero/HeroTwo";
import HeroThree from "../hero/HeroThree";
import HeroFour from "../hero/HeroFour";
import HeroFive from "../hero/HeroFive";

function Hero({
  bioInfo,
  contacts,
}: {
  bioInfo: IBioType;
  contacts: IContactType;
}) {
  const { isLogged } = useAuth();
  const { layouts } = useUser();
  const activeLayout = layouts.heroLayout;
  return (
    <div className="w-full p-8 my-8 flex flex-col items-center gap-8 justify-center">
      {isLogged && <ChangeLayoutForm sectionName="heroLayout" />}

      {activeLayout === "1" ? (
        <HeroOne bioInfo={bioInfo} contacts={contacts} />
      ) : activeLayout === "2" ? (
        <HeroTwo bioInfo={bioInfo} contacts={contacts} />
      ) : activeLayout === "3" ? (
        <HeroThree bioInfo={bioInfo} contacts={contacts} />
      ) : activeLayout === "4" ? (
        <HeroFour bioInfo={bioInfo} contacts={contacts} />
      ) : activeLayout === "5" ? (
        <HeroFive bioInfo={bioInfo} contacts={contacts} />
      ) : (
        <HeroOne bioInfo={bioInfo} contacts={contacts} />
      )}
    </div>
  );
}

export default Hero;
