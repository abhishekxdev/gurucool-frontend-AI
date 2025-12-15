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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  RefreshCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Types
interface AssessmentResult {
  id: number;
  title: string;
  description: string;
  competency: string;
  status: "approvedByAI" | "locked";
  attemptNumber: number;
  maxAttempts: number;
  completedAt: string;
  // Lock info (for locked assessments)
  lockedUntil?: string;
  lockDaysRemaining?: number;
  lockHoursRemaining?: number;
}

// Mock Data
const mockResults: AssessmentResult[] = [
  {
    id: 1,
    title: "Classroom Management Fundamentals",
    description:
      "Learn essential strategies for creating and maintaining an effective learning environment.",
    competency: "Classroom Management",
    status: "approvedByAI",
    attemptNumber: 1,
    maxAttempts: 3,
    completedAt: "2024-11-25T10:30:00Z",
  },
  {
    id: 2,
    title: "Differentiated Instruction Strategies",
    description:
      "Master techniques for adapting teaching methods to meet diverse student needs.",
    competency: "Instructional Design",
    status: "approvedByAI",
    attemptNumber: 1,
    maxAttempts: 3,
    completedAt: "2024-11-24T14:15:00Z",
  },
  {
    id: 4,
    title: "Technology Integration in Teaching",
    description:
      "Explore how to effectively integrate digital tools into your teaching practice.",
    competency: "Technology",
    status: "approvedByAI",
    attemptNumber: 2,
    maxAttempts: 3,
    completedAt: "2024-11-22T16:20:00Z",
  },
  {
    id: 6,
    title: "Inclusive Education Fundamentals",
    description:
      "Build competencies in creating equitable learning experiences for all students.",
    competency: "Inclusive Practices",
    status: "approvedByAI",
    attemptNumber: 1,
    maxAttempts: 3,
    completedAt: "2024-11-20T13:30:00Z",
  },
  {
    id: 7,
    title: "Digital Literacy Assessment",
    description:
      "Assess and develop digital literacy skills essential for modern teaching.",
    competency: "Technology",
    status: "locked",
    attemptNumber: 3,
    maxAttempts: 3,
    completedAt: "2024-11-18T10:00:00Z",
    lockedUntil: "2024-11-28T10:00:00Z",
    lockDaysRemaining: 3,
    lockHoursRemaining: 5,
  },
];

const ResultsListingPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"approvedByAI">("approvedByAI");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const approvedResults = mockResults.filter(
    (r) => r.status === "approvedByAI"
  );
  const lockedResults = mockResults.filter((r) => r.status === "locked");

  const handleViewResult = (result: AssessmentResult) => {
    router.push(`/teacher/dashboard/results/${result.id}`);
  };

  const getStatusBadge = (status: AssessmentResult["status"]) => {
    switch (status) {
      case "approvedByAI":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="size-3 mr-1" />
            Issued by AI
          </Badge>
        );
      case "locked":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            <Lock className="size-3 mr-1" />
            Locked for 10 days
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const ResultCard = ({ result }: { result: AssessmentResult }) => (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold line-clamp-2">
              {result.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {result.description}
            </p>
          </div>
          {getStatusBadge(result.status)}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 pt-0">
        <Badge variant="outline" className="text-xs">
          {result.competency}
        </Badge>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <RefreshCcw className="size-3.5" />
            Attempt {result.attemptNumber}/{result.maxAttempts}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            {formatDate(result.completedAt)}
          </span>
        </div>

        {/* Lock countdown for locked assessments */}
        {result.status === "locked" && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 border border-gray-200">
            <Clock className="size-4 text-gray-600 shrink-0" />
            <p className="text-xs text-gray-700">
              Available again in: {result.lockDaysRemaining} days,{" "}
              {result.lockHoursRemaining} hours
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-3 border-t">
        <Button
          className="w-full"
          variant="default"
          onClick={() => handleViewResult(result)}
        >
          <FileText className="size-4 mr-2" />
          View Result
        </Button>
      </CardFooter>
    </Card>
  );

  const EmptyState = ({ type }: { type: "approvedByAI" | "locked" }) => {
    const config = {
      approvedByAI: {
        icon: <Trophy className="size-10 text-muted-foreground" />,
        title: "No Approved Assessments Yet",
        description: "Complete PD assessments to see your results here.",
      },
      locked: {
        icon: <Lock className="size-10 text-muted-foreground" />,
        title: "No Locked Assessments",
        description: "You have no locked assessments at the moment.",
      },
    };

    return (
      <Empty>
        <EmptyMedia>{config[type].icon}</EmptyMedia>
        <EmptyContent>
          <EmptyHeader>
            <EmptyTitle>{config[type].title}</EmptyTitle>
            <EmptyDescription>{config[type].description}</EmptyDescription>
          </EmptyHeader>
        </EmptyContent>
      </Empty>
    );
  };

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 font-[montserrat]">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="size-8 text-red-600" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">
              Unable to Load Results
            </h2>
            <p className="mb-4 text-muted-foreground">
              There was an error loading your assessment results. Please try
              again.
            </p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCcw className="size-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col p-4 sm:p-6 font-[montserrat] overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Assessment Results</h1>
        <p className="text-muted-foreground mt-1">
          View your PD assessment outcomes, feedback, and certificates
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full max-w-xl grid-cols-2 mb-6">
          <TabsTrigger value="approvedByAI" className="flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            Issued by AI
            <Badge variant="secondary" className="ml-1">
              {approvedResults.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="locked" className="flex items-center gap-2">
            <Lock className="size-4" />
            Locked
            <Badge variant="secondary" className="ml-1">
              {lockedResults.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCcw className="size-5 animate-spin" />
              <span>Loading results...</span>
            </div>
          </div>
        ) : (
          <>
            <TabsContent value="approvedByAI" className="flex-1 mt-0">
              {approvedResults.length === 0 ? (
                <EmptyState type="approvedByAI" />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {approvedResults.map((result) => (
                    <ResultCard key={result.id} result={result} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="locked" className="flex-1 mt-0">
              {lockedResults.length === 0 ? (
                <EmptyState type="locked" />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {lockedResults.map((result) => (
                    <ResultCard key={result.id} result={result} />
                  ))}
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default ResultsListingPage;
