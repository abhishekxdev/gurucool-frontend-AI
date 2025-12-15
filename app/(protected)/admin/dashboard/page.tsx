// app/(protected)/admin/dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  IconAlertTriangle,
  IconChartBar,
  IconSchool,
} from "@tabler/icons-react";

import {
  badgeApprovals,
  mockSchool,
  mockUsers,
  pdAssignments,
  teacherDirectory,
} from "@/lib/data";

// ADD THESE IMPORTS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import ManageTeachers from "./manage-teachers/page";

type NotificationType = "success" | "info" | "warning";

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  type: NotificationType;
  route: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "New School Approved",
    description: "Sunrise Academy was approved successfully.",
    timestamp: "5m ago",
    type: "success",
    route: "/admin/schools",
    read: false,
  },
  {
    id: 2,
    title: "Pending School Approval",
    description: "Green Valley High is waiting for review.",
    timestamp: "20m ago",
    type: "warning",
    route: "/admin/pending-schools",
    read: false,
  },
  {
    id: 3,
    title: "PD Library Updated",
    description: "2 new PD modules added to the catalog.",
    timestamp: "1h ago",
    type: "info",
    route: "/admin/pd-library",
    read: false,
  },
];

interface AnalyticsCard {
  id: string;
  label: string;
  value: string;
  subLabel: string;
  icon: JSX.Element;
  route?: string;
}

interface QuickAction {
  title: string;
  description: string;
  route: string;
  icon: JSX.Element;
}

interface ActivityItem {
  title: string;
  detail: string;
  time: string;
  route: string;
}

function computePlatformMetrics() {
  const users = Object.values(mockUsers);
  const totalSignups = users.length;

  // you can later replace this with a real schools collection
  const totalSchools = 1; // using mockSchool as single school for now

  const totalTeachers = teacherDirectory.length;

  const totalAssessmentsCompleted = teacherDirectory.reduce((sum, teacher) => {
    return (
      sum + teacher.assessments.filter((a) => a.status === "completed").length
    );
  }, 0);

  const totalCertificatesIssued = teacherDirectory.reduce((sum, teacher) => {
    return sum + teacher.certificates.filter((c) => c.type === "earned").length;
  }, 0);

  const totalBadgesApproved = badgeApprovals.filter(
    (b) => b.status === "approved"
  ).length;

  const pendingSchoolApprovals = users.filter(
    (u) => u.role === "school_admin" && u.status === "pending"
  ).length;

  return {
    totalSignups,
    totalSchools,
    totalTeachers,
    totalAssessmentsCompleted,
    totalCertificatesIssued,
    totalBadgesApproved,
    pendingSchoolApprovals,
  };
}

