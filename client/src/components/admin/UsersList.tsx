import { useState, useMemo } from "react";
import { useAdmin } from "@/contexts/AdminProvider";
import { useTheme } from "@/contexts/ThemeProvider";

import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldBan,
  ShieldCheck,
  Trash2,
  Mail,
  Calendar,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

import Loader from "../loader";
import ErrorMessage from "../ErrorMessage";
import Image from "../ui/image";

const STATUS_OPTIONS = ["ALL", "ACTIVE", "BLOCKED"] as const;
const PAGE_SIZE = 30;

function UsersList() {
  const { users, loading, error, updateUserStatus, deleteUser } = useAdmin();
  const { activeTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BLOCKED">("ALL");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    let result = users;

    if (statusFilter !== "ALL") {
      result = result.filter((u) => u.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }

    return result;
  }, [users, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader size="md" />
      </div>
    );

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Users</h1>
          <p style={{ color: activeTheme.secondaryText }} className="text-sm">
            {users.length} total user{users.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: activeTheme.secondaryText }}
          />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            style={{
              backgroundColor: activeTheme.cardColor,
              borderColor: activeTheme.borderColor,
              color: activeTheme.primaryText,
            }}
            className="pl-9 pr-9 py-2 w-full border rounded-lg text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
            >
              <X size={15} style={{ color: activeTheme.secondaryText }} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              setStatusFilter(opt);
              setPage(1);
            }}
            style={{
              backgroundColor:
                statusFilter === opt ? activeTheme.cardColor : "transparent",
              color:
                statusFilter === opt
                  ? activeTheme.primaryText
                  : activeTheme.secondaryText,
              borderColor: activeTheme.borderColor,
            }}
            className="px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors hover:opacity-80"
          >
            {opt === "ALL" ? "All" : opt.charAt(0) + opt.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {searchQuery && (
        <p style={{ color: activeTheme.secondaryText }} className="text-sm">
          Found {filteredUsers.length} user
          {filteredUsers.length !== 1 ? "s" : ""} matching "{searchQuery}"
          {statusFilter !== "ALL" && ` (${statusFilter.toLowerCase()})`}
        </p>
      )}

      {filteredUsers.length > 0 ? (
        <div
          className="w-full overflow-x-auto rounded-lg border"
          style={{
            borderColor: activeTheme.borderColor,
            backgroundColor: activeTheme.cardColor,
          }}
        >
          <table className="w-full text-sm" style={{ color: activeTheme.primaryText }}>
            <thead>
              <tr
                style={{
                  backgroundColor: activeTheme.backgroundColor,
                  borderColor: activeTheme.borderColor,
                }}
                className="border-b"
              >
                <th className="text-left p-3 font-medium text-xs uppercase tracking-wide" style={{ color: activeTheme.secondaryText }}>
                  User
                </th>
                <th className="text-left p-3 font-medium text-xs uppercase tracking-wide" style={{ color: activeTheme.secondaryText }}>
                  Role
                </th>
                <th className="text-left p-3 font-medium text-xs uppercase tracking-wide" style={{ color: activeTheme.secondaryText }}>
                  Status
                </th>
                <th className="text-left p-3 font-medium text-xs uppercase tracking-wide" style={{ color: activeTheme.secondaryText }}>
                  Provider
                </th>
                <th className="text-left p-3 font-medium text-xs uppercase tracking-wide" style={{ color: activeTheme.secondaryText }}>
                  Joined
                </th>
                <th className="text-right p-3 font-medium text-xs uppercase tracking-wide" style={{ color: activeTheme.secondaryText }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  style={{ borderColor: activeTheme.borderColor }}
                  className="border-b last:border-b-0"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full overflow-hidden shrink-0 border"
                        style={{ borderColor: activeTheme.borderColor }}
                      >
                        <Image
                          className="w-full h-full object-cover"
                          width={36}
                          height={36}
                          src={user.picture}
                          alt={`${user.name}'s profile`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate max-w-[180px]">
                          {user.name}
                        </p>
                        <p
                          className="text-xs truncate max-w-[180px] flex items-center gap-1"
                          style={{ color: activeTheme.secondaryText }}
                        >
                          <Mail size={10} />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-[11px] font-medium capitalize"
                      style={{
                        backgroundColor: activeTheme.backgroundColor,
                        color: activeTheme.secondaryText,
                      }}
                    >
                      {user.role.toLowerCase()}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                      style={{
                        backgroundColor:
                          user.status === "ACTIVE"
                            ? "#10b98120"
                            : "#ef444420",
                        color:
                          user.status === "ACTIVE" ? "#10b981" : "#ef4444",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            user.status === "ACTIVE" ? "#10b981" : "#ef4444",
                        }}
                      />
                      {user.status === "ACTIVE" ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className="text-xs capitalize"
                      style={{ color: activeTheme.secondaryText }}
                    >
                      {user.provider}
                    </span>
                  </td>
                  <td className="p-3">
                    <div
                      className="text-xs flex items-center gap-1.5"
                      style={{ color: activeTheme.secondaryText }}
                    >
                      <Calendar size={12} />
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {user.status === "ACTIVE" ? (
                        <button
                          onClick={() => updateUserStatus(user.id, "BLOCKED")}
                          className="p-1.5 rounded-md hover:opacity-70 transition-opacity"
                          style={{ color: "#f59e0b" }}
                          title="Block user"
                        >
                          <ShieldBan size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUserStatus(user.id, "ACTIVE")}
                          className="p-1.5 rounded-md hover:opacity-70 transition-opacity"
                          style={{ color: "#10b981" }}
                          title="Activate user"
                        >
                          <ShieldCheck size={15} />
                        </button>
                      )}
                      {confirmDelete === user.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              deleteUser(user.id);
                              setConfirmDelete(null);
                            }}
                            className="px-2 py-1 rounded text-xs font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: activeTheme.backgroundColor,
                              color: activeTheme.secondaryText,
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(user.id)}
                          className="p-1.5 rounded-md hover:opacity-70 transition-opacity"
                          style={{ color: "#ef4444" }}
                          title="Delete user"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: activeTheme.cardColor,
            borderColor: activeTheme.borderColor,
          }}
          className="flex flex-col items-center justify-center min-h-[30vh] border rounded-lg p-8"
        >
          <div
            style={{
              backgroundColor: activeTheme.backgroundColor,
              color: activeTheme.secondaryText,
            }}
            className="p-3 rounded-full mb-3"
          >
            <Search size={24} />
          </div>
          <p className="font-semibold mb-1">No users found</p>
          <p
            style={{ color: activeTheme.secondaryText }}
            className="text-sm text-center max-w-md"
          >
            {searchQuery || statusFilter !== "ALL"
              ? "No users match the current filters."
              : "There are no users in the system yet."}
          </p>
          {(searchQuery || statusFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
              }}
              style={{
                backgroundColor: activeTheme.backgroundColor,
                borderColor: activeTheme.borderColor,
              }}
              className="mt-4 px-3 py-1.5 rounded-lg border hover:opacity-80 transition-opacity text-xs"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div
          className="flex items-center justify-between gap-4 rounded-lg border px-4 py-2"
          style={{
            backgroundColor: activeTheme.cardColor,
            borderColor: activeTheme.borderColor,
            color: activeTheme.secondaryText,
          }}
        >
          <span className="text-xs">
            Page {safePage} of {totalPages} ({filteredUsers.length} total)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="cursor-pointer"
            >
              <ChevronLeft size={15} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="cursor-pointer"
            >
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersList;
