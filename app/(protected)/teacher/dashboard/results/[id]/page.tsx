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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    ArrowRight,
    Award,
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    ExternalLink,
    FileImage,
    FileText,
    Headphones,
    Lightbulb,
    Link2,
    Lock,
    MessageSquare,
    RefreshCcw,
    Star,
    Target,
    TrendingUp,
    Video,
    XCircle,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Types
interface SectionScore {
  name: string;
  score: number;
  totalMarks: number;
  percentage: number;
  remarks: string;
}

interface ReferenceMaterial {
  id: number;
  type: "pdf" | "image" | "link";
  title: string;
  url: string;
  thumbnail?: string;
}

interface Certificate {
  id: string;
  issueDate: string;
  downloadUrl: string;
}

interface BadgeInfo {
  name: string;
  imageUrl: string;
  approvalStatus: "pending" | "approved" | "rejected";
  adminComments?: string;
}

interface MicroPD {
  id: number;
  title: string;
  description: string;
}

interface LockInfo {
  isLocked: boolean;
  lockedUntil?: string;
  daysRemaining?: number;
  hoursRemaining?: number;
}

interface DetailedResult {
  id: number;
  title: string;
  competency: string;
  status: "passed" | "failed" | "locked";
  score: number;
  totalMarks: number;
  percentage: number;
  xpEarned: number;
  completedAt: string;
  duration: string;
  attemptNumber: number;
  maxAttempts: number;
  canRetry: boolean;
  sectionScores: SectionScore[];
  // AI Feedback
  overallFeedback: string;
  strengths: string[];
  areasForImprovement: string[];
  // Reference Materials
  referenceMaterials?: ReferenceMaterial[];
  // For Passed
  certificate?: Certificate;
  badge?: BadgeInfo;
  // For Failed
  suggestedMicroPDs?: MicroPD[];
  // Lock info
  lockInfo?: LockInfo;
}

