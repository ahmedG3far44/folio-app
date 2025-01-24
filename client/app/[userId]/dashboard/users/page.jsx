import Image from "next/image";
import { LuNewspaper } from "react-icons/lu";
async function UsersPage() {
  const { users } = await getAdminInfo();
  let resumeNumbers = users.reduce((acc, user) => {
    let counter = 0;
    user.resume !== null ? (counter += 1) : counter;
    return counter;
  }, 0);
  return (
    <div>
      <div className="w-[200px] flex gap-4 items-center justify-center px-4 py-8 rounded-md border bg-card">
        <span>
          <LuNewspaper size={40} />
        </span>
        <h1>Total CV: {resumeNumbers}</h1>
      </div>
      <div>
        {users.map((user) => {
          return (
            <div
              key={user.id}
              className="p-4 border rounded-md bg-card flex justify-start flex-col items-start my-4 gap-4"
            >
              <div className="flex gap-4 items-center justify-start">
                <Image
                  width={40}
                  height={40}
                  className="rounded-full"
                  src={user.picture}
                  alt="user profile img"
                />
                <div className="flex flex-col justify-start items-start gap-0">
                  <h3>{user.name}</h3>
                  <h4>{user.email}</h4>
                </div>
              </div>

              <span>
                Resume:{" "}
                <span
                  className={user.resume ? "text-green-500" : "text-gray-500"}
                >
                  {user.resume ? "uploaded" : "N/A"}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UsersPage;

export const getAdminInfo = async () => {
  try {
    const request = await fetch(`http://localhost:4000/api/admin`);
    if (!request.ok) throw new Error("Failed to fetch data");
    const data = await request.json();
    return data;
  } catch (error) {
    return error;
  }
};
