"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  FileText,
  Link as LinkIcon,
  Settings,
  Video,
} from "lucide-react";
import { Link } from "next-view-transitions";

// Mock data for suggested PDs with materials
const suggestedPDs = [
  {
    id: 1,
    title: "Advanced Classroom Management",
    description: "Take your classroom management skills to the next level",
    materials: [
      { type: "pdf", name: "Classroom Management Guide.pdf" },
      { type: "video", name: "Expert Tips on Managing Classrooms" },
      { type: "document", name: "Best Practices Documentation" },
      { type: "link", name: "Online Resources & Tools" },
    ],
  },
  {
    id: 2,
    title: "Educational Psychology Fundamentals",
    description: "Understanding how students learn and develop",
    materials: [
      { type: "pdf", name: "Psychology in Education.pdf" },
      { type: "video", name: "Learning Theories Explained" },
      { type: "document", name: "Student Development Guide" },
    ],
  },
  {
    id: 3,
    title: "Innovative Teaching Strategies",
    description: "Explore cutting-edge methods to engage students",
    materials: [
      { type: "video", name: "Modern Teaching Techniques" },
      { type: "pdf", name: "Innovation in Education.pdf" },
      { type: "link", name: "EdTech Resources" },
      { type: "document", name: "Strategy Implementation Guide" },
    ],
  },
  {
    id: 4,
    title: "Differentiated Instruction",
    description: "Tailoring teaching to meet individual student needs",
    materials: [
      { type: "pdf", name: "Differentiation Handbook.pdf" },
      { type: "video", name: "Personalized Learning Approaches" },
      { type: "document", name: "Assessment Strategies" },
    ],
  },
  {
    id: 5,
    title: "Curriculum Design Essentials",
    description: "Learn to create engaging and effective curricula",
    materials: [
      { type: "document", name: "Curriculum Planning Template" },
      { type: "pdf", name: "Design Principles.pdf" },
      { type: "video", name: "Building Effective Curricula" },
      { type: "link", name: "Curriculum Resources Hub" },
    ],
  },
  {
    id: 6,
    title: "Professional Learning Communities",
    description: "Collaborate effectively with fellow educators",
    materials: [
      { type: "video", name: "Collaboration Best Practices" },
      { type: "pdf", name: "PLC Framework Guide.pdf" },
      { type: "document", name: "Meeting Templates" },
    ],
  },
];

const getMaterialIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="size-3.5 text-muted-foreground" />;
    case "video":
      return <Video className="size-3.5 text-muted-foreground" />;
    case "document":
      return <FileText className="size-3.5 text-muted-foreground" />;
    case "link":
      return <LinkIcon className="size-3.5 text-muted-foreground" />;
    default:
      return <FileText className="size-3.5 text-muted-foreground" />;
  }
};

const SuggestedPD = () => {
  return (
    <div className="w-full font-[montserrat]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {suggestedPDs.map((pd) => {
          return (
            <Card
              key={pd.id}
              className="hover:shadow-md transition-shadow cursor-pointer group flex flex-col overflow-hidden"
            >
              <CardHeader className="py-3 px-4 space-y-0 flex-shrink-0">
                <div className="flex items-start justify-between mb-1.5">
                  <BookOpen className="size-6 text-primary" />
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Settings className="size-3.5" />
                  </button>
                </div>
                <CardTitle className="text-sm leading-tight line-clamp-1 mb-1">
                  {pd.title}
                </CardTitle>
                <CardDescription className="text-xs leading-tight line-clamp-2 mb-2">
                  {pd.description}
                </CardDescription>

                {/* Materials List */}
                <div className="space-y-1 pt-2 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Materials:
                  </p>
                  {pd.materials.slice(0, 3).map((material, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      {getMaterialIcon(material.type)}
                      <span className="truncate">{material.name}</span>
                    </div>
                  ))}
                  {pd.materials.length > 3 && (
                    <p className="text-xs text-muted-foreground/70 pl-5">
                      +{pd.materials.length - 3} more
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-3 px-4 mt-auto">
                <Button
                  size="sm"
                  className="w-full gap-2 h-8"
                  variant={"default"}
                  asChild
                >
                  <Link href={`/teacher/dashboard/pd/${pd.id}`}>
                    Start Learning
                  </Link>
                    
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedPD;
