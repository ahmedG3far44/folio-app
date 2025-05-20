import {
  ReactNode,
  useContext,
  useEffect,
  useState,
  createContext,
} from "react";
import { useAuth } from "./AuthProvider";
import { AdminContextType, AdminUsersList } from "@/lib/types";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

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
  const { token, isAdmin } = useAuth();
  useEffect(() => {
    const fetchAdmin = async () => {
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
        return data;
      } catch (error) {
        setError((error as Error).message);
        return;
      } finally {
        setLoading(false);
      }
    };
    if (isAdmin && token) fetchAdmin();
  }, [token, isAdmin]);

  return (
    <AdminContext.Provider
      value={{
        insights: adminInsights,
        users,
        loading,
        error,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
export default AdminProvider;
