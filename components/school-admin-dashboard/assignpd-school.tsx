"use client";

import AssignDetails from "@/components/admin-components/assign-details";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconAccessible,
  IconBulb,
  IconChalkboard,
  IconChartBar,
  IconCheck,
  IconClipboardCheck,
  IconClock,
  IconDeviceLaptop,
  IconHeart,
  IconPresentationAnalytics,
  IconSparkles,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";
import React from "react";

// Mock PD Modules Data
interface PDModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  assignedTo?: number;
  icon?: string;
}

const pdModules: PDModule[] = [
  {
    id: "pd-1",
    title: "Classroom Management Strategies",
    description:
      "Learn effective techniques for maintaining a positive learning environment and managing student behavior.",
    duration: "45 mins",
    category: "Classroom Management",
    difficulty: "Intermediate",
    icon: "chalkboard",
  },
  {
    id: "pd-2",
    title: "Differentiated Instruction",
    description:
      "Strategies for tailoring instruction to meet individual student needs and learning styles.",
    duration: "60 mins",
    category: "Teaching Methods",
    difficulty: "Advanced",
    icon: "bulb",
  },
  {
    id: "pd-3",
    title: "Assessment for Learning",
    description:
      "Explore formative and summative assessment techniques to enhance student learning outcomes.",
    duration: "50 mins",
    category: "Assessment",
    difficulty: "Intermediate",
    icon: "clipboard",
  },
  {
    id: "pd-4",
    title: "Technology Integration in Education",
    description:
      "Discover how to effectively integrate digital tools and resources into your teaching practice.",
    duration: "55 mins",
    category: "Technology",
    difficulty: "Beginner",
    icon: "laptop",
  },
  {
    id: "pd-5",
    title: "Student Engagement Techniques",
    description:
      "Practical strategies to increase student participation and motivation in the classroom.",
    duration: "40 mins",
    category: "Student Engagement",
    difficulty: "Beginner",
    icon: "sparkles",
  },
  {
    id: "pd-6",
    title: "Inclusive Education Practices",
    description:
      "Learn to create an inclusive classroom that supports diverse learners and special needs students.",
    duration: "65 mins",
    category: "Inclusion",
    difficulty: "Advanced",
    icon: "accessible",
  },
  {
    id: "pd-7",
    title: "Social-Emotional Learning (SEL)",
    description:
      "Implement SEL frameworks to support students' emotional well-being and interpersonal skills.",
    duration: "50 mins",
    category: "SEL",
    difficulty: "Intermediate",
    icon: "heart",
  },
  {
    id: "pd-8",
    title: "Data-Driven Decision Making",
    description:
      "Use student data and analytics to inform instructional decisions and improve outcomes.",
    duration: "45 mins",
    category: "Data Analysis",
    difficulty: "Advanced",
    icon: "chart",
  },
  {
    id: "pd-9",
    title: "Project-Based Learning",
    description:
      "Design and implement engaging project-based learning experiences for your students.",
    duration: "70 mins",
    category: "Teaching Methods",
    difficulty: "Intermediate",
    icon: "presentation",
  },
  {
    id: "pd-10",
    title: "Culturally Responsive Teaching",
    description:
      "Develop cultural competence and create a classroom that respects and values diversity.",
    duration: "55 mins",
    category: "Diversity & Inclusion",
    difficulty: "Intermediate",
    icon: "world",
  },
];

interface AssignpdSchoolProps {
  pdCount?: number; // Number of PDs to show, default is all
}

const AssignpdSchool: React.FC<AssignpdSchoolProps> = ({ pdCount }) => {
  const [assignedModules, setAssignedModules] = React.useState<
    Record<string, number>
  >({});
  const [selectedPD, setSelectedPD] = React.useState<PDModule | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);

  const handleSelectPD = (pd: PDModule) => {
    setSelectedPD(pd);
    setIsAssignModalOpen(true);
  };

  const handleAssignmentSuccess = (teacherCount: number) => {
    if (selectedPD) {
      setAssignedModules((prev) => ({
        ...prev,
        [selectedPD.id]: teacherCount,
      }));
    }
  };

  const getModuleIcon = (iconName: string) => {
    const icons = {
      chalkboard: IconChalkboard,
      bulb: IconBulb,
      clipboard: IconClipboardCheck,
      laptop: IconDeviceLaptop,
      sparkles: IconSparkles,
      accessible: IconAccessible,
      heart: IconHeart,
      chart: IconChartBar,
      presentation: IconPresentationAnalytics,
      world: IconWorld,
    };

    const Icon = icons[iconName as keyof typeof icons] || IconChalkboard;
    return <Icon className="size-8" />;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      Beginner:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      Intermediate:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Advanced:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };

    return (
      <Badge
        className={cn(
          "rounded-md border-0",
          colors[difficulty as keyof typeof colors]
        )}
      >
        {difficulty}
      </Badge>
    );
  };

  // Slice the PD modules if pdCount is provided
  const visiblePDModules = pdCount ? pdModules.slice(0, pdCount) : pdModules;

  return (
    <>
      <div className="flex flex-col gap-6 font-[montserrat]">
        {/* Header */}
       

        {/* PD Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visiblePDModules.map((pd) => (
            <div
              key={pd.id}
              className="flex flex-col p-6 border rounded-lg hover:shadow-md transition-shadow bg-card"
            >
              {/* Icon */}
              <div className="mb-4 text-primary">
                {getModuleIcon(pd.icon || "chalkboard")}
              </div>

              {/* Title and Difficulty Badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-lg line-clamp-2 flex-1">
                  {pd.title}
                </h3>
                {getDifficultyBadge(pd.difficulty)}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {pd.description}
              </p>

              {/* Duration and Category */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <IconClock className="size-4" />
                  <span>{pd.duration}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {pd.category}
                </Badge>
              </div>

              {/* Assignment Status Badge */}
              {assignedModules[pd.id] && (
                <Badge
                  variant="outline"
                  className="gap-2 rounded-md px-3 py-1 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 mb-4"
                >
                  <IconCheck className="size-3 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-400">
                    Assigned to {assignedModules[pd.id]} teacher
                    {assignedModules[pd.id] > 1 ? "s" : ""}
                  </span>
                </Badge>
              )}

              {/* Assign Button */}
              <Button
                onClick={() => handleSelectPD(pd)}
                className="w-full mt-auto"
                variant={assignedModules[pd.id] ? "outline" : "default"}
              >
                <IconUsers className="size-4" />
                {assignedModules[pd.id]
                  ? "Reassign to Teachers"
                  : "Assign to Teachers"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Modal */}
      {selectedPD && (
        <AssignDetails
          isOpen={isAssignModalOpen}
          onOpenChange={setIsAssignModalOpen}
          pdTitle={selectedPD.title}
          pdId={selectedPD.id}
        />
      )}
    </>
  );
};

export default AssignpdSchool;
