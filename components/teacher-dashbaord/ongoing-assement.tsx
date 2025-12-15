"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconListDetails } from "@tabler/icons-react";
import { Award, Eye, FileText, Play, Settings } from "lucide-react";
import { Link } from "next-view-transitions";

// Mock data for ongoing assessments
const ongoingAssessments = [
  {
    id: 1,
    title: "Classroom Management Essentials",
    description: "Learn effective strategies for managing diverse classrooms",
    currentStep: "MCQs",
    completedSteps: ["MCQs"],
    totalSteps: 4,
  },
  {
    id: 2,
    title: "AI Integration in Teaching",
    description: "Master the use of AI tools to enhance learning outcomes",
    currentStep: "Short Answer",
    completedSteps: ["MCQs", "Short Answer"],
    totalSteps: 4,
  },
  {
    id: 3,
    title: "Student Assessment Techniques",
    description: "Modern approaches to evaluating student performance",
    currentStep: "Voice Upload",
    completedSteps: ["MCQs", "Short Answer", "Voice Upload"],
    totalSteps: 4,
  },
  {
    id: 4,
    title: "Digital Literacy for Educators",
    description: "Essential digital skills for modern teaching",
    currentStep: "Video Upload",
    completedSteps: ["MCQs", "Short Answer", "Voice Upload", "Video Upload"],
    totalSteps: 4,
  },
  {
    id: 5,
    title: "Effective Communication Skills",
    description: "Building strong teacher-student relationships",
    currentStep: "MCQs",
    completedSteps: [],
    totalSteps: 4,
  },
  {
    id: 6,
    title: "Inclusive Teaching Practices",
    description: "Creating accessible learning environments for all students",
    currentStep: "Short Answer",
    completedSteps: ["MCQs"],
    totalSteps: 4,
  },
];

// Mock data for results
const assessmentResults = [
  {
    id: 1,
    title: "Inclusive Classrooms",
    description: "Strategies for creating inclusive learning environments",
    score: 88,
    completedDate: "2024-10-04",
    badge: "Expert",
  },
  {
    id: 2,
    title: "Digital Literacy for Educators",
    description: "Essential digital skills for modern teaching",
    score: 91,
    completedDate: "2024-11-01",
    badge: "Master",
  },
  {
    id: 3,
    title: "Effective Communication Skills",
    description: "Building strong teacher-student relationships",
    score: 85,
    completedDate: "2024-09-15",
    badge: "Proficient",
  },
  {
    id: 4,
    title: "Classroom Management",
    description: "Modern classroom management techniques",
    score: 92,
    completedDate: "2024-08-20",
    badge: "Master",
  },
  {
    id: 5,
    title: "Assessment Strategies",
    description: "Innovative approaches to student assessment",
    score: 87,
    completedDate: "2024-07-15",
    badge: "Expert",
  },
  {
    id: 6,
    title: "Technology Integration",
    description: "Effective use of technology in teaching",
    score: 89,
    completedDate: "2024-06-10",
    badge: "Expert",
  },
];

const OngoingAssessments = () => {
  return (
    <div className="w-full font-[montserrat]">
      <Tabs defaultValue="assessments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="assessments" className="gap-2">
            <FileText className="size-4" />
            Ongoing Assessments
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2">
            <IconListDetails className="size-4" />
            Results
          </TabsTrigger>
        </TabsList>

        {/* Assessments Tab - Single Card */}
        <TabsContent value="assessments">
          <div className="grid grid-cols-1 gap-3">
            {ongoingAssessments.slice(0, 1).map((assessment) => {
              return (
                <Card
                  key={assessment.id}
                  className="hover:shadow-md transition-shadow cursor-pointer group flex flex-col overflow-hidden"
                >
                  <CardHeader className="py-3 px-4 space-y-0 flex-shrink-0">
                    <div className="flex items-start justify-between mb-1.5">
                      <FileText className="size-6 text-primary" />
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Settings className="size-3.5" />
                      </button>
                    </div>
                    <CardTitle className="text-sm leading-tight line-clamp-1 mb-1">
                      {assessment.title}
                    </CardTitle>
                    <CardDescription className="text-xs leading-tight line-clamp-2">
                      {assessment.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3 px-4 mt-auto">
                    <Button
                      size="sm"
                      className="w-full gap-2 h-8"
                      variant={"outline"}
                      asChild
                    >
                      <Link
                        href={`/teacher/dashboard/learning/${assessment.id}/mcqs`}
                      >
                        <Play className="size-3.5" />
                        Continue
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Results Tab - 3 Column Grid */}
        <TabsContent value="results">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {assessmentResults.map((result) => {
              return (
                <Card
                  key={result.id}
                  className="hover:shadow-md transition-shadow cursor-pointer group flex flex-col overflow-hidden"
                >
                  <CardHeader className="py-3 px-4 space-y-0 flex-shrink-0">
                    <div className="flex items-start justify-between mb-1.5">
                      <IconListDetails className="size-5 text-primary" />
                      <Badge variant="outline" className="text-xs h-5 px-2">
                        {result.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1 mb-1">
                      {result.title}
                    </CardTitle>
                    <CardDescription className="text-xs leading-tight line-clamp-2">
                      {result.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3 px-4 mt-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full gap-2 h-8"
                      asChild
                    >
                      <Link href={`/teacher/dashboard/results/${result.id}`}>
                        <Eye className="size-3.5" />
                        View Result
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OngoingAssessments;
