import { getAdminInfo } from "../users/page";
import { LuPackageOpen } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";

async function AnalysisPage() {
  const { users, totalUsers, projects, totalActions } = await getAdminInfo();

  return (
    <div className="w-full flex flex-col justify-start items-start gap-4">
      <div className="w-full p-4 rounded-md border justify-start min-h-[300px] items-center gap-4 flex ">
        <div className="px-4 py-8 flex justify-center items-center gap-8 min-h-full w-full border rounded-md bg-card">
          <span><LuUsers size={50} /></span> <h1 className="text-3xl font-bold">{totalUsers}</h1>
          
        </div>
        <div className="px-4 py-8 flex justify-center items-center gap-8 min-h-full w-full border rounded-md bg-card">
          <span><LuPackageOpen size={50} /></span> <h1 className="text-3xl font-bold">{projects}</h1>
          
        </div>
        
      </div>
      <div className="w-full min-w-full min-h-full rounded-md bg-secondary h-full p-4">
        <h1>Text</h1>
        <h1>{totalActions.views}</h1>
      </div>
    </div>
  );
}

export default AnalysisPage;
