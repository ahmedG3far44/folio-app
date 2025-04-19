import { IBioType, IContactType } from "@/lib/types";
import ShowUserContacts from "../cards/ShowUserContacts";
import { Card } from "../ui/card";
import Resume from "../cards/Resume";

function Hero({
  bioInfo,
  contacts,
}: {
  bioInfo: IBioType;
  contacts: IContactType;
}) {
  return (
    <div className="w-3/4  m-auto flex flex-col justify-center items-center gap-8 my-30">
      <div className=" flex justify-around items-center gap-16 flex-wrap lg:flex-nowrap ">
        <div className="w-[250px] h-[250px] rounned-xl overflow-hidden ">
          <img
            className="w-full h-full object-cover rounded-xl"
            src={bioInfo?.heroImage}
            alt={bioInfo?.bio}
          />
        </div>
        <div className="flex flex-col justify-between  items-start gap-4">
          <h2 className="text-5xl font-bold">{bioInfo?.bioName}</h2>
          <h3 className="text-2xl font-semibold">{bioInfo?.jobTitle}</h3>
          <ShowUserContacts contacts={contacts} />
          <Resume />
        </div>
      </div>
      <Card className="w-full p-4">
        <p>{bioInfo?.bio}</p>
      </Card>
    </div>
  );
}

export default Hero;