export default function PlatformAdminDashboardPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const metrics = useMemo(() => {
    try {
      const data = computePlatformMetrics();
      setAnalyticsError(null);
      return data;
    } catch (e) {
      setAnalyticsError("Unable to load analytics. Showing placeholders.");
      return null;
    }
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => setNotifications([]);

  const handleNotificationClick = (notification: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
    router.push(notification.route);
  };

  const badgeStyles = (type: NotificationType) => {
    if (type === "warning") return "bg-amber-500/10 text-amber-500";
    if (type === "info") return "bg-blue-500/10 text-blue-500";
    return "bg-emerald-500/10 text-emerald-500";
  };

  const quickActions: QuickAction[] = [
    {
      title: "Manage Schools",
      description: "View and onboard schools",
      route: "/admin/schools",
      icon: <IconSchool className="h-5 w-5" />,
    },
    {
      title: "Manage PD Library",
      description: "Curate and manage PD content",
      route: "/admin/pd-library",
      icon: <IconChartBar className="h-5 w-5" />,
    },
    {
      title: "Pending School Approvals",
      description: "Process new school requests",
      route: "/admin/pending-schools",
      icon: <IconAlertTriangle className="h-5 w-5" />,
    },
  ];

  const recentActivities: Record<
    "schools" | "teachers" | "pd",
    ActivityItem[]
  > = {
    schools: [
      {
        title: "New School Created",
        detail: `${mockSchool.name}`,
        time: "Today",
        route: "/admin/schools",
      },
      {
        title: "Pending Approval",
        detail: "Green Valley High",
        time: "2h ago",
        route: "/admin/pending-schools",
      },
    ],
    teachers: [
      {
        title: "Teacher Growth",
        detail: `+${Math.max(
          1,
          Math.round(teacherDirectory.length / 10)
        )} teachers in last week`,
        time: "This week",
        route: "/admin/teachers",
      },
      {
        title: "Active Teachers Snapshot",
        detail: `${teacherDirectory.length} in directory`,
        time: "Live",
        route: "/admin/teachers",
      },
    ],
    pd: [
      {
        title: "New PD Assignments",
        detail: `${pdAssignments.length} active assignments`,
        time: "Today",
        route: "/admin/analytics/pd",
      },
      {
        title: "Badges & Certificates",
        detail: `${badgeApprovals.length} badge requests in review`,
        time: "Last 24h",
        route: "/admin/analytics/badges",
      },
    ],
  };
  const pdVelocityData = [
    { month: "Jan", completed: 120, assigned: 160 },
    { month: "Feb", completed: 130, assigned: 170 },
    { month: "Mar", completed: 150, assigned: 190 },
    { month: "Apr", completed: 165, assigned: 200 },
    { month: "May", completed: 180, assigned: 210 },
    { month: "Jun", completed: 175, assigned: 205 },
  ];

  const pdVelocityConfig = {
    assigned: {
      label: "Assigned",
      color: "var(--muted-foreground)",
    },
    completed: {
      label: "Completed",
      color: "var(--primary)",
    },
  };

  const totalAssigned = pdVelocityData.reduce(
    (sum, item) => sum + item.assigned,
    0
  );
  const totalCompleted = pdVelocityData.reduce(
    (sum, item) => sum + item.completed,
    0
  );
  const avgCompletion = Math.round((totalCompleted / totalAssigned) * 100);
  const latest = pdVelocityData[pdVelocityData.length - 1];

  // NEW: teacher signups chart data ...
  const teacherSignupData = [
    { month: "Jan", signups: 8 },
    { month: "Feb", signups: 10 },
    { month: "Mar", signups: 12 },
    { month: "Apr", signups: 15 },
    { month: "May", signups: 18 },
    { month: "Jun", signups: 20 },
  ];

  const teacherSignupConfig = {
    signups: {
      label: "Teacher signups",
      color: "var(--primary)",
    },
  };

  const totalTeacherSignups = teacherSignupData.reduce(
    (sum, item) => sum + item.signups,
    0
  );
  const avgMonthlyTeacherSignups = Math.round(
    totalTeacherSignups / teacherSignupData.length
  );
  const latestTeacherSignup = teacherSignupData[teacherSignupData.length - 1];

  // Calculate Country Stats
  const countryStats = useMemo(() => {
    const countryMap = new Map<string, number>();
    teacherDirectory.forEach((teacher) => {
      const count = countryMap.get(teacher.country) || 0;
      countryMap.set(teacher.country, count + 1);
    });
    return Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Calculate Grade Stats
  const gradeStats = useMemo(() => {
    const gradeMap = new Map<string, number>();
    teacherDirectory.forEach((teacher) => {
      teacher.gradeLevels.forEach((grade) => {
        const count = gradeMap.get(grade) || 0;
        gradeMap.set(grade, count + 1);
      });
    });
    return Array.from(gradeMap.entries())
      .map(([grade, count]) => ({ grade, count }))
      .sort((a, b) => parseInt(a.grade) - parseInt(b.grade));
  }, []);

  // Calculate Gender Stats
  const genderStats = useMemo(() => {
    const genderMap = new Map<string, number>();
    teacherDirectory.forEach((teacher) => {
      const count = genderMap.get(teacher.gender) || 0;
      genderMap.set(teacher.gender, count + 1);
    });
    return Array.from(genderMap.entries()).map(([gender, count]) => ({
      gender,
      count,
    }));
  }, []);

  // Mock admin user (replace with real admin data as needed)
  const admin = {
    firstName: "Admin",
    lastName: "User",
    email: "admin@gurucool.dev",
    status: "approved", // or "pending"
    avatar: "/gurucool/avatar.png",
    currentSchool: "Platform Admin",
    joinDate: "2024-01-01",
    totalBadgesEarned: 12,
    certificates: [1, 2, 3],
    totalPdCompleted: 7,
  };

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const isApproved = admin.status === "approved";
  const isPending = admin.status === "pending";

  return (
    <div className="space-y-6 font-[montserrat]">
      {/* Header */}
      <section className="w-full border-b pb-6">
        <div className="font-[inter]">
          <div className="p-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                  <AvatarImage
                    src={admin.avatar}
                    alt={`${admin.firstName} ${admin.lastName}`}
                  />
                  <AvatarFallback className="text-xl font-semibold bg-primary/10">
                    {getInitials(admin.firstName, admin.lastName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-xl truncate">
                    {admin.firstName} {admin.lastName}
                  </h3>
                  {isApproved && (
                    <Badge
                      variant="default"
                      className="bg-green-500 hover:bg-green-600 text-white gap-1"
                    >
                      <CheckCircle2 className="size-3" />
                      Verified
                    </Badge>
                  )}
                  {isPending && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-500/10 text-yellow-700 rounded-sm gap-1"
                    >
                      <Clock className="size-3" />
                      Unverified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  Welcome back to thegurucool 👋🏻
                </p>
                {/* Additional Info */}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="size-3" />
                    <span>{admin.currentSchool}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="size-3" />
                    <span>Admin Panel</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>
                      Joined{" "}
                      {new Date(admin.joinDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              {/* Stats */}
              <div className="flex items-center gap-8 flex-shrink-0">
                <div className="text-start">
                  <p className="text-xs text-muted-foreground mb-1">Teachers</p>
                  <p className="text-4xl font-bold">
                    {metrics?.totalTeachers ?? "--"}
                  </p>
                </div>
                <div className="text-start">
                  <p className="text-xs text-muted-foreground mb-1">Schools</p>
                  <p className="text-4xl font-bold">
                    {metrics?.totalSchools ?? "--"}
                  </p>
                </div>
                <div className="text-start">
                  <p className="text-xs text-muted-foreground mb-1">
                    Pending Approvals
                  </p>
                  <p className="text-4xl font-bold">
                    {metrics?.pendingSchoolApprovals ?? "--"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics error / fallback (Sad Path) */}
      {analyticsError && (
        <Card className="border-amber-500/40 bg-amber-500/10">
          <CardContent className="flex items-start gap-3 py-3">
            <IconAlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
            <div>
              <p className="text-sm font-semibold">Analytics unavailable</p>
              <p className="text-xs text-muted-foreground">{analyticsError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Action Buttons */}
      <section className="grid gap-4 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Card
            key={action.title}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${action.title}`}
            className="cursor-pointer transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:shadow-sm"
            onClick={() => router.push(action.route)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                router.push(action.route);
              }
            }}
          >
            <CardContent className="flex items-center justify-between gap-3 py-4">
              <div>
                <p className="font-semibold">{action.title}</p>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
              <span className="rounded-full border border-border p-2 text-muted-foreground">
                {action.icon}
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Recent Activity Panel */}
      <section className="grid gap-6 lg:grid-cols-2 w-full">
        {/* PD Completion Velocity chart */}
        <Card>
          <CardHeader>
            <CardTitle>PD Completion Velocity</CardTitle>
            <CardDescription>
              Platform-wide view of assigned vs completed PD assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartContainer
              config={pdVelocityConfig}
              className="h-[260px] w-full"
            >
              <BarChart data={pdVelocityData} barSize={18}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={{ fill: "rgba(148, 163, 184, 0.15)" }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="assigned"
                  fill="var(--color-assigned)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="completed"
                  fill="var(--color-completed)"
                  radius={[4, 4, 0, 0]}
                />
                <ChartLegend
                  verticalAlign="bottom"
                  content={<ChartLegendContent />}
                />
              </BarChart>
            </ChartContainer>

            <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {avgCompletion}%
                </p>
                <p>Average completion rate</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {totalCompleted.toLocaleString()}
                </p>
                <p>PDs completed (period)</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {latest.completed}/{latest.assigned}
                </p>
                <p>Latest month snapshot</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Signups chart */}
        <Card>
          <CardHeader>
            <CardTitle>Teacher Signups</CardTitle>
            <CardDescription>
              Monthly trend of new teacher accounts across the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartContainer
              config={teacherSignupConfig}
              className="h-[260px] w-full"
            >
              <BarChart data={teacherSignupData} barSize={18}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={{ fill: "rgba(148, 163, 184, 0.15)" }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="signups"
                  fill="var(--color-signups)"
                  radius={[4, 4, 0, 0]}
                />
                <ChartLegend
                  verticalAlign="bottom"
                  content={<ChartLegendContent />}
                />
              </BarChart>
            </ChartContainer>

            <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {avgMonthlyTeacherSignups}
                </p>
                <p>Average monthly signups</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {totalTeacherSignups}
                </p>
                <p>Signups this period</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {latestTeacherSignup.signups}
                </p>
                <p>Latest month signups</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Country Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Country Stats</CardTitle>
            <CardDescription>
              Distribution of teachers by country
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Teachers",
                  color: "#3b82f6",
                },
              }}
              className="h-[300px] w-full"
            >
              <BarChart data={countryStats} layout="vertical" barSize={30}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  type="category"
                  dataKey="country"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      formatter={(value) => [`${value} teachers`, "Count"]}
                    />
                  }
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Grade Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Stats</CardTitle>
            <CardDescription>
              Distribution of teachers by grade levels taught
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Teachers",
                  color: "#f97316",
                },
              }}
              className="h-[300px] w-full"
            >
              <BarChart data={gradeStats} layout="vertical" barSize={30}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  type="category"
                  dataKey="grade"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={80}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `Grade ${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      formatter={(value) => [`${value} teachers`, "Count"]}
                    />
                  }
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gender Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Gender Stats</CardTitle>
            <CardDescription>
              Distribution of teachers by gender
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Teachers",
                  color: "#10b981",
                },
              }}
              className="h-[300px] w-full"
            >
              <BarChart data={genderStats} layout="vertical" barSize={30}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  type="category"
                  dataKey="gender"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      formatter={(value) => [`${value} teachers`, "Count"]}
                    />
                  }
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>
       <section>
        <div className="mt-10">
          <ManageTeachers />
        </div>
      </section>
    </div>
  );
}
