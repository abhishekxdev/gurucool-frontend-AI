"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Mock assessment data
const mockAssessments = [
  {
    id: 1,
    title: "Classroom Management Fundamentals",
    competency: "Classroom Management",
    duration: "45 mins",
  },
  {
    id: 2,
    title: "Differentiated Instruction Strategies",
    competency: "Instructional Design",
    duration: "60 mins",
  },
  {
    id: 3,
    title: "Assessment & Evaluation Techniques",
    competency: "Assessment",
    duration: "50 mins",
  },
  {
    id: 4,
    title: "Technology Integration in Teaching",
    competency: "Technology",
    duration: "40 mins",
  },
  {
    id: 5,
    title: "Student Engagement Best Practices",
    competency: "Classroom Management",
    duration: "35 mins",
  },
  {
    id: 6,
    title: "Inclusive Education Fundamentals",
    competency: "Inclusive Practices",
    duration: "55 mins",
  },
  {
    id: 7,
    title: "Effective Communication with Parents",
    competency: "Communication",
    duration: "30 mins",
  },
  {
    id: 8,
    title: "Data-Driven Instruction",
    competency: "Assessment",
    duration: "45 mins",
  },
];

// Mock MCQ questions
const mockQuestions = [
  {
    id: 1,
    question:
      "A student consistently arrives late to class. Which approach would be most effective?",
    options: [
      { id: "a", text: "Publicly call out the student each time" },
      { id: "b", text: "Have a private conversation to understand the cause" },
      { id: "c", text: "Ignore the behavior completely" },
      { id: "d", text: "Send the student to the principal immediately" },
    ],
    correctAnswer: "b",
    explanation:
      "Having a private conversation helps understand the root cause and builds trust with the student while addressing the behavior respectfully.",
  },
  {
    id: 2,
    question:
      "Which of the following is the BEST example of positive reinforcement?",
    options: [
      { id: "a", text: "Taking away recess for misbehavior" },
      { id: "b", text: "Ignoring good behavior to avoid favoritism" },
      {
        id: "c",
        text: 'Praising a student specifically: "Great job raising your hand!"',
      },
      {
        id: "d",
        text: "Giving all students the same grade regardless of effort",
      },
    ],
    correctAnswer: "c",
    explanation:
      "Specific praise reinforces the exact behavior you want to see repeated and helps students understand expectations.",
  },
  {
    id: 3,
    question: "When establishing classroom routines, teachers should:",
    options: [
      { id: "a", text: "Wait until problems arise to create rules" },
      { id: "b", text: "Establish and practice routines from day one" },
      { id: "c", text: "Let students decide all the rules without guidance" },
      { id: "d", text: "Change routines frequently to keep students alert" },
    ],
    correctAnswer: "b",
    explanation:
      "Establishing routines early and practicing them consistently creates a predictable, safe learning environment.",
  },
  {
    id: 4,
    question:
      "A student is talking during instruction. What should be your FIRST response?",
    options: [
      { id: "a", text: "Stop teaching and lecture the class about respect" },
      { id: "b", text: "Use non-verbal cues like eye contact or proximity" },
      { id: "c", text: "Immediately send the student out of class" },
      { id: "d", text: "Yell at the student to get their attention" },
    ],
    correctAnswer: "b",
    explanation:
      "Non-verbal cues are the least disruptive way to redirect behavior while maintaining the flow of instruction.",
  },
  {
    id: 5,
    question:
      "Which strategy is MOST effective for maintaining student engagement?",
    options: [
      { id: "a", text: "Long lectures with minimal student interaction" },
      {
        id: "b",
        text: "Active learning with frequent opportunities for participation",
      },
      { id: "c", text: "Silent reading for the entire class period" },
      { id: "d", text: "Showing videos without discussion" },
    ],
    correctAnswer: "b",
    explanation:
      "Active learning keeps students engaged, helps them process information, and makes learning more meaningful.",
  },
];

type AnswerState = {
  [questionId: number]: string;
};

const MCQsPage = () => {
  const params = useParams();
  const router = useRouter();
  const assessmentId = Number(params.id);

  const assessment = mockAssessments.find((a) => a.id === assessmentId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [showResults, setShowResults] = useState(false);

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

  const question = mockQuestions[currentQuestion];
  const totalQuestions = mockQuestions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const MARKS_PER_QUESTION = 10;

  const calculateScore = () => {
    let correct = 0;
    mockQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const calculateMarks = () => {
    return calculateScore() * MARKS_PER_QUESTION;
  };

  const totalMarks = totalQuestions * MARKS_PER_QUESTION;

  const isCurrentAnswered = answers[question?.id] !== undefined;

  const score = calculateScore();
  const marks = calculateMarks();
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 80;

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
                `/teacher/dashboard/assessments/${assessmentId}/chat`
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
                MCQ Assessment
              </Badge>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
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
      <Card className="flex flex-1 flex-col">
        <CardHeader>
          <p className="text-lg sm:text-xl font-medium">{question.question}</p>
        </CardHeader>
        <CardContent className="flex-1">
          <RadioGroup
            value={answers[question.id] || ""}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {question.options.map((option) => {
              const isSelected = answers[question.id] === option.id;

              return (
                <div
                  key={option.id}
                  className={`flex items-center space-x-3 rounded-lg border p-3 sm:p-4 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label
                    htmlFor={option.id}
                    className="flex-1 cursor-pointer text-sm sm:text-base"
                  >
                    {option.text}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="size-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isCurrentAnswered}
            className="w-full sm:w-auto"
          >
            {currentQuestion === totalQuestions - 1 ? "Finish" : "Next"}
            {currentQuestion !== totalQuestions - 1 && (
              <ArrowRight className="size-4 ml-2" />
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-md font-[montserrat]">
          <DialogHeader className="text-center sm:text-center">
            <div
              className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-full ${
                passed ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {passed ? (
                <CheckCircle2 className="size-8 text-green-600" />
              ) : (
                <XCircle className="size-8 text-red-600" />
              )}
            </div>
            <DialogTitle className="text-2xl">
              {passed ? "Congratulations! 🎉" : "Keep Learning! 📚"}
            </DialogTitle>
            <DialogDescription>
              {passed
                ? "You have successfully completed the assessment."
                : "You need 50% to pass. Review the material and try again."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">Your Score</p>
              <p className="text-4xl font-bold">
                {marks}/{totalMarks}
              </p>
              <p className="text-sm text-muted-foreground">
                {score} out of {totalQuestions} correct ({percentage}%)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                +10 marks per correct answer
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Passing Score</span>
                <span>50%</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => router.replace("/teacher/dashboard/assessments")}
            >
              Back to Assessments
            </Button>
            {!passed && (
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setShowResults(false);
                }}
              >
                Try Again
              </Button>
            )}
            {passed && (
              <Button
                className="w-full sm:w-auto"
                onClick={() =>
                  router.push(
                    `/teacher/dashboard/assessments/${assessmentId}/short-answer`
                  )
                }
              >
                Next Step: Short Answer
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MCQsPage;
