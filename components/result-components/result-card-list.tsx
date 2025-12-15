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
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  RefreshCcw,
  XCircle,
} from "lucide-react";

// Types
export interface AssessmentResult {
  id: number;
  title: string;
  competency: string;
  status: "passed" | "failed" | "locked" | "evaluating";
  attemptNumber: number;
  maxAttempts: number;
  completedAt: string;
  lockedUntil?: string;
  lockDaysRemaining?: number;
  lockHoursRemaining?: number;
}

// Single Result Card Component
interface ResultCardProps {
  result: AssessmentResult;
  onViewResult: (result: AssessmentResult) => void;
}

const getStatusBadge = (status: AssessmentResult["status"]) => {
  switch (status) {
    case "passed":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle2 className="size-3 mr-1" />
          Passed
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="size-3 mr-1" />
          Failed
        </Badge>
      );
    case "locked":
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          <Lock className="size-3 mr-1" />
          Locked for 10 days
        </Badge>
      );
    case "evaluating":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <Clock className="size-3 mr-1" />
          Evaluating
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

export const ResultCard = ({ result, onViewResult }: ResultCardProps) => {
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold line-clamp-2">
              {result.title}
            </h3>
          </div>
          {getStatusBadge(result.status)}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
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

        {/* Evaluation in progress message */}
        {result.status === "evaluating" && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-200">
            <AlertCircle className="size-4 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-700">
              Evaluation still in progress. Please check back later.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <Button
          className="w-full"
          variant={result.status === "evaluating" ? "secondary" : "default"}
          disabled={result.status === "evaluating"}
          onClick={() => onViewResult(result)}
        >
          <FileText className="size-4 mr-2" />
          View Result
        </Button>
      </CardFooter>
    </Card>
  );
};

// Result Card List Component
interface ResultCardListProps {
  results: AssessmentResult[];
  onViewResult: (result: AssessmentResult) => void;
}

export const ResultCardList = ({
  results,
  onViewResult,
}: ResultCardListProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((result) => (
        <ResultCard
          key={result.id}
          result={result}
          onViewResult={onViewResult}
        />
      ))}
    </div>
  );
};

export default ResultCardList;
