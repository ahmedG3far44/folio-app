/* eslint-disable react-refresh/only-export-components */
import {
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
  createContext,
} from "react";
import { useAuth } from "./AuthProvider";
import { AdminContextType, AdminUsersList, PaginationMeta } from "@/lib/types";
import toast from "react-hot-toast";

const URL_SERVER = import.meta.env.VITE_API_URL as string;

const defaultPagination: PaginationMeta = {
  total: 0,
  page: 1,
  pageSize: 30,
  totalPages: 0,
};

export const AdminContext = createContext<AdminContextType>({
  insights: {
    totalUsers: 0,
    projects: 0,
    feedbacks: 0,
    totalThemes: 0,
    totalSkills: 0,
    totalExperiences: 0,
  },
  users: [],
  loading: false,
  error: null,
  pagination: defaultPagination,
  refetch: async () => {},
  updateUserStatus: async () => {},
  deleteUser: async () => {},
});

const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [adminInsights, setAdminInsights] = useState({
    totalUsers: 0,
    projects: 0,
    feedbacks: 0,
    totalThemes: 0,
    totalSkills: 0,
    totalExperiences: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUsersList[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination);
  const { token, isAdmin } = useAuth();

  const fetchAdmin = useCallback(async () => {
    try {
      if (!isAdmin || !token) return;
      setLoading(true);
      const response = await fetch(`${URL_SERVER}/admin`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        setError(response.statusText);
        return;
      }
      const data = await response.json();

      setUsers(data.users);
      setAdminInsights(data.insights);
      if (data.pagination) setPagination(data.pagination);
      return data;
    } catch (error) {
      setError((error as Error).message);
      return;
    } finally {
      setLoading(false);
    }
  }, [token, isAdmin]);

  useEffect(() => {
    if (isAdmin && token) fetchAdmin();
  }, [fetchAdmin, isAdmin, token]);

  const updateUserStatus = async (userId: string, status: "ACTIVE" | "BLOCKED") => {
    try {
      const response = await fetch(`${URL_SERVER}/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to update user status");
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status } : u))
      );
      toast.success(status === "BLOCKED" ? "User blocked" : "User activated");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`${URL_SERVER}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to delete user");
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("User deleted");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        insights: adminInsights,
        users,
        loading,
        error,
        pagination,
        refetch: fetchAdmin,
        updateUserStatus,
        deleteUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);

export default AdminProvider;
