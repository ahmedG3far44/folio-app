import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link
      className="cursor-pointer hover:opacity-75 transition-all flex items-center gap-2"
      to={"/"}
    >
      <img
        className="rounded-lg"
        width={36}
        height={36}
        src={"./favicon.svg"}
        alt="Folio"
      />
      <h1 className="text-2xl font-black tracking-tight">Folio</h1>
    </Link>
  );
}

export default Logo;
