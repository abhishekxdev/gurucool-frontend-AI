import { IconChevronRight, IconCircle, IconSchool } from "@tabler/icons-react";
import { useTransitionRouter } from "next-view-transitions";
import dynamic from "next/dynamic";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type AssessmentStatus = "not-started" | "in-progress" | "completed";

type SectionStatus = {
  name: string;
  completed: boolean;
};

interface TeacherAssessmentFlagProps {
  assessmentStatus?: AssessmentStatus;
  sections?: SectionStatus[]; // e.g., [{ name: "MCQ", completed: true }, { name: "Video Response", completed: false }]
}

const TeacherAssessmentFlag = ({
  assessmentStatus = "not-started",
  sections = [],
}: TeacherAssessmentFlagProps) => {
  const router = useTransitionRouter();

  const isInProgress = assessmentStatus === "in-progress";
  const isCompleted = assessmentStatus === "completed";

  // Calculate remaining sections
  const remainingSections = sections.filter((s) => !s.completed);
  const completedCount = sections.filter((s) => s.completed).length;
  const totalCount = sections.length;

  // Don't show banner if completed
  if (isCompleted) return null;

  return (
    <div>
      <Card className="bg-linear-to-b from-primary to-primary/80 text-card-foreground border border-rounded-2xl overflow-hidden relative h-[180px]">
        {/* Background Icon */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none opacity-30 pr-8 z-0">
          <IconSchool size={300} />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3 flex-wrap">
              <CardTitle className="text-3xl font-semibold dark:text-white text-white">
                {isInProgress
                  ? "Assessment in Progress"
                  : "Begin with Your Skill Check"}
              </CardTitle>
              {isInProgress && (
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  {completedCount}/{totalCount} Sections Complete
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex flex-col gap-2">
              <CardDescription className="text-base text-white md:text-lg">
                {isInProgress
                  ? "Continue where you left off and complete your competency assessment."
                  : "Complete the competency test to verify your expertise."}
              </CardDescription>
              {/* Note Section */}
              <div className="mt-2 text-xs text-white/70">
                {isInProgress && remainingSections.length > 0 ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>Remaining:</span>
                    {remainingSections.map((section, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-white/10 text-white border-white/30 text-xs"
                      >
                        <IconCircle size={10} className="mr-1" />
                        {section.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span>
                    {isInProgress
                      ? "Your progress has been saved. Resume to complete the remaining sections."
                      : "Note: This is your first test. Your entered qualifications will be checked based on your performance."}
                  </span>
                )}
              </div>
            </div>
            {/* Move Button to the right */}
            <CardFooter className="flex flex-col md:flex-row md:items-center md:justify-end p-0">
              <Button
                onClick={() =>
                  isInProgress
                    ? router.push("/teacher/dashboard/assessments/1/mcqs")
                    : router.push("/teacher/dashboard/assessments/1/instructions")
                }
              >
                {isInProgress
                  ? "Continue Assessment"
                  : "Start Your Competency Test"}
                <IconChevronRight size={20} />
              </Button>
            </CardFooter>
          </CardContent>
        </div>
      </Card>

    </div>
  );
};

export default TeacherAssessmentFlag;