// Mock Detailed Results Data
const mockDetailedResults: DetailedResult[] = [
  {
    id: 1,
    title: "Classroom Management Fundamentals",
    competency: "Classroom Management",
    status: "passed",
    score: 85,
    totalMarks: 100,
    percentage: 85,
    xpEarned: 250,
    completedAt: "2024-11-25",
    duration: "45 min",
    attemptNumber: 1,
    maxAttempts: 3,
    canRetry: false,
    overallFeedback:
      "You demonstrated a solid grasp of classroom management principles. Your answers showed practical knowledge that can be directly applied in the classroom. Your video demonstration was particularly strong in showing how to establish presence and build rapport.",
    strengths: [
      "Strong understanding of proactive behavior management",
      "Excellent strategies for establishing routines",
      "Clear communication of expectations",
      "Good de-escalation techniques",
    ],
    areasForImprovement: [
      "Consider more diverse engagement techniques",
      "Could expand on handling severe disruptions",
    ],
    sectionScores: [
      {
        name: "MCQs",
        score: 35,
        totalMarks: 40,
        percentage: 87.5,
        remarks: "Excellent understanding of theoretical concepts",
      },
      {
        name: "Short Answer",
        score: 22,
        totalMarks: 25,
        percentage: 88,
        remarks: "Well-articulated responses with practical examples",
      },
      {
        name: "Audio Response",
        score: 13,
        totalMarks: 15,
        percentage: 86.7,
        remarks: "Clear communication, good voice modulation",
      },
      {
        name: "Video Demonstration",
        score: 15,
        totalMarks: 20,
        percentage: 75,
        remarks: "Good presence but could improve body language",
      },
    ],
    referenceMaterials: [
      {
        id: 1,
        type: "pdf",
        title: "Advanced Classroom Management Strategies",
        url: "/materials/classroom-management.pdf",
      },
      {
        id: 2,
        type: "image",
        title: "Behavior Management Flowchart",
        url: "/materials/behavior-flowchart.png",
        thumbnail: "/materials/behavior-flowchart-thumb.png",
      },
      {
        id: 3,
        type: "link",
        title: "Interactive Classroom Management Course",
        url: "https://example.com/classroom-course",
      },
    ],
    certificate: {
      id: "CERT-CM-2024-001",
      issueDate: "2024-11-25",
      downloadUrl: "/certificates/classroom-management-cert.pdf",
    },
    badge: {
      name: "Classroom Management Expert",
      imageUrl: "/badges/classroom-management.png",
      approvalStatus: "approved",
    },
  },

  {
    id: 3,
    title: "Assessment & Evaluation Techniques",
    competency: "Assessment",
    status: "failed",
    score: 42,
    totalMarks: 100,
    percentage: 42,
    xpEarned: 0,
    completedAt: "2024-11-23",
    duration: "38 min",
    attemptNumber: 1,
    maxAttempts: 3,
    canRetry: true,
    overallFeedback:
      "While you show basic understanding of assessment concepts, there are significant gaps in applying these to practical scenarios. Your short answer responses lacked depth and your video demonstration did not clearly show assessment implementation. We strongly recommend reviewing the learning materials before retrying.",
    strengths: [
      "Basic understanding of formative assessment",
      "Awareness of importance of feedback",
    ],
    areasForImprovement: [
      "Needs deeper understanding of rubric design",
      "Should explore more summative assessment types",
      "Data analysis skills need significant improvement",
      "Alignment of assessments with learning objectives",
    ],
    sectionScores: [
      {
        name: "MCQs",
        score: 20,
        totalMarks: 40,
        percentage: 50,
        remarks: "Many incorrect answers on assessment theory",
      },
      {
        name: "Short Answer",
        score: 10,
        totalMarks: 25,
        percentage: 40,
        remarks: "Responses lack depth and practical examples",
      },
      {
        name: "Audio Response",
        score: 7,
        totalMarks: 15,
        percentage: 46.7,
        remarks: "Unclear explanation, missing key concepts",
      },
      {
        name: "Video Demonstration",
        score: 5,
        totalMarks: 20,
        percentage: 25,
        remarks: "Did not demonstrate assessment implementation",
      },
    ],
    referenceMaterials: [
      {
        id: 1,
        type: "pdf",
        title: "Rubric Design Fundamentals",
        url: "/materials/rubric-design.pdf",
      },
      {
        id: 2,
        type: "pdf",
        title: "Data-Driven Instruction Guide",
        url: "/materials/data-driven-instruction.pdf",
      },
      {
        id: 3,
        type: "link",
        title: "Assessment Best Practices - Video Course",
        url: "https://example.com/assessment-course",
      },
    ],
    suggestedMicroPDs: [
      {
        id: 1,
        title: "Rubric Construction 101",
        description: "Learn the fundamentals of creating effective rubrics",
      },
      {
        id: 2,
        title: "Understanding Bloom's Taxonomy in Assessment",
        description: "Align your assessments with cognitive levels",
      },
      {
        id: 3,
        title: "Data Analysis for Teachers",
        description: "Use assessment data to inform instruction",
      },
    ],
  },
  {
    id: 4,
    title: "Technology Integration in Teaching",
    competency: "Technology",
    status: "passed",
    score: 78,
    totalMarks: 100,
    percentage: 78,
    xpEarned: 200,
    completedAt: "2024-11-22",
    duration: "41 min",
    attemptNumber: 2,
    maxAttempts: 3,
    canRetry: false,
    overallFeedback:
      "Good performance showing practical knowledge of technology integration. Your improvement from the first attempt is notable. Continue to explore how technology can transform learning.",
    strengths: [
      "Good awareness of ed-tech tools",
      "Understanding of digital citizenship",
      "Appropriate tool selection for learning goals",
    ],
    areasForImprovement: [
      "Could explore more interactive platforms",
      "Consider accessibility in tech choices",
    ],
    sectionScores: [
      {
        name: "MCQs",
        score: 32,
        totalMarks: 40,
        percentage: 80,
        remarks: "Good understanding of tech integration concepts",
      },
      {
        name: "Short Answer",
        score: 20,
        totalMarks: 25,
        percentage: 80,
        remarks: "Practical examples provided",
      },
      {
        name: "Audio Response",
        score: 12,
        totalMarks: 15,
        percentage: 80,
        remarks: "Clear explanation of tool selection process",
      },
      {
        name: "Video Demonstration",
        score: 14,
        totalMarks: 20,
        percentage: 70,
        remarks: "Good demo but could show more student interaction",
      },
    ],
    certificate: {
      id: "CERT-TI-2024-004",
      issueDate: "2024-11-22",
      downloadUrl: "/certificates/tech-integration-cert.pdf",
    },
    badge: {
      name: "Tech-Savvy Educator",
      imageUrl: "/badges/tech-educator.png",
      approvalStatus: "rejected",
      adminComments:
        "Please complete the advanced technology module before badge approval.",
    },
  },
  {
    id: 5,
    title: "Student Engagement Best Practices",
    competency: "Classroom Management",
    status: "failed",
    score: 35,
    totalMarks: 100,
    percentage: 35,
    xpEarned: 0,
    completedAt: "2024-11-21",
    duration: "33 min",
    attemptNumber: 2,
    maxAttempts: 3,
    canRetry: true,
    overallFeedback:
      "Your responses show passion but lack the structured approach needed. This is your second attempt and while enthusiasm is important, you need to demonstrate knowledge of specific engagement strategies. Take time to study the engagement frameworks carefully before your final attempt.",
    strengths: [
      "Shows enthusiasm for engaging students",
      "Positive attitude towards teaching",
    ],
    areasForImprovement: [
      "Needs structured approach to engagement",
      "Should explore research-based strategies",
      "Video demonstration lacked concrete examples",
      "Missing understanding of motivation theories",
    ],
    sectionScores: [
      {
        name: "MCQs",
        score: 16,
        totalMarks: 40,
        percentage: 40,
        remarks: "Significant gaps in understanding engagement theory",
      },
      {
        name: "Short Answer",
        score: 8,
        totalMarks: 25,
        percentage: 32,
        remarks: "Responses too general, need specific strategies",
      },
      {
        name: "Audio Response",
        score: 6,
        totalMarks: 15,
        percentage: 40,
        remarks: "Too brief, did not address all points",
      },
      {
        name: "Video Demonstration",
        score: 5,
        totalMarks: 20,
        percentage: 25,
        remarks: "Lacks concrete demonstration of engagement techniques",
      },
    ],
    referenceMaterials: [
      {
        id: 1,
        type: "pdf",
        title: "ARCS Model of Motivation",
        url: "/materials/arcs-model.pdf",
      },
      {
        id: 2,
        type: "image",
        title: "Engagement Strategies Infographic",
        url: "/materials/engagement-infographic.png",
      },
    ],
    suggestedMicroPDs: [
      {
        id: 1,
        title: "The ARCS Model Deep Dive",
        description:
          "Master the attention, relevance, confidence, satisfaction framework",
      },
      {
        id: 2,
        title: "Active Learning Protocols",
        description: "Learn Think-Pair-Share and other engagement protocols",
      },
      {
        id: 3,
        title: "Intrinsic vs Extrinsic Motivation",
        description: "Understand what truly motivates students",
      },
      {
        id: 4,
        title: "Engagement Through Questioning",
        description: "Master the art of asking engaging questions",
      },
    ],
  },
  {
    id: 6,
    title: "Inclusive Education Fundamentals",
    competency: "Inclusive Practices",
    status: "passed",
    score: 88,
    totalMarks: 100,
    percentage: 88,
    xpEarned: 275,
    completedAt: "2024-11-20",
    duration: "48 min",
    attemptNumber: 1,
    maxAttempts: 3,
    canRetry: false,
    overallFeedback:
      "Excellent understanding of inclusive education principles. Your responses demonstrated genuine commitment to creating equitable learning environments.",
    strengths: [
      "Strong understanding of UDL principles",
      "Excellent accommodation strategies",
      "Good awareness of diverse learning needs",
      "Knowledge of legal requirements",
    ],
    areasForImprovement: [
      "Could explore more assistive technologies",
      "Consider more strategies for gifted learners",
    ],
    sectionScores: [
      {
        name: "MCQs",
        score: 36,
        totalMarks: 40,
        percentage: 90,
        remarks: "Strong grasp of inclusion theory and law",
      },
      {
        name: "Short Answer",
        score: 23,
        totalMarks: 25,
        percentage: 92,
        remarks: "Thoughtful, empathetic responses",
      },
      {
        name: "Audio Response",
        score: 13,
        totalMarks: 15,
        percentage: 86.7,
        remarks: "Clear communication of accommodation strategies",
      },
      {
        name: "Video Demonstration",
        score: 16,
        totalMarks: 20,
        percentage: 80,
        remarks: "Good demonstration of inclusive practices",
      },
    ],
    referenceMaterials: [
      {
        id: 1,
        type: "pdf",
        title: "Universal Design for Learning Guide",
        url: "/materials/udl-guide.pdf",
      },
      {
        id: 2,
        type: "link",
        title: "CAST UDL Guidelines",
        url: "https://udlguidelines.cast.org/",
      },
    ],
    certificate: {
      id: "CERT-IE-2024-006",
      issueDate: "2024-11-20",
      downloadUrl: "/certificates/inclusive-education-cert.pdf",
    },
    badge: {
      name: "Inclusion Advocate",
      imageUrl: "/badges/inclusion-advocate.png",
      approvalStatus: "approved",
    },
  },
  {
    id: 7,
    title: "Digital Literacy Assessment",
    competency: "Technology",
    status: "locked",
    score: 38,
    totalMarks: 100,
    percentage: 38,
    xpEarned: 0,
    completedAt: "2024-11-18",
    duration: "40 min",
    attemptNumber: 3,
    maxAttempts: 3,
    canRetry: false,
    overallFeedback:
      "You have reached the maximum allowed attempts. Please review the suggested micro-PDs during the lock period to prepare for your next opportunity.",
    strengths: ["Basic familiarity with digital tools"],
    areasForImprovement: [
      "Needs comprehensive understanding of digital literacy frameworks",
      "Should focus on critical evaluation of online sources",
      "Digital citizenship concepts require more study",
    ],
    sectionScores: [
      {
        name: "MCQs",
        score: 15,
        totalMarks: 40,
        percentage: 37.5,
        remarks: "Fundamental gaps in digital literacy knowledge",
      },
      {
        name: "Short Answer",
        score: 10,
        totalMarks: 25,
        percentage: 40,
        remarks: "Responses showed surface-level understanding",
      },
      {
        name: "Audio Response",
        score: 6,
        totalMarks: 15,
        percentage: 40,
        remarks: "Key concepts were not addressed",
      },
      {
        name: "Video Demonstration",
        score: 7,
        totalMarks: 20,
        percentage: 35,
        remarks: "Demonstration did not meet requirements",
      },
    ],
    suggestedMicroPDs: [
      {
        id: 1,
        title: "Digital Literacy Foundations",
        description: "Build a strong foundation in digital literacy concepts",
      },
      {
        id: 2,
        title: "Evaluating Online Information",
        description: "Learn to critically assess digital sources",
      },
      {
        id: 3,
        title: "Digital Citizenship Essentials",
        description: "Understand responsible digital behavior",
      },
    ],
    lockInfo: {
      isLocked: true,
      lockedUntil: "2024-11-28T10:00:00Z",
      daysRemaining: 3,
      hoursRemaining: 5,
    },
  },
];

