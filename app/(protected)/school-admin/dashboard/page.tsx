import AssignpdSchool from "@/components/school-admin-dashboard/assignpd-school";
import DataCards from "@/components/school-admin-dashboard/data-cards";
import TeacherPending from "@/components/school-admin-dashboard/teacher-pending";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockSchool, teacherDirectory } from "@/lib/data";
import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react";
import {
  AlertTriangle,
  Building2,
  Calendar,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import { Link } from "next-view-transitions";

const SchoolDashboard = () => {
  const school = mockSchool;

  // Mock verification status - you can change this based on your requirements
  const isVerified = true;
  const pendingTeacherApprovals = 9;

  // Calculate total badges and certificates issued for this school
  const schoolTeachers = teacherDirectory.filter(
    (teacher) => teacher.schoolId === school.id
  );
  const totalBadgesIssued = schoolTeachers.reduce(
    (sum, teacher) => sum + teacher.totalBadgesEarned,
    0
  );
  const totalCertificatesIssued = schoolTeachers.reduce(
    (sum, teacher) => sum + teacher.certificates.length,
    0
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col font-[montserrat]">
      {/* School Profile Section - Full Width */}
      <section className="w-full border-b pb-6">
        <div className="">
          <div className="p-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                  <AvatarImage src={school.logo} alt={school.name} />
                  <AvatarFallback className="text-xl font-semibold bg-primary/10">
                    {getInitials(school.name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* School Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-xl truncate">
                    {school.name}
                  </h3>
                  {isVerified ? (
                    <div className="text-green-500">
                      <IconRosetteDiscountCheckFilled className="size-5" />
                    </div>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-500/60 text-yellow-700 rounded-sm gap-1"
                    >
                      <Clock className="size-3" />
                      Unverified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  Welcome to your school admin dashboard 👋🏻
                </p>

                {/* Additional School Info */}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    <span>{school.address.split(",")[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="size-3" />
                    <span>{school.principalName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>Est. {school.establishedYear}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 flex-shrink-0">
                {/* Teachers Count */}
                <div className="text-start">
                  <p className="text-xs text-muted-foreground mb-1">Teachers</p>
                  <p className="text-4xl font-bold">{school.totalTeachers}</p>
                </div>

                {/* Pending Approvals */}
                <div className="text-start">
                  <p className="text-xs text-muted-foreground mb-1">Pending</p>
                  <p className="text-4xl font-bold">
                    {pendingTeacherApprovals}
                  </p>
                </div>

                {/* Total Badges Issued */}
                <div className="text-start">
                  <p className="text-xs text-muted-foreground mb-1">
                    Badges Issued
                  </p>
                  <p className="text-4xl font-bold">{totalBadgesIssued}</p>
                </div>

                {/* Total Certificates Issued */}
                <div className="text-start">
                  <p className="text-xs text-muted-foreground mb-1">
                    Certificates Issued
                  </p>
                  <p className="text-4xl font-bold">{totalCertificatesIssued}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pending Approvals Banner */}
      {pendingTeacherApprovals > 0 && (
        <div className="flex items-center justify-center w-full px-6 py-6 mb-8">
          <Alert className="dark:bg-orange-500/50 dark:border-orange-500/50 bg-orange-500 border-orange-500 text-white [&>svg]:text-white font-[montserrat]">
            <AlertTriangle />
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 flex-1 justify-center">
                <AlertTitle className="text-white">
                  {pendingTeacherApprovals} teacher approval
                  {pendingTeacherApprovals > 1 ? "s" : ""} pending!
                </AlertTitle>
                <span className="text-white/80">·</span>
                <AlertDescription className="text-white/90 inline">
                  Review and approve teacher registrations to grant them access.
                </AlertDescription>
                <Link
                  href="/school-admin/dashboard/pending-approvals"
                  className="text-white font-semibold underline underline-offset-4 hover:text-white/90"
                >
                  Review Now
                </Link>
              </div>
              <button className="text-white/80 hover:text-white ml-4 flex-shrink-0">
                <X className="size-4" />
              </button>
            </div>
          </Alert>
        </div>
      )}

      {/* Analytics Section */}
      <section className="w-full border-b pb-8">
        <div className="px-6">
          <div className="font-[montserrat]">
            <h2 className="text-xl font-semibold mb-4 text-accent-foreground/80">
              Analytics Overview
            </h2>
            <DataCards />
          </div>
        </div>
      </section>

      {/* PD Assignment Section */}
      <section className="w-full border-b py-8">
        <div className="px-6">
          <div className="font-[montserrat]">
            <h2 className="text-xl font-semibold mb-4 text-accent-foreground/80">
              Assign Professional Development Modules
            </h2>
            <AssignpdSchool pdCount={4} />
          </div>
        </div>
      </section>

      {/* Pending Teachers Table Section */}
      <section className="w-full py-8">
        <div className="px-6">
          <div className="font-[montserrat]">
            <h2 className="text-xl font-semibold mb-4 text-accent-foreground/80">
              Pending Teachers
            </h2>
            <TeacherPending
              showFiltersAndSearch={false}
              key="pending-teachers"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchoolDashboard;
