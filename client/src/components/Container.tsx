import { ReactNode } from "react";

function Container({ children }: { children: ReactNode }) {
  return <div className="w-full min-h-screen flex flex-col justify-around items-center lg:w-3/4 m-auto space-y-8">{children}</div>;
}

export default Container;
