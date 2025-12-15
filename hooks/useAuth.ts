"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: "teacher" | "school_admin" | "admin";
}

export const useAuth = () => {
  const router = useRouter();
  const {
    user,
    loading,
    error,
    isAuthenticated,
    signIn: storeSignIn,
    signUp: storeSignUp,
    logout: storeLogout,
    checkAuth,
  } = useAuthStore();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signIn = async (credentials: LoginCredentials) => {
    try {
      const response = await storeSignIn(
        credentials.email,
        credentials.password
      );

      // Fetch the real user profile from Firestore/backend here if needed
      const { user: loggedInUser } = response;

      // Now use the real user data for navigation
      if (loggedInUser.status === "rejected") {
        await storeLogout();
        throw new Error(
          "Your account has been rejected. Please contact support."
        );
      }

      if (loggedInUser.role === "teacher") {
        if (!loggedInUser.profileCompleted) {
          router.push("/onboarding/teacher");
        } else {
          router.push("/teacher/dashboard/profile");
        }
        return response;
      }

      if (loggedInUser.role === "school_admin") {
        if (!loggedInUser.profileCompleted) {
          router.push("/onboarding/school-admin");
        } else if (loggedInUser.status === "pending") {
          router.push("/school-admin/pending");
        } else if (loggedInUser.status === "approved") {
          router.push("/school-admin/dashboard");
        }
        return response;
      }

      if (loggedInUser.role === "admin") {
        router.push("/admin/dashboard");
        return response;
      }

      return response;
    } catch (err: any) {
      throw err;
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      const response = await storeSignUp(data);

      const { user: newUser } = response;

      // After signup, all new users go to onboarding first
      // (profileCompleted will be false for new signups)
      if (newUser.role === "teacher") {
        router.push("/onboarding/teacher");
      } else if (newUser.role === "school_admin") {
        router.push("/onboarding/school-admin");
      }

      return response;
    } catch (err: any) {
      throw err;
    }
  };

  const logout = async () => {
    await storeLogout();
    router.push("/login");
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    logout,
    isAuthenticated,
  };
};
