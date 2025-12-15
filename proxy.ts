import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get user data from cookies
  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user")?.value;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If no token and trying to access protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If has token and trying to access public route
  if (token && userCookie && isPublicRoute) {
    const user = JSON.parse(userCookie);
    return redirectBasedOnStatus(user, request);
  }

  // Protected route logic
  if (token && userCookie) {
    const user = JSON.parse(userCookie);

    if (!user.profileCompleted) {
      const onboardingPath =
        user.role === "teacher"
          ? "/onboarding/teacher"
          : "/onboarding/school-admin";

      if (!pathname.startsWith(onboardingPath)) {
        return NextResponse.redirect(new URL(onboardingPath, request.url));
      }
      return NextResponse.next();
    }

    // Handle school-admin pending users
    if (user.status === "pending" && user.role === "school_admin") {
      const pendingPath = "/school-admin/dashboard";

      if (pathname !== pendingPath) {
        return NextResponse.redirect(new URL(pendingPath, request.url));
      }
      return NextResponse.next();
    }

    // Handle rejected users
    if (user.status === "rejected") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Handle completed profiles - ensure users are on correct dashboard
    if (user.status === "approved" && user.profileCompleted) {
      const allowedPaths: Record<string, string[]> = {
        teacher: ["/teacher"],
        school_admin: ["/school-admin"],
        admin: ["/admin"],
      };

      const userPaths = allowedPaths[user.role] || [];
      const isOnAllowedPath = userPaths.some((path) =>
        pathname.startsWith(path)
      );

      if (!isOnAllowedPath) {
        const dashboardPath = getDashboardPath(user.role);
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      }
    }
  }

  return NextResponse.next();
}

function redirectBasedOnStatus(user: any, request: NextRequest) {
  if (!user.profileCompleted) {
    const onboardingPath =
      user.role === "teacher"
        ? "/onboarding/teacher"
        : "/onboarding/school-admin";
    return NextResponse.redirect(new URL(onboardingPath, request.url));
  }

  if (user.status === "pending" && user.role === "school_admin") {
    return NextResponse.redirect(new URL("/school-admin/pending", request.url));
  }

  if (user.status === "rejected") {
    return NextResponse.next(); // Allow to stay on login
  }

  const dashboardPath = getDashboardPath(user.role);
  return NextResponse.redirect(new URL(dashboardPath, request.url));
}

function getDashboardPath(role: string): string {
  switch (role) {
    case "teacher":
      return "/teacher/dashboard";
    case "school_admin":
      return "/school-admin/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/login";
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
