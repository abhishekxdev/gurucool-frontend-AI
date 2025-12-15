import { authApi } from "@/lib/api/auth";
import Cookies from "js-cookie";
import { create } from "zustand";

// Base user interface with shared fields
interface BaseUser {
  id: string;
  email: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  avatar?: string;
  profileCompleted: boolean;
  createdAt: string;
}

// Teacher-specific user type
interface TeacherUser extends BaseUser {
  role: "teacher";
  firstName?: string;
  lastName?: string;
  schoolId?: string;
  schoolEmail?: string;
  countryId?: string;
  gender?: string;
  teachingExperience?: string;
  subjects?: string[];
  gradeLevels?: string[];
  proficiencyLevel?: string;
  certificates?: string;
}

// School Admin-specific user type
interface SchoolAdminUser extends BaseUser {
  role: "school_admin";
  schoolName?: string;
  officialSchoolEmail?: string;
  adminRole?: string;
  countryId?: string;
  phone?: string;
  schoolAddress?: string;
  logo?: string;
}

// Admin-specific user type
interface AdminUser extends BaseUser {
  role: "admin";
  permissions?: string[];
  department?: string;
}

// Discriminated union type
type User = TeacherUser | SchoolAdminUser | AdminUser;

// Type for valid roles
type UserRole = User["role"]; // "teacher" | "school_admin" | "admin"

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (data: {
    email: string;
    password: string;
    name: string;
    role: UserRole; // ✅ Now type-safe: only "teacher" | "school_admin" | "admin"
  }) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setToken: (token) => set({ token }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  checkAuth: async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        set({ user: null, isAuthenticated: false });
        return;
      }

      const userStr = Cookies.get("user");
      if (!userStr) {
        set({ user: null, token: null, isAuthenticated: false });
        return;
      }

      const userData = JSON.parse(userStr);

      if (!userData.status) {
        userData.status = "approved";
      }

      set({ user: userData, token, isAuthenticated: true });
    } catch (err) {
      console.error("Auth check failed:", err);
      set({ user: null, token: null, isAuthenticated: false });
      Cookies.remove("token");
      Cookies.remove("user");
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });

      const response = await authApi.signIn(email, password);

      // Store in cookies
      Cookies.set("token", response.token, { expires: 7 });
      Cookies.set("user", JSON.stringify(response.user), { expires: 7 });

      set({
        token: response.token,
        user: response.user,
        isAuthenticated: true,
        loading: false,
      });

      return response;
    } catch (err: any) {
      const errorMessage = err.message || "Sign in failed";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  signUp: async (data: {
    email: string;
    password: string;
    name: string;
    role: UserRole; // ✅ Type-safe role
  }) => {
    try {
      set({ loading: true, error: null });

      const response = await authApi.signUp(data);

      // Store in cookies
      Cookies.set("token", response.token, { expires: 7 });
      Cookies.set("user", JSON.stringify(response.user), { expires: 7 });

      set({
        token: response.token,
        user: response.user,
        isAuthenticated: true,
        loading: false,
      });

      return response;
    } catch (err: any) {
      const errorMessage = err.message || "Sign up failed";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
      Cookies.remove("token");
      Cookies.remove("user");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  },
}));

// Export types for use in components
export type { AdminUser, SchoolAdminUser, TeacherUser, User, UserRole };
