import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useAdmin } from "@/contexts/AdminProvider";
import { useTheme } from "@/contexts/ThemeProvider";

import {
  Search,
  Mail,
  Calendar,
  FileText,
  Users as UsersIcon,
  X,
} from "lucide-react";

import { Card } from "../ui/card";
import { Input } from "@/components/ui/input";

import Loader from "../loader";
import ErrorMessage from "../ErrorMessage";
import Image from "../ui/image";

const BUCKET_DOMAIN = import.meta.env.VITE_BUCKET_DOMAIN as string;

function UsersList() {
  const { users, loading, error } = useAdmin();
  const { activeTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase().trim();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader size="md" />
      </div>
    );

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: activeTheme.cardColor,
              borderColor: activeTheme.borderColor,
            }}
            className="p-3 rounded-lg border"
          >
            <UsersIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">All Users</h1>
            <p style={{ color: activeTheme.secondaryText }} className="text-sm">
              {users.length} total user{users.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: activeTheme.secondaryText }}
          />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              backgroundColor: activeTheme.cardColor,
              borderColor: activeTheme.borderColor,
              color: activeTheme.primaryText,
            }}
            className="pl-10 pr-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-offset-0"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
            >
              <X size={18} style={{ color: activeTheme.secondaryText }} />
            </button>
          )}
        </div>
      </div>

      {searchQuery && (
        <div
          style={{
            backgroundColor: activeTheme.cardColor,
            borderColor: activeTheme.borderColor,
          }}
          className="p-3 rounded-lg border text-sm"
        >
          Found {filteredUsers.length} user
          {filteredUsers.length !== 1 ? "s" : ""} matching "{searchQuery}"
        </div>
      )}

      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <Card
              style={{
                backgroundColor: activeTheme.cardColor,
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
              }}
              key={user.id}
              className="p-5 space-y-4 shadow-sm border hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-offset-2 ring-offset-transparent"
                  style={{
                    borderColor: activeTheme.borderColor,
                    border: `1px solid ${activeTheme.borderColor}`,
                  }}
                >
                  <Image
                    className="w-full h-full object-cover"
                    width={48}
                    height={48}
                    src={user.picture}
                    alt={`${user.name}'s profile picture`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-base truncate">
                    {user.name}
                  </h2>
                  <Link
                    className="hover:underline duration-150 text-xs flex items-center gap-1 mt-1 group"
                    style={{ color: activeTheme.secondaryText }}
                    to={`mailto:${user.email}`}
                  >
                    <Mail size={12} />
                    <span className="truncate group-hover:text-clip">
                      {user.email}
                    </span>
                  </Link>
                </div>

                <span
                  style={{
                    backgroundColor:
                      user.role === "ADMIN"
                        ? activeTheme.backgroundColor
                        : activeTheme.cardColor,
                    color:
                      user.role === "ADMIN"
                        ? activeTheme.primaryText
                        : activeTheme.secondaryText,
                    borderColor: activeTheme.borderColor,
                  }}
                  className="px-3 py-1 rounded-full border text-xs font-medium capitalize flex-shrink-0"
                >
                  {user.role.toLowerCase()}
                </span>
              </div>

              <div
                style={{ backgroundColor: activeTheme.borderColor }}
                className="h-px w-full"
              />

              <div className="flex items-center justify-between gap-3">
                <div
                  style={{ color: activeTheme.secondaryText }}
                  className="text-xs flex items-center gap-1.5"
                >
                  <Calendar size={14} className="flex-shrink-0" />
                  <span className="truncate">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {user.resume && (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`${BUCKET_DOMAIN}/${user.resume}`}
                    to={`${BUCKET_DOMAIN}/${user.resume}`}
                    style={{
                      backgroundColor: activeTheme.backgroundColor,
                      borderColor: activeTheme.borderColor,
                    }}
                    className="px-3 py-1.5 rounded-md border text-xs font-medium hover:opacity-80 transition-opacity flex items-center gap-1.5 flex-shrink-0"
                  >
                    <FileText size={14} />
                    Resume
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: activeTheme.cardColor,
            borderColor: activeTheme.borderColor,
          }}
          className="flex flex-col items-center justify-center min-h-[40vh] border rounded-lg p-8"
        >
          <div
            style={{
              backgroundColor: activeTheme.backgroundColor,
              color: activeTheme.secondaryText,
            }}
            className="p-4 rounded-full mb-4"
          >
            <Search size={32} />
          </div>
          <h2 className="text-xl font-semibold mb-2">No users found</h2>
          <p
            style={{ color: activeTheme.secondaryText }}
            className="text-sm text-center max-w-md"
          >
            {searchQuery
              ? `No users match your search for "${searchQuery}". Try adjusting your search terms.`
              : "There are no users in the system yet."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                backgroundColor: activeTheme.backgroundColor,
                borderColor: activeTheme.borderColor,
              }}
              className="mt-4 px-4 py-2 rounded-lg border hover:opacity-80 transition-opacity text-sm"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default UsersList;
