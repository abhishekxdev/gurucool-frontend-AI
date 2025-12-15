"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    const userStr = Cookies.get("user");

    if (token && userStr) {
      const user = JSON.parse(userStr);

      // Redirect based on role and profile completion status
      if (user.role === "teacher") {
        if (!user.profileCompleted) {
          router.push("/onboarding/teacher");
        } else {
          router.push("/teacher/dashboard");
        }
      } else if (user.role === "school_admin") {
        if (user.profileCompleted === false) {
          router.push("/onboarding/school-admin");
        } else if (user.status === "approved") {
          router.push("/school-admin/dashboard");
        } else {
          // If status is not approved, redirect to login
          router.push("/login");
        }
      } else if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        // Unknown role, redirect to login
        router.push("/login");
      }
    } else {
      // Redirect to login if not logged in
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default Page;
