import { Link } from "react-router-dom";
import favicon from "@/assets/favicon-1.svg";

function Logo() {
  return (
    <Link
      className="cursor-pointer  hover:opacity-75 transition-all flex items-center gap-2"
      to={"/"}
    >
      <img
        className="rounded-2xl"
        width={40}
        height={40}
        src={favicon}
        alt="folio app portfolio builder logo"
      />
      <h1 className="text-3xl font-black hover:scale-1.1 duration-150 dark:text-white light:text-black">
        Folio
      </h1>
    </Link>
  );
}

export default Logo;
