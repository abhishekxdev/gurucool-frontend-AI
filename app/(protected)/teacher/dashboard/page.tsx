import OngoingAssessments from "@/components/teacher-dashbaord/ongoing-assement";
import PerformanceCards from "@/components/teacher-dashbaord/performance-cards";
import SuggestedPD from "@/components/teacher-dashbaord/suggested-pd";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { teacherDirectory } from "@/lib/data";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  X,
} from "lucide-react";
import { Link } from "next-view-transitions";

const TeacherDashboard = () => {
  // Using a male teacher with pending status - Kabir Singh
  const teacher = teacherDirectory[5]; // Kabir Singh (pending status, male)

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const isApproved = teacher.approvalStatus === "approved";
  const isPending = teacher.approvalStatus === "pending";

  return (
    <div className="flex flex-col">
      {/* User Profile Section - Full Width */}
      <section className="w-full border-b pb-6">
        <div className="font-[inter]">
          <div className="p-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                  <AvatarImage
                    src="/gurucool/avatar.png"
                    alt={`${teacher.firstName} ${teacher.lastName}`}
                  />
                  <AvatarFallback className="text-xl font-semibold bg-primary/10">
                    {getInitials(teacher.firstName, teacher.lastName)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-xl truncate">
                    {teacher.firstName} {teacher.lastName}
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

                {/* Additional User Info */}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="size-3" />
                    <span>{teacher.currentSchool}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="size-3" />
                    <span>{teacher.subjects.slice(0, 2).join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>
                      Joined{" "}
                      {new Date(teacher.joinDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 flex-shrink-0">
                {/* Badges Count */}
                <div className="text-start">
                  <p className="text-xs text-muted-foreground mb-1">Badges</p>
                  <p className="text-4xl font-bold">
                    {teacher.totalBadgesEarned}
                  </p>
                </div>

                {/* Certificates Count */}
                <div className="text-start">
                  <p className="text-xs text-muted-foreground mb-1">
                    Certificates
                  </p>
                  <p className="text-4xl font-bold">
                    {teacher.certificates.length}
                  </p>
                </div>

                {/* Assessments Completed */}
                <div className="text-start">
                  <p className="text-xs text-muted-foreground mb-1">
                    Completed
                  </p>
                  <p className="text-4xl font-bold">
                    {teacher.totalPdCompleted}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competency Test Banner */}
      <div className="flex items-center justify-center w-full px-6 py-6 mb-8">
        <Alert className="dark:bg-orange-500/50 dark:border-orange-500/50 bg-orange-500 border-orange-500 text-white [&>svg]:text-white font-[montserrat]">
          <AlertTriangle />
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 flex-1 justify-center">
              <AlertTitle className="text-white">
                Complete your first competency test!
              </AlertTitle>
              <span className="text-white/80">·</span>
              <AlertDescription className="text-white/90 inline">
                Unlock personalized learning paths and track your progress.
              </AlertDescription>
              <Link
                href="/teacher/dashboard/assessments/1/instructions"
                className="text-white font-semibold underline underline-offset-4 hover:text-white/90"
              >
                Start Test
              </Link>
            </div>
            <button className="text-white/80 hover:text-white ml-4 flex-shrink-0">
              <X className="size-4" />
            </button>
          </div>
        </Alert>
      </div>

      {/* Ongoing Assessments Section */}
      <section className="w-full border-b pb-8">
        <div className="px-6">
          <div className="font-[montserrat]">
            <h2 className="text-xl font-semibold mb-4 text-accent-foreground/80">
              Ongoing Assessments & Results
            </h2>
          </div>
          <OngoingAssessments />
        </div>
      </section>

      {/* Performance Section */}
      <section className="w-full border-b pb-8">
        <div className="px-6 pt-8">
          <div className="font-[montserrat]">
            <h2 className="text-xl font-semibold mb-4 text-accent-foreground/80">
              Performance
            </h2>
            <PerformanceCards />
          </div>
        </div>
      </section>

      {/* Suggested PD's Section */}
      <section className="w-full pb-8">
        <div className="px-6 pt-8">
          <div className="font-[montserrat]">
            <h2 className="text-xl font-semibold mb-4 text-accent-foreground/80">
              Suggested PD's
            </h2>
            {/* Suggested PD's content will go here */}
            <SuggestedPD/>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeacherDashboard;
