"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ArrowLeft,
    CheckCircle2,
    FileText,
    MessageSquare,
    Sparkles,
    Video,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const PreAssessmentInstructionsPage = () => {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id;

  const handleBeginAssessment = () => {
    router.push(`/teacher/dashboard/assessments/${assessmentId}/mcqs`);
  };

  const handleTakeLater = () => {
    router.push("/teacher/dashboard");
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-3 sm:p-6 font-[montserrat]">
      <div className="w-full max-w-3xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          className="mb-4"
          onClick={() => router.push("/teacher/dashboard")}
        >
          <ArrowLeft className="size-5" />
        </Button>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center border-b pb-6">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="size-8 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Teacher Competency Benchmark
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Welcome to your competency assessment. This evaluation will help
              us understand your teaching strengths and areas for growth.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Purpose Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="size-5 text-primary" />
                Purpose of the Test
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                This assessment is designed to benchmark your current competency
                level across various teaching domains. Your results will be used
                to tailor personalized learning paths, recommend relevant
                professional development opportunities, and help you track your
                growth as an educator.
              </p>
            </div>

            {/* Domains Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="size-5 text-primary" />
                Number of Domains
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                This assessment covers up to <strong>25 teaching domains</strong>{" "}
                including but not limited to:
              </p>
              <div className="pl-7">
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Subject Expertise & Content Knowledge</li>
                  <li>Pedagogical Strategies & Instructional Design</li>
                  <li>Classroom Management</li>
                  <li>Student Engagement & Motivation</li>
                  <li>Assessment & Evaluation Techniques</li>
                  <li>Technology Integration</li>
                  <li>Communication & Collaboration</li>
                  <li>Inclusive Education Practices</li>
                  <li>And more...</li>
                </ul>
              </div>
            </div>

            {/* Question Types Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="size-5 text-primary" />
                Question Types
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed pl-7 mb-3">
                The assessment includes various question formats to comprehensively
                evaluate your competencies:
              </p>
              <div className="pl-7 space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                    <FileText className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">MCQs (Multiple Choice Questions)</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Test your theoretical knowledge and understanding of core
                      teaching concepts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                    <MessageSquare className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Short Answer</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Demonstrate your ability to articulate teaching strategies
                      and explain concepts clearly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                    <Video className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Voice / Video Response</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Showcase your communication skills and practical teaching
                      abilities through audio or video demonstrations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Evaluation Disclosure */}
            <div className="space-y-2 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Sparkles className="size-5" />
                AI-Based Evaluation Disclosure
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                This assessment utilizes advanced AI technology to evaluate your
                responses. Our AI system analyzes your answers based on established
                teaching competency frameworks and pedagogical best practices. The
                evaluation is designed to be fair, consistent, and comprehensive.
                Your responses will be reviewed by our AI system to provide
                detailed feedback and competency scores across all assessed domains.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              variant="outline"
              className="w-full sm:w-auto sm:flex-1"
              onClick={handleTakeLater}
            >
              Take Later
            </Button>
            <Button
              className="w-full sm:w-auto sm:flex-1"
              onClick={handleBeginAssessment}
            >
              Begin Assessment
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PreAssessmentInstructionsPage;
