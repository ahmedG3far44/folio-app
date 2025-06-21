import { Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminProvider";
import { useTheme } from "@/contexts/ThemeProvider";

import { Card } from "../ui/card";

import Loader from "../loader";
import ErrorMessage from "../ErrorMessage";
import Image from "../ui/image";

const BUCKET_DOMAIN = import.meta.env.VITE_BUCKET_DOMAIN as string;

function UsersList() {
  const { users, loading, error } = useAdmin();
  const { activeTheme } = useTheme();
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader size="md" />
      </div>
    );

  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1 className="text-2xl font-bold my-4">All Users List</h1>
      {users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 grid-flow-row">
          {users.map((user) => (
            <Card
              style={{
                backgroundColor: activeTheme.cardColor,
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
              }}
              key={user.id}
              className="p-4 space-y-4 shadow-md border"
            >
              <div className="flex justify-between items-center lg:flex-wrap gap-2">
                <div className="flex  justify-between items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      className="w-full h-full object-cover"
                      width={40}
                      height={40}
                      src={user.picture}
                      alt="user profile picture"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-0">
                    <h1>{user.name}</h1>
                    <Link
                      className="hover:underline duration-150  text-[12px]"
                      to={`mailto:${user.email}`}
                    >
                      {user.email}
                    </Link>
                  </div>
                </div>

                <h3
                  style={{
                    backgroundColor:
                      user.role === "ADMIN"
                        ? activeTheme.backgroundColor
                        : activeTheme.borderColor,
                    color:
                      user.role === "ADMIN"
                        ? activeTheme.secondaryText
                        : activeTheme.primaryText,
                    borderColor: activeTheme.borderColor,
                  }}
                  className="ml-auto px-3 py-1 rounded-4xl border text-sm"
                >
                  {user.role.toLowerCase()}
                </h3>
              </div>
              <div className="mt-auto flex items-center justify-between ">
                <h3
                  style={{ color: activeTheme.secondaryText }}
                  className="text-sm mt-auto "
                >
                  Join US:{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                {user.resume && (
                  <Link
                    target="_blank"
                    download={`${BUCKET_DOMAIN}/${user.resume}`}
                    to={`${BUCKET_DOMAIN}/${user.resume}`}
                  >
                    Resume
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold">No users found</h1>
        </div>
      )}
    </div>
  );
}

export default UsersList;
