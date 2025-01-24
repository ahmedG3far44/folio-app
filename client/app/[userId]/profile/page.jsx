import { redirect } from "next/navigation";
import credentials from "@credentials";

async function Profile() {
  const { isAdmin, isLogged } = await credentials();
  {
    !isAdmin && isLogged ? (
      <div className="max-w-screen max-h-screen">
        <h1>profile</h1>
      </div>
    ) : (
      redirect("/api/auth/login")
    );
  }
}

export default Profile;
