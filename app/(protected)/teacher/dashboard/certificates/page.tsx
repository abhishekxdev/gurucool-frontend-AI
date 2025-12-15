"use client";

import {
  Award,
  Calendar,
  Download,
  FileText,
  Search,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Certificate {
  id: string;
  pdTitle: string;
  pdId: string;
  issueDate: string;
  certificateId: string;
  downloadUrl: string;
  score?: number;
  competency?: string;
}

interface BadgeWithStatus {
  id: string;
  badgeName: string;
  badgeDescription: string;
  pdTitle: string;
  pdId: string;
  competency: string;
  earnedDate: string;
  status: "approved by AI";
  reviewedAt?: string;
  adminComment?: string;
  imageUrl?: string;
}

// Mock certificates (earned from PD assessments)
const mockCertificates: Certificate[] = [
  {
    id: "cert-earned-001",
    pdTitle: "Inclusive Classrooms: Strategies & Practices",
    pdId: "pd-101",
    issueDate: "2024-10-15",
    certificateId: "CERT-2024-101-001",
    downloadUrl: "https://example.com/certificates/cert-001.pdf",
    score: 88,
    competency: "Inclusive Education",
  },
  {
    id: "cert-earned-002",
    pdTitle: "Technology Integration in Teaching",
    pdId: "pd-102",
    issueDate: "2024-09-20",
    certificateId: "CERT-2024-102-001",
    downloadUrl: "https://example.com/certificates/cert-002.pdf",
    score: 91,
    competency: "Technology Integration",
  },
  {
    id: "cert-earned-003",
    pdTitle: "Assessment & Feedback Strategies",
    pdId: "pd-103",
    issueDate: "2024-08-10",
    certificateId: "CERT-2024-103-001",
    downloadUrl: "https://example.com/certificates/cert-003.pdf",
    score: 85,
    competency: "Assessment",
  },
  {
    id: "cert-earned-004",
    pdTitle: "Classroom Management Strategies",
    pdId: "pd-104",
    issueDate: "2024-11-05",
    certificateId: "CERT-2024-104-001",
    downloadUrl: "https://example.com/certificates/cert-004.pdf",
    score: 92,
    competency: "Classroom Management",
  },
  {
    id: "cert-earned-005",
    pdTitle: "Differentiated Instruction",
    pdId: "pd-105",
    issueDate: "2024-07-22",
    certificateId: "CERT-2024-105-001",
    downloadUrl: "https://example.com/certificates/cert-005.pdf",
    score: 89,
    competency: "Teaching Methods",
  },
  {
    id: "cert-earned-006",
    pdTitle: "Student Engagement Techniques",
    pdId: "pd-106",
    issueDate: "2024-06-18",
    certificateId: "CERT-2024-106-001",
    downloadUrl: "https://example.com/certificates/cert-006.pdf",
    score: 94,
    competency: "Student Engagement",
  },
  {
    id: "cert-earned-007",
    pdTitle: "Social-Emotional Learning (SEL)",
    pdId: "pd-107",
    issueDate: "2024-05-30",
    certificateId: "CERT-2024-107-001",
    downloadUrl: "https://example.com/certificates/cert-007.pdf",
    score: 87,
    competency: "SEL",
  },
  {
    id: "cert-earned-008",
    pdTitle: "Data-Driven Decision Making",
    pdId: "pd-108",
    issueDate: "2024-04-12",
    certificateId: "CERT-2024-108-001",
    downloadUrl: "https://example.com/certificates/cert-008.pdf",
    score: 90,
    competency: "Data Analysis",
  },
  {
    id: "cert-earned-009",
    pdTitle: "Project-Based Learning",
    pdId: "pd-109",
    issueDate: "2024-03-25",
    certificateId: "CERT-2024-109-001",
    downloadUrl: "https://example.com/certificates/cert-009.pdf",
    score: 86,
    competency: "Teaching Methods",
  },
  {
    id: "cert-earned-010",
    pdTitle: "Culturally Responsive Teaching",
    pdId: "pd-110",
    issueDate: "2024-02-14",
    certificateId: "CERT-2024-110-001",
    downloadUrl: "https://example.com/certificates/cert-010.pdf",
    score: 93,
    competency: "Diversity & Inclusion",
  },
  {
    id: "cert-earned-011",
    pdTitle: "Digital Literacy for Educators",
    pdId: "pd-111",
    issueDate: "2024-01-20",
    certificateId: "CERT-2024-111-001",
    downloadUrl: "https://example.com/certificates/cert-011.pdf",
    score: 88,
    competency: "Digital Skills",
  },
  {
    id: "cert-earned-012",
    pdTitle: "Collaborative Learning Strategies",
    pdId: "pd-112",
    issueDate: "2023-12-10",
    certificateId: "CERT-2023-112-001",
    downloadUrl: "https://example.com/certificates/cert-012.pdf",
    score: 91,
    competency: "Collaboration",
  },
];

// Mock badges with approval status
const mockBadges: BadgeWithStatus[] = [
  {
    id: "badge-001",
    badgeName: "Classroom Management Expert",
    badgeDescription: "Mastered classroom management fundamentals",
    pdTitle: "Classroom Management Strategies",
    pdId: "pd-104",
    competency: "Classroom Management",
    earnedDate: "2024-11-25",
    status: "approved by AI",
    reviewedAt: "2024-11-26",
    imageUrl: "/badges/classroom-management.png",
  },
  {
    id: "badge-002",
    badgeName: "Tech-Savvy Educator",
    badgeDescription: "Demonstrated technology integration skills",
    pdTitle: "Technology Integration in Teaching",
    pdId: "pd-102",
    competency: "Technology Integration",
    earnedDate: "2024-11-22",
    status: "approved by AI",
    reviewedAt: "2024-11-23",
    imageUrl: "/badges/tech-educator.png",
  },
  {
    id: "badge-003",
    badgeName: "Inclusion Advocate",
    badgeDescription: "Excellence in inclusive education practices",
    pdTitle: "Inclusive Classrooms: Strategies & Practices",
    pdId: "pd-101",
    competency: "Inclusive Education",
    earnedDate: "2024-11-20",
    status: "approved by AI",
    reviewedAt: "2024-11-21",
    imageUrl: "/badges/inclusion-advocate.png",
  },
  {
    id: "badge-004",
    badgeName: "Assessment Master",
    badgeDescription: "Expert in assessment design and feedback",
    pdTitle: "Assessment & Feedback Strategies",
    pdId: "pd-103",
    competency: "Assessment",
    earnedDate: "2024-11-18",
    status: "approved by AI",
    reviewedAt: "2024-11-19",
    imageUrl: "/badges/assessment-master.png",
  },
  {
    id: "badge-005",
    badgeName: "Engagement Champion",
    badgeDescription: "Outstanding student engagement strategies",
    pdTitle: "Student Engagement Techniques",
    pdId: "pd-106",
    competency: "Student Engagement",
    earnedDate: "2024-10-15",
    status: "approved by AI",
    reviewedAt: "2024-10-16",
    imageUrl: "/badges/engagement-champion.png",
  },
  {
    id: "badge-006",
    badgeName: "SEL Specialist",
    badgeDescription: "Proficient in social-emotional learning implementation",
    pdTitle: "Social-Emotional Learning (SEL)",
    pdId: "pd-107",
    competency: "SEL",
    earnedDate: "2024-09-28",
    status: "approved by AI",
    reviewedAt: "2024-09-29",
    imageUrl: "/badges/sel-specialist.png",
  },
  {
    id: "badge-007",
    badgeName: "Data Analyst Educator",
    badgeDescription: "Skilled in using data to drive instruction",
    pdTitle: "Data-Driven Decision Making",
    pdId: "pd-108",
    competency: "Data Analysis",
    earnedDate: "2024-08-20",
    status: "approved by AI",
    reviewedAt: "2024-08-21",
    imageUrl: "/badges/data-analyst.png",
  },
  {
    id: "badge-008",
    badgeName: "Project-Based Learning Pro",
    badgeDescription: "Expert in designing project-based learning experiences",
    pdTitle: "Project-Based Learning",
    pdId: "pd-109",
    competency: "Teaching Methods",
    earnedDate: "2024-07-12",
    status: "approved by AI",
    reviewedAt: "2024-07-13",
    imageUrl: "/badges/pbl-pro.png",
  },
  {
    id: "badge-009",
    badgeName: "Cultural Competence Leader",
    badgeDescription: "Demonstrated cultural responsiveness in teaching",
    pdTitle: "Culturally Responsive Teaching",
    pdId: "pd-110",
    competency: "Diversity & Inclusion",
    earnedDate: "2024-06-05",
    status: "approved by AI",
    reviewedAt: "2024-06-06",
    imageUrl: "/badges/cultural-leader.png",
  },
  {
    id: "badge-010",
    badgeName: "Digital Innovator",
    badgeDescription: "Advanced digital literacy and technology skills",
    pdTitle: "Digital Literacy for Educators",
    pdId: "pd-111",
    competency: "Digital Skills",
    earnedDate: "2024-05-18",
    status: "approved by AI",
    reviewedAt: "2024-05-19",
    imageUrl: "/badges/digital-innovator.png",
  },
  {
    id: "badge-011",
    badgeName: "Differentiation Expert",
    badgeDescription: "Mastered differentiated instruction strategies",
    pdTitle: "Differentiated Instruction",
    pdId: "pd-105",
    competency: "Teaching Methods",
    earnedDate: "2024-04-22",
    status: "approved by AI",
    reviewedAt: "2024-04-23",
    imageUrl: "/badges/differentiation-expert.png",
  },
  {
    id: "badge-012",
    badgeName: "Collaboration Catalyst",
    badgeDescription: "Excellence in fostering collaborative learning",
    pdTitle: "Collaborative Learning Strategies",
    pdId: "pd-112",
    competency: "Collaboration",
    earnedDate: "2024-03-10",
    status: "approved by AI",
    reviewedAt: "2024-03-11",
    imageUrl: "/badges/collaboration-catalyst.png",
  },
];

const CertificatesPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "certificates" | "badges">(
    "all"
  );
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<BadgeWithStatus | null>(
    null
  );
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [isBadgeDialogOpen, setIsBadgeDialogOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    let filtered: {
      certificates: Certificate[];
      badges: BadgeWithStatus[];
    } = {
      certificates: mockCertificates,
      badges: mockBadges,
    };

    // Apply search filter
    if (term) {
      filtered.certificates = filtered.certificates.filter(
        (cert) =>
          cert.pdTitle.toLowerCase().includes(term) ||
          cert.competency?.toLowerCase().includes(term) ||
          cert.certificateId.toLowerCase().includes(term)
      );
      filtered.badges = filtered.badges.filter(
        (badge) =>
          badge.badgeName.toLowerCase().includes(term) ||
          badge.pdTitle.toLowerCase().includes(term) ||
          badge.competency.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (filter === "certificates") {
      filtered.badges = [];
    } else if (filter === "badges") {
      filtered.certificates = [];
    }

    return filtered;
  }, [searchTerm, filter]);

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsCertificateDialogOpen(true);
  };

  const handleViewBadge = (badge: BadgeWithStatus) => {
    setSelectedBadge(badge);
    setIsBadgeDialogOpen(true);
  };

  const handleDownloadCertificate = async (certificate: Certificate) => {
    setDownloadingId(certificate.id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const shouldFail = Math.random() < 0.1;
      if (shouldFail)
        throw new Error(
          "Unable to download certificate. Please try again later."
        );
      window.open(certificate.downloadUrl, "_blank");
      toast.success("Certificate download started", {
        description: `${certificate.pdTitle} certificate is being downloaded.`,
      });
      setDownloadingId(null);
    } catch (error) {
      setDownloadingId(null);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to download certificate";
      toast.error("Download failed", { description: errorMessage });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-6 font-[montserrat]">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          View and download your earned credentials
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, competency, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="certificates">Certificates Only</SelectItem>
            <SelectItem value="badges">Badges Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="certificates" className="w-full">
        <TabsList>
          <TabsTrigger value="certificates" className="gap-2">
            <FileText className="size-4" />
            Certificates ({filteredItems.certificates.length})
          </TabsTrigger>
          <TabsTrigger value="badges" className="gap-2">
            <Trophy className="size-4" />
            Badges ({filteredItems.badges.length})
          </TabsTrigger>
        </TabsList>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="mt-6">
          {filteredItems.certificates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-card">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No certificates found
              </h3>
              <p className="text-muted-foreground text-center text-sm">
                {searchTerm
                  ? "Try adjusting your search or filters"
                  : "Complete PD assessments to earn certificates"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.certificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="flex flex-col p-6 border rounded-lg hover:shadow-md transition-shadow bg-card cursor-pointer"
                  onClick={() => handleViewCertificate(certificate)}
                >
                  {/* Icon */}
                  <div className="mb-4 text-primary">
                    <FileText className="size-8" />
                  </div>

                  {/* Title and Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-lg line-clamp-2 flex-1">
                      {certificate.pdTitle}
                    </h3>
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
                      Earned
                    </Badge>
                  </div>

                  {/* Competency */}
                  <p className="text-sm text-muted-foreground mb-4">
                    {certificate.competency}
                  </p>

                  {/* Details */}
                  <div className="flex flex-col gap-2 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      <span>Issued: {formatDate(certificate.issueDate)}</span>
                    </div>
                    {certificate.score && (
                      <div className="flex items-center gap-2">
                        <Award className="size-4" />
                        <span>Score: {certificate.score}%</span>
                      </div>
                    )}
                  </div>

                  {/* Certificate ID Badge */}
                  <Badge variant="outline" className="text-xs mb-4 font-mono">
                    {certificate.certificateId}
                  </Badge>

                  {/* Download Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadCertificate(certificate);
                    }}
                    className="w-full mt-auto"
                    disabled={downloadingId === certificate.id}
                  >
                    <Download className="size-4" />
                    {downloadingId === certificate.id
                      ? "Downloading..."
                      : "Download Certificate"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="mt-6">
          {filteredItems.badges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-card">
              <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No badges found</h3>
              <p className="text-muted-foreground text-center text-sm">
                {searchTerm
                  ? "Try adjusting your search or filters"
                  : "Complete PD assessments to earn badges"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col p-6 border rounded-lg hover:shadow-md transition-shadow bg-card cursor-pointer"
                  onClick={() => handleViewBadge(badge)}
                >
                  {/* Icon */}
                  <div className="mb-4 text-primary">
                    <Trophy className="size-8" />
                  </div>

                  {/* Title and Status Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-lg line-clamp-2 flex-1">
                      {badge.badgeName}
                    </h3>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 rounded-md">
                      Approved
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {badge.badgeDescription}
                  </p>

                  {/* Competency and Date */}
                  <div className="flex flex-col gap-2 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      <span>Earned: {formatDate(badge.earnedDate)}</span>
                    </div>
                    <Badge variant="outline" className="text-xs w-fit">
                      {badge.competency}
                    </Badge>
                  </div>

                  {/* Approval Info */}
                  {badge.status === "approved by AI" && badge.reviewedAt && (
                    <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-3 py-2 text-xs mb-4">
                      <span className="text-green-700 dark:text-green-400">
                        Issued by AI on {formatDate(badge.reviewedAt)}
                      </span>
                    </div>
                  )}

                  {/* View PD Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/teacher/dashboard/assessments/${badge.pdId}`
                      );
                    }}
                    variant="outline"
                    className="w-full mt-auto"
                  >
                    View PD Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Certificate Detail Dialog */}
      <Dialog
        open={isCertificateDialogOpen}
        onOpenChange={setIsCertificateDialogOpen}
      >
        <DialogContent className="font-[montserrat] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Certificate Details</DialogTitle>
            <DialogDescription>
              {selectedCertificate?.pdTitle}
            </DialogDescription>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-amber-500/10">
                  <FileText className="h-16 w-16 text-amber-500" />
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">PD Title</p>
                    <p className="font-medium">{selectedCertificate.pdTitle}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Competency</p>
                    <p className="font-medium">
                      {selectedCertificate.competency}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Issue Date</p>
                    <p className="font-medium">
                      {formatDate(selectedCertificate.issueDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Certificate ID</p>
                    <p className="font-mono text-xs">
                      {selectedCertificate.certificateId}
                    </p>
                  </div>
                  {selectedCertificate.score && (
                    <div>
                      <p className="text-muted-foreground">Assessment Score</p>
                      <p className="font-medium">
                        {selectedCertificate.score}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCertificateDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedCertificate) {
                  handleDownloadCertificate(selectedCertificate);
                }
              }}
              disabled={downloadingId === selectedCertificate?.id}
            >
              <Download className="h-4 w-4 mr-2" />
              {downloadingId === selectedCertificate?.id
                ? "Downloading..."
                : "Download PDF"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Badge Detail Dialog */}
      <Dialog open={isBadgeDialogOpen} onOpenChange={setIsBadgeDialogOpen}>
        <DialogContent className="font-[montserrat] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Badge Details</DialogTitle>
            <DialogDescription>{selectedBadge?.badgeName}</DialogDescription>
          </DialogHeader>
          {selectedBadge && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-purple-500/10">
                  <Trophy className="h-16 w-16 text-purple-500" />
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Badge Title</p>
                  <p className="font-medium text-lg">
                    {selectedBadge.badgeName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Description</p>
                  <p className="font-medium">
                    {selectedBadge.badgeDescription}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">Competency</p>
                    <p className="font-medium">{selectedBadge.competency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Earned Date</p>
                    <p className="font-medium">
                      {formatDate(selectedBadge.earnedDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">PD Title</p>
                    <p className="font-medium">{selectedBadge.pdTitle}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className="mt-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                      Approved
                    </Badge>
                  </div>
                </div>

                {selectedBadge.status === "approved by AI" &&
                  selectedBadge.reviewedAt && (
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4">
                      <p className="text-emerald-400 font-medium">
                        Issued by AI
                      </p>
                      <p className="text-xs text-emerald-400/80 mt-1">
                        Issued on {formatDate(selectedBadge.reviewedAt)}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBadgeDialogOpen(false)}
            >
              Close
            </Button>
            {selectedBadge && (
              <Button
                onClick={() => {
                  router.push(
                    `/teacher/dashboard/assessments/${selectedBadge.pdId}`
                  );
                }}
              >
                View PD Assessment
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificatesPage;
