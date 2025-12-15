import { findUserByCredentials } from "../data";

// Simulated API responses
export const authApi = {
  // Sign in with mock data
  signIn: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = findUserByCredentials(email, password);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Return mock response matching backend structure
    return {
      token: `mock-jwt-token-${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        profileCompleted: user.profileCompleted,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    };
  },

  // Sign up (mock)
  signUp: async (data: {
    email: string;
    password: string;
    name: string;
    role: string;
  }) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock new user creation - school admins pending by default, teachers and admins approved
    const newUser = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: data.role as "teacher" | "school_admin" | "admin", // ✅ Added "admin"

      profileCompleted: false,
      avatar: "/avatars/default.jpg",
      createdAt: new Date().toISOString(),
    };

    return {
      token: `mock-jwt-token-${newUser.id}`,
      user: newUser,
    };
  },

  // Get current user
  getCurrentUser: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("No user found");
    }

    const user = JSON.parse(userStr);

    // Ensure status field exists (for backward compatibility)
    if (!user.status) {
      user.status = "pending";
    }

    return user;
  },

  // Logout
  logout: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { success: true };
  },

  // Refresh token (mock)
  refreshToken: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    return { token };
  },
};
