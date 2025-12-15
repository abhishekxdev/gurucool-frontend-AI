"use client";

import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle2,
  FileAudio,
  FileText,
  Loader2,
  Send,
  Video,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Mock assessment data
const mockAssessments = [
  {
    id: 1,
    title: "Classroom Management Fundamentals",
    competency: "Classroom Management",
  },
  {
    id: 2,
    title: "Differentiated Instruction Strategies",
    competency: "Instructional Design",
  },
  {
    id: 3,
    title: "Assessment & Evaluation Techniques",
    competency: "Assessment",
  },
  {
    id: 4,
    title: "Technology Integration in Teaching",
    competency: "Technology",
  },
  {
    id: 5,
    title: "Student Engagement Best Practices",
    competency: "Classroom Management",
  },
  {
    id: 6,
    title: "Inclusive Education Fundamentals",
    competency: "Inclusive Practices",
  },
  {
    id: 7,
    title: "Effective Communication with Parents",
    competency: "Communication",
  },
  {
    id: 8,
    title: "Data-Driven Instruction",
    competency: "Assessment",
  },
];

// Mock submitted responses (in real app, these would come from state management or API)
const mockResponses = {
  shortAnswer: {
    submitted: true,
    questionsAnswered: 2,
    totalQuestions: 2,
  },
  audio: {
    submitted: true,
    fileName: "audio_response.mp3",
    fileSize: "2.4 MB",
    duration: "2:34",
  },
  video: {
    submitted: true,
    fileName: "teaching_demo.mp4",
    fileSize: "18.7 MB",
    duration: "3:12",
  },
};

const SubmitPage = () => {
  const params = useParams();
  const router = useRouter();
  const assessmentId = Number(params.id);

  const assessment = mockAssessments.find((a) => a.id === assessmentId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  if (!assessment) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <h2 className="mb-2 text-xl font-semibold">Assessment Not Found</h2>
            <p className="mb-4 text-muted-foreground">
              The assessment you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button
              onClick={() => router.replace("/teacher/dashboard/assessments")}
            >
              Back to Assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allResponsesComplete =
    mockResponses.shortAnswer.submitted &&
    mockResponses.audio.submitted &&
    mockResponses.video.submitted;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitProgress(0);

    // Simulate submission progress
    const interval = setInterval(() => {
      setSubmitProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSubmitting(false);
          setShowSuccessDialog(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col p-3 sm:p-6 font-[montserrat]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() =>
              router.replace(
                `/teacher/dashboard/assessments/${assessmentId}/video`
              )
            }
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-semibold truncate">
              {assessment.title}
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                Review & Submit
              </Badge>
              <span>Final Step</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 overflow-auto">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assessment Summary</CardTitle>
            <CardDescription>
              Review your responses before submitting. All responses will be
              submitted together for evaluation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Short Answer Response */}
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                <FileText className="size-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium">Short Answer Questions</h3>
                  {mockResponses.shortAnswer.submitted ? (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle2 className="size-3 mr-1" />
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {mockResponses.shortAnswer.questionsAnswered} of{" "}
                  {mockResponses.shortAnswer.totalQuestions} questions answered
                </p>
              </div>
            </div>

            {/* Audio Response */}
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                <FileAudio className="size-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium">Audio Response</h3>
                  {mockResponses.audio.submitted ? (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle2 className="size-3 mr-1" />
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {mockResponses.audio.fileName} •{" "}
                  {mockResponses.audio.fileSize} •{" "}
                  {mockResponses.audio.duration}
                </p>
              </div>
            </div>

            {/* Video Response */}
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                <Video className="size-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium">Video Response</h3>
                  {mockResponses.video.submitted ? (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle2 className="size-3 mr-1" />
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {mockResponses.video.fileName} •{" "}
                  {mockResponses.video.fileSize} •{" "}
                  {mockResponses.video.duration}
                </p>
              </div>
            </div>

            <Separator />

            {/* Submission Info */}
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
              <h4 className="font-medium text-amber-800 mb-2">
                Before You Submit
              </h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>
                  • All responses will be submitted together for evaluation
                </li>
                <li>• You cannot edit your responses after submission</li>
                <li>• Results will be available within 24-48 hours</li>
                <li>
                  • You will receive an email notification when results are
                  ready
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {/* Submit Progress */}
            {isSubmitting && (
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Submitting responses...</span>
                  <span>{submitProgress}%</span>
                </div>
                <Progress value={submitProgress} className="h-2" />
              </div>
            )}

            {/* Submit Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={!allResponsesComplete || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Submit All Responses
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md font-[montserrat]">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="size-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl">
              Assessment Submitted! 🎉
            </DialogTitle>
            <DialogDescription>
              You have completed the PD Assessment. AI is now evaluating your
              answers and submissions. Please check the Results section after
              some time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">Assessment</p>
              <p className="text-lg font-semibold">{assessment.title}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted/50 p-3">
                <FileText className="size-5 mx-auto text-blue-600 mb-1" />
                <p className="text-xs text-muted-foreground">Short Answer</p>
                <p className="text-sm font-medium">✓</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <FileAudio className="size-5 mx-auto text-purple-600 mb-1" />
                <p className="text-xs text-muted-foreground">Audio</p>
                <p className="text-sm font-medium">✓</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <Video className="size-5 mx-auto text-orange-600 mb-1" />
                <p className="text-xs text-muted-foreground">Video</p>
                <p className="text-sm font-medium">✓</p>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:flex-col sm:space-x-0 gap-2">
            <Button
              className="w-full"
              onClick={() => router.push(`/teacher/dashboard/results`)}
            >
              Go to Results Section
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => router.push("/teacher/dashboard/")}
            >
              Return to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmitPage;
