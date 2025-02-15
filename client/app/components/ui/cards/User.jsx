import Image from "next/image";
import Badge from "./Badge";
import Skeleton from "./Skeleton";
import notValidImg from "@/public/images/unUser.png";

function User({ name, picture, isAdmin, isLoading }) {
  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="w-full flex  justify-center items-center   gap-4 max-sm:flex-col max-md:flex-col">
          <Image
            src={picture ? picture : notValidImg}
            width={40}
            height={40}
            alt="user profile picture"
            className="rounded-full max-w-full max-h-full border object-cover "
          />

          <div className="w-full flex flex-col justify-start items-start gap-2 flex-wrap max-sm:justify-center max-md:justify-center max-sm:items-center max-md:items-center">
            <h3 className="text-sm text-start text-wrap font-bold max-sm:text-center max-md:text-center">
              {name.toUpperCase()}
            </h3>
            <Badge text={isAdmin ? "admin" : "user"} />
          </div>
        </div>
      )}
    </>
  );
}

export default User;