const DetailedReportPage = () => {
  const params = useParams();
  const router = useRouter();
  const resultId = Number(params.id);
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<ReferenceMaterial | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const result = mockDetailedResults.find((r) => r.id === resultId);

  if (!result) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 font-[montserrat]">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="size-8 text-red-600" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Result Not Found</h2>
            <p className="mb-4 text-muted-foreground">
              The assessment result you&apos;re looking for doesn&apos;t exist
              or may have been removed.
            </p>
            <Button
              onClick={() => router.replace("/teacher/dashboard/results")}
            >
              Back to Results
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: "passed" | "failed" | "locked") => {
    switch (status) {
      case "passed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="size-3 mr-1" />
            Passed
          </Badge>
        );
      case "locked":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            <Lock className="size-3 mr-1" />
            Locked
          </Badge>
        );
      default:
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="size-3 mr-1" />
            Failed
          </Badge>
        );
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const getSectionIcon = (sectionName: string) => {
    switch (sectionName) {
      case "MCQs":
        return <FileText className="size-4" />;
      case "Short Answer":
        return <MessageSquare className="size-4" />;
      case "Audio Response":
        return <Headphones className="size-4" />;
      case "Video Demonstration":
        return <Video className="size-4" />;
      default:
        return <BookOpen className="size-4" />;
    }
  };

  const getMaterialIcon = (type: "pdf" | "image" | "link") => {
    switch (type) {
      case "pdf":
        return <FileText className="size-4" />;
      case "image":
        return <FileImage className="size-4" />;
      case "link":
        return <Link2 className="size-4" />;
    }
  };

  const handleRetry = () => {
    router.push(`/teacher/dashboard/assessments/${resultId}/mcqs`);
  };

  const handleDownloadCertificate = async () => {
    if (!result.certificate) return;
    setIsDownloading(true);
    // Simulate download
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsDownloading(false);
    // In real app, would trigger actual download
    window.open(result.certificate.downloadUrl, "_blank");
  };

  const handleViewMaterial = (material: ReferenceMaterial) => {
    if (material.type === "link") {
      window.open(material.url, "_blank");
    } else {
      setSelectedMaterial(material);
      setIsReferenceModalOpen(true);
    }
  };

  const isLocked = result.status === "locked" || result.lockInfo?.isLocked;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col p-3 sm:p-6 font-[montserrat] overflow-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 mt-1"
            onClick={() => router.replace("/teacher/dashboard/results")}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {getStatusBadge(result.status)}
              <Badge variant="outline" className="text-xs">
                {result.competency}
              </Badge>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold truncate">
              {result.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {new Date(result.completedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {result.duration}
              </span>
              <span className="flex items-center gap-1">
                <RefreshCcw className="size-3" />
                Attempt {result.attemptNumber} of {result.maxAttempts}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reference Material Banner */}
      {result.referenceMaterials && result.referenceMaterials.length > 0 && (
        <Card
          className={`mb-6 ${
            result.status === "passed"
              ? "border-green-700/50 bg-green-900/30"
              : "border-amber-700/50 bg-amber-900/30"
          }`}
        >
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    result.status === "passed" ? "bg-green-800/50" : "bg-amber-800/50"
                  }`}
                >
                  <BookOpen
                    className={`size-5 ${
                      result.status === "passed"
                        ? "text-green-300"
                        : "text-amber-300"
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      result.status === "passed"
                        ? "text-green-200"
                        : "text-amber-200"
                    }`}
                  >
                    {result.status === "passed"
                      ? "Congratulations for passing this assessment!"
                      : "Sorry to see that you have failed the assessment."}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {result.status === "passed"
                      ? "There are some reference materials for the PD Module you can refer to in order to increase your knowledge."
                      : "You can refer to the reference material for this PD Module to increase your knowledge before your next attempt."}
                  </p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={result.status === "passed" ? "default" : "outline"}
                    size="sm"
                  >
                    <BookOpen className="size-4 mr-2" />
                    Learn More
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Reference Materials</DialogTitle>
                    <DialogDescription>
                      Review these materials to deepen your understanding
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 mt-4">
                    {result.referenceMaterials.map((material) => (
                      <Card
                        key={material.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleViewMaterial(material)}
                      >
                        <CardContent className="flex items-center gap-3 py-3">
                          <div className="p-2 rounded-lg bg-muted">
                            {getMaterialIcon(material.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {material.title}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {material.type === "link"
                                ? "External Link"
                                : material.type.toUpperCase()}
                            </p>
                          </div>
                          {material.type === "link" ? (
                            <ExternalLink className="size-4 text-muted-foreground" />
                          ) : (
                            <FileText className="size-4 text-muted-foreground" />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lock Banner for Locked Assessments */}
      {isLocked && result.lockInfo && (
        <Card className="mb-6 border-gray-300 bg-gray-50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-200">
                <Lock className="size-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  You have reached the maximum allowed attempts.
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  This PD assessment is temporarily locked for 10 days.
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm font-medium text-gray-700">
                  <Clock className="size-4" />
                  Available again in: {result.lockInfo.daysRemaining} days,{" "}
                  {result.lockInfo.hoursRemaining} hours
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Score Overview & Section Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="size-5" />
                Score Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {result.sectionScores.map((section, index) => (
                  <div
                    key={index}
                    className="text-center p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex justify-center mb-2">
                      {getSectionIcon(section.name)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {section.name}
                    </p>
                    <p
                      className={`text-lg font-bold ${getScoreColor(
                        section.percentage
                      )}`}
                    >
                      {section.score}/{section.totalMarks}
                    </p>
                  </div>
                ))}
              </div>

              {/* XP Score for Passed */}
              {result.status === "passed" && result.xpEarned > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="size-5 text-purple-600" />
                    <span className="font-medium text-purple-800">
                      XP Earned
                    </span>
                  </div>
                  <span className="text-xl font-bold text-purple-700">
                    +{result.xpEarned} XP
                  </span>
                </div>
              )}

              {/* Final Score */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div>
                  <p className="text-sm text-muted-foreground">Final Score</p>
                  <p
                    className={`text-3xl font-bold ${getScoreColor(
                      result.percentage
                    )}`}
                  >
                    {result.score}/{result.totalMarks} ({result.percentage}%)
                  </p>
                </div>
                <div
                  className={`text-right px-4 py-2 rounded-lg ${
                    result.status === "passed" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <p
                    className={`text-xl font-bold uppercase ${
                      result.status === "passed"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {result.status === "locked" ? "FAILED" : result.status}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section-wise Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                Section-wise Breakdown
              </CardTitle>
              <CardDescription>
                Detailed scores and feedback for each section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.sectionScores.map((section, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                        {getSectionIcon(section.name)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{section.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {section.remarks}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${getScoreColor(
                          section.percentage
                        )}`}
                      >
                        {section.score}/{section.totalMarks}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {section.percentage}%
                      </p>
                    </div>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full rounded-full transition-all ${getProgressColor(
                        section.percentage
                      )}`}
                      style={{ width: `${section.percentage}%` }}
                    />
                  </div>
                  {index < result.sectionScores.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Certificate Section - Passed Only */}
          {result.status === "passed" && result.certificate && (
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Award className="size-5" />
                  Certificate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Certificate of Completion
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Certificate ID: {result.certificate.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Issued:{" "}
                      {new Date(
                        result.certificate.issueDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Button
                    onClick={handleDownloadCertificate}
                    disabled={isDownloading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isDownloading ? (
                      <>
                        <RefreshCcw className="size-4 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="size-4 mr-2" />
                        Download Certificate
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Right Column - AI Feedback */}
        <div className="space-y-6">
          {/* AI Feedback Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="size-5" />
                AI Feedback Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.overallFeedback}
              </p>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card className="border-green-200 bg-green-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <TrendingUp className="size-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <Target className="size-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.areasForImprovement.map((area, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="size-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Suggested Micro-PDs - Failed Only */}
          {(result.status === "failed" || result.status === "locked") &&
            result.suggestedMicroPDs &&
            result.suggestedMicroPDs.length > 0 && (
              <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Lightbulb className="size-5" />
                    Suggested Micro-PD Modules
                  </CardTitle>
                  <CardDescription>
                    Review these to improve before your next attempt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.suggestedMicroPDs.map((microPD) => (
                      <li
                        key={microPD.id}
                        className="p-3 rounded-lg bg-white border"
                      >
                        <p className="font-medium text-sm">{microPD.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {microPD.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

          {/* Reattempt Info - Failed Only */}
          {result.status === "failed" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <RefreshCcw className="size-5" />
                  Reattempt Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Attempts Used</span>
                    <span className="font-medium">
                      {result.attemptNumber} of {result.maxAttempts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-medium">
                      {result.maxAttempts - result.attemptNumber}
                    </span>
                  </div>
                  {result.canRetry ? (
                    <Button className="w-full mt-2" onClick={handleRetry}>
                      <RefreshCcw className="size-4 mr-2" />
                      Start Reattempt
                    </Button>
                  ) : (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 mt-2">
                      <p className="text-xs text-red-700 text-center">
                        You have used all attempts for this PD Assessment.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-center">
        <Button
          variant="outline"
          onClick={() => router.replace("/teacher/dashboard/results")}
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Results
        </Button>
        {result.status === "passed" && (
          <Button
            variant="secondary"
            onClick={() => router.push("/teacher/dashboard/learning")}
          >
            <BookOpen className="size-4 mr-2" />
            Continue Learning
          </Button>
        )}
      </div>

      {/* Material Preview Modal */}
      <Dialog
        open={isReferenceModalOpen}
        onOpenChange={setIsReferenceModalOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selectedMaterial?.title}</DialogTitle>
            <DialogDescription>
              Preview only - this material cannot be downloaded
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 min-h-[400px] flex items-center justify-center bg-muted rounded-lg">
            {selectedMaterial?.type === "pdf" ? (
              <div className="text-center p-8">
                <FileText className="size-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  PDF Preview would be rendered here
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  (In production, use a PDF viewer component)
                </p>
              </div>
            ) : selectedMaterial?.type === "image" ? (
              <div className="relative w-full h-[400px]">
                <Image
                  src={selectedMaterial.url || "/placeholder-image.png"}
                  alt={selectedMaterial.title}
                  fill
                  className="object-contain"
                />
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailedReportPage;
