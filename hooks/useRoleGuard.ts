import type {
  AdminUser,
  SchoolAdminUser,
  TeacherUser,
} from "@/store/useAuthStore";
import { useAuthStore } from "@/store/useAuthStore";

export const useSchoolAdmin = () => {
  const { user } = useAuthStore();

  if (!user || user.role !== "school_admin") {
    return null;
  }

  return user as SchoolAdminUser;
};

export const useTeacher = () => {
  const { user } = useAuthStore();

  if (!user || user.role !== "teacher") {
    return null;
  }

  return user as TeacherUser;
};

export const useAdmin = () => {
  const { user } = useAuthStore();

  if (!user || user.role !== "admin") {
    return null;
  }

  return user as AdminUser;
};
