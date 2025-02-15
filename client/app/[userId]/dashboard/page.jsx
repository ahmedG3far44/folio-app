import credentials from "@credentials";
import { redirect } from "next/navigation";
import { checkIsAdmin } from "@/lib/utils";

async function Dashboard() {
  const { user, isLogged } = await credentials();
  const isAdmin = await checkIsAdmin(user?.id);
  if (!isAdmin && isLogged)
    return redirect(`http://localhost:3000/${user?.id}/profile/bio`);
}
export default Dashboard;
