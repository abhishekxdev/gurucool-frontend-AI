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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

// Zod schema for answer validation
const answerSchema = z.object({
  answer: z
    .string()
    .min(50, "Your answer must be at least 50 characters")
    .max(2000, "Your answer must not exceed 2000 characters"),
});

// Mock assessment data with short answer questions
const mockAssessments = [
  {
    id: 1,
    title: "Classroom Management Fundamentals",
    competency: "Classroom Management",
    questions: [
      {
        id: 1,
        question:
          "Describe three proactive strategies you would use to prevent disruptive behavior in your classroom. Explain why each strategy is effective.",
      },
      {
        id: 2,
        question:
          "How would you establish and communicate classroom rules and expectations at the beginning of the school year? Provide specific examples.",
      },
    ],
  },
  {
    id: 2,
    title: "Differentiated Instruction Strategies",
    competency: "Instructional Design",
    questions: [
      {
        id: 1,
        question:
          "Explain how you would differentiate a math lesson on fractions for students with varying ability levels. Include specific accommodations for struggling learners and extensions for advanced students.",
      },
      {
        id: 2,
        question:
          "Describe how you would use formative assessment data to adjust your instruction mid-lesson. Provide a concrete example from your teaching experience or a hypothetical scenario.",
      },
    ],
  },
  {
    id: 3,
    title: "Assessment & Evaluation Techniques",
    competency: "Assessment",
    questions: [
      {
        id: 1,
        question:
          "Compare and contrast formative and summative assessments. When would you use each type, and how do they inform your teaching practice?",
      },
      {
        id: 2,
        question:
          "Design a rubric for evaluating a student presentation. Include at least four criteria with descriptors for each performance level.",
      },
    ],
  },
  {
    id: 4,
    title: "Technology Integration in Teaching",
    competency: "Technology",
    questions: [
      {
        id: 1,
        question:
          "Describe how you would integrate technology meaningfully into a lesson while ensuring it enhances learning rather than distracting from it.",
      },
      {
        id: 2,
        question:
          "What strategies would you use to address the digital divide and ensure equitable access to technology-based learning for all students?",
      },
    ],
  },
  {
    id: 5,
    title: "Student Engagement Best Practices",
    competency: "Classroom Management",
    questions: [
      {
        id: 1,
        question:
          "Describe three specific strategies you would use to re-engage students who have become disinterested during a lesson. Explain the rationale behind each strategy.",
      },
      {
        id: 2,
        question:
          "How would you design a lesson that incorporates student voice and choice? Provide a specific example with learning objectives.",
      },
    ],
  },
  {
    id: 6,
    title: "Inclusive Education Fundamentals",
    competency: "Inclusive Practices",
    questions: [
      {
        id: 1,
        question:
          "Explain how you would modify your teaching approach to support a student with ADHD in your classroom. Include both instructional and environmental accommodations.",
      },
      {
        id: 2,
        question:
          "Describe how you would create a culturally responsive classroom environment. What specific practices would you implement?",
      },
    ],
  },
  {
    id: 7,
    title: "Effective Communication with Parents",
    competency: "Communication",
    questions: [
      {
        id: 1,
        question:
          "How would you communicate with a parent who is upset about their child's grade? Outline the steps you would take and the key points you would address.",
      },
      {
        id: 2,
        question:
          "Describe your approach to keeping parents informed about their child's progress throughout the school year. What communication methods would you use and why?",
      },
    ],
  },
  {
    id: 8,
    title: "Data-Driven Instruction",
    competency: "Assessment",
    questions: [
      {
        id: 1,
        question:
          "Explain how you would use student assessment data to identify learning gaps and plan targeted interventions. Provide a specific example.",
      },
      {
        id: 2,
        question:
          "Describe how you would track and monitor student progress over time. What data would you collect and how would you use it to inform instruction?",
      },
    ],
  },
];

type AnswerState = {
  [questionId: number]: string;
};

type ErrorState = {
  [questionId: number]: string | null;
};

const ShortAnswerPage = () => {
  const params = useParams();
  const router = useRouter();
  const assessmentId = Number(params.id);

  const assessment = mockAssessments.find((a) => a.id === assessmentId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [errors, setErrors] = useState<ErrorState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

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

  const questions = assessment.questions;
  const totalQuestions = questions.length;
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const currentAnswer = answers[question.id] || "";
  const currentError = errors[question.id] || null;
  const characterCount = currentAnswer.length;

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }));

    // Clear error when typing
    if (errors[question.id]) {
      setErrors((prev) => ({
        ...prev,
        [question.id]: null,
      }));
    }
  };

  const validateCurrentAnswer = () => {
    const result = answerSchema.safeParse({ answer: currentAnswer });
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [question.id]: result.error.issues[0].message,
      }));
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentAnswer()) return;

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentAnswer()) return;

    // Validate all answers before submitting
    let hasErrors = false;
    questions.forEach((q) => {
      const answer = answers[q.id] || "";
      const result = answerSchema.safeParse({ answer });
      if (!result.success) {
        setErrors((prev) => ({
          ...prev,
          [q.id]: result.error.issues[0].message,
        }));
        hasErrors = true;
      }
    });

    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowCompletionDialog(true);
  };

  const handleContinue = () => {
    router.push(`/teacher/dashboard/assessments/${assessmentId}/audio`);
  };

  return (
    <>
      {/* Completion Dialog */}
      <Dialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="size-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl">
              Short Answers Completed! 🎉
            </DialogTitle>
            <DialogDescription>
              Your short answers have been saved successfully. Continue to the
              next step to upload your audio response.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleContinue} className="w-full sm:w-auto">
              Continue to Audio Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  `/teacher/dashboard/assessments/${assessmentId}/mcqs`
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
                  Short Answer
                </Badge>
                <span className="flex items-center gap-1">
                  <FileText className="size-3" />
                  {totalQuestions} Questions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="flex flex-1 flex-col overflow-hidden">
          <CardHeader className="shrink-0">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Badge variant="secondary">Question {currentQuestion + 1}</Badge>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-foreground leading-relaxed">
              {question.question}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col">
              <Textarea
                placeholder="Type your answer here... (minimum 50 characters)"
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="flex-1 min-h-[200px] resize-none text-sm sm:text-base"
              />
              <div className="flex justify-between items-center mt-2 text-xs sm:text-sm">
                <span
                  className={
                    currentError
                      ? "text-destructive"
                      : characterCount >= 50
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }
                >
                  {characterCount}/2000 characters
                  {characterCount < 50 &&
                    ` (${50 - characterCount} more needed)`}
                </span>
                {currentError && (
                  <span className="text-destructive">{currentError}</span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between border-t pt-4 shrink-0">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="size-4 mr-2" />
              Previous
            </Button>
            {currentQuestion === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || characterCount < 50}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Answers"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={characterCount < 50}
                className="w-full sm:w-auto"
              >
                Next
                <ArrowRight className="size-4 ml-2" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default ShortAnswerPage;
