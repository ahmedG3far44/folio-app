import credentials from "@credentials";
import { redirect } from "next/navigation";
async function Dashboard() {
  const { user, isAdmin } = await credentials();
  {
    !isAdmin ? (
      redirect(`/${user?.id}`)
    ) : (
      <div className="max-w-screen max-h-screen">
        <h1>Dashboard</h1>
      </div>
    );
  }
}
export default Dashboard;
