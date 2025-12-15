// filepath: /Users/apple/projects/gurucoolai/app/(protected)/teacher/dashboard/assessments/[id]/chat/page.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import logo from "@/public/logo.png";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  HelpCircle,
  Lightbulb,
  Menu,
  Send,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Mock assessment data
const mockAssessments = [
  {
    id: 1,
    title: "Classroom Management Fundamentals",
    competency: "Classroom Management",
    duration: "45 mins",
    status: "available",
    description:
      "Learn essential techniques for managing classroom behavior and creating a positive learning environment.",
    topics: [
      "Setting Clear Expectations",
      "Positive Reinforcement",
      "Handling Disruptions",
      "Creating Routines",
    ],
  },
  {
    id: 2,
    title: "Differentiated Instruction Strategies",
    competency: "Instructional Design",
    duration: "60 mins",
    status: "assigned",
    description:
      "Master the art of tailoring instruction to meet diverse student needs and learning styles.",
    topics: [
      "Learning Styles",
      "Tiered Assignments",
      "Flexible Grouping",
      "Student Choice",
    ],
  },
  {
    id: 3,
    title: "Assessment & Evaluation Techniques",
    competency: "Assessment",
    duration: "50 mins",
    status: "completed",
    description:
      "Develop skills in creating and implementing effective assessment strategies.",
    topics: [
      "Formative Assessment",
      "Summative Assessment",
      "Rubric Design",
      "Feedback Strategies",
    ],
  },
  {
    id: 4,
    title: "Technology Integration in Teaching",
    competency: "Technology",
    duration: "40 mins",
    status: "available",
    description:
      "Explore modern educational technology tools and their effective integration in lessons.",
    topics: [
      "Digital Tools Overview",
      "Interactive Presentations",
      "Online Collaboration",
      "Assessment Tools",
    ],
  },
  {
    id: 5,
    title: "Student Engagement Best Practices",
    competency: "Classroom Management",
    duration: "35 mins",
    status: "assigned",
    description:
      "Discover proven methods to boost student participation and maintain engagement.",
    topics: [
      "Active Learning",
      "Questioning Techniques",
      "Gamification",
      "Real-World Connections",
    ],
  },
  {
    id: 6,
    title: "Inclusive Education Fundamentals",
    competency: "Inclusive Practices",
    duration: "55 mins",
    status: "completed",
    description:
      "Learn strategies for creating an inclusive classroom environment for all learners.",
    topics: [
      "Universal Design for Learning",
      "Accommodations vs Modifications",
      "Culturally Responsive Teaching",
      "Supporting Diverse Learners",
    ],
  },
  {
    id: 7,
    title: "Effective Communication with Parents",
    competency: "Communication",
    duration: "30 mins",
    status: "available",
    description:
      "Build strong parent-teacher relationships through effective communication strategies.",
    topics: [
      "Parent-Teacher Conferences",
      "Written Communication",
      "Difficult Conversations",
      "Building Trust",
    ],
  },
  {
    id: 8,
    title: "Data-Driven Instruction",
    competency: "Assessment",
    duration: "45 mins",
    status: "restricted",
    description:
      "Use student data to inform instructional decisions and improve outcomes.",
    topics: [
      "Data Collection",
      "Data Analysis",
      "Action Planning",
      "Progress Monitoring",
    ],
  },
];

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
};

// Helper to format time consistently (avoids hydration mismatch)
const formatTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const AssessmentChat = () => {
  const params = useParams();
  const router = useRouter();
  const assessmentId = Number(params.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const assessment = mockAssessments.find((a) => a.id === assessmentId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Initialize on client only to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    if (assessment && messages.length === 0) {
      setMessages([
        {
          id: 1,
          role: "assistant",
          content: `Welcome to the **${
            assessment.title
          }** learning module! 🎓\n\nI'm your AI tutor, and I'll guide you through this assessment. This module covers the following topics:\n\n${assessment.topics
            .map((t, i) => `${i + 1}. ${t}`)
            .join("\n")}\n\nLet's start with the first topic: **${
            assessment.topics[0]
          }**.\n\nAre you ready to begin?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [assessment]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!assessment) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <HelpCircle className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">Assessment Not Found</h2>
            <p className="mb-4 text-muted-foreground">
              The assessment you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button
              onClick={() => router.push("/teacher/dashboard/assessments")}
            >
              Back to Assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mockResponses = [
    `Great question! Let me explain **${assessment.topics[currentTopic]}** in more detail.\n\nThis concept is fundamental to effective teaching because it helps create a structured learning environment. Here are the key points:\n\n• **Point 1**: Establish clear guidelines from day one\n• **Point 2**: Be consistent in your approach\n• **Point 3**: Model the behavior you expect\n\nWould you like me to provide some practical examples?`,
    `Excellent! Here's a practical example:\n\n**Scenario**: A student is repeatedly talking during instruction.\n\n**Effective Response**:\n1. Use non-verbal cues first (eye contact, proximity)\n2. If behavior continues, use a brief verbal redirect\n3. Follow up privately after class\n4. Document if pattern continues\n\nThis approach maintains classroom flow while addressing the behavior. Does this make sense?`,
    `You're making great progress! 🌟\n\nLet's move on to the next topic: **${
      assessment.topics[
        Math.min(currentTopic + 1, assessment.topics.length - 1)
      ]
    }**.\n\nThis builds on what we just learned. The key principle here is to create positive connections with students while maintaining professional boundaries.\n\nWhat questions do you have about this topic?`,
    `That's a thoughtful question! Here's what research tells us:\n\n📚 **Research Finding**: Studies show that positive reinforcement is 3x more effective than punishment in changing behavior.\n\n**Practical Application**:\n- Catch students being good\n- Use specific praise ("I like how you waited your turn")\n- Create a reward system that's meaningful to students\n\nReady to try a practice question?`,
    `Here's your practice question:\n\n**Question**: A student consistently arrives late to class. Which approach would be most effective?\n\nA) Publicly call out the student each time\nB) Have a private conversation to understand the cause\nC) Ignore the behavior completely\nD) Send the student to the principal immediately\n\nType your answer (A, B, C, or D) and I'll provide feedback!`,
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responseIndex = Math.min(
        Math.floor(messages.length / 2),
        mockResponses.length - 1
      );
      const assistantMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: mockResponses[responseIndex],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);

      // Update progress
      const newProgress = Math.min(progress + 15, 100);
      setProgress(newProgress);

      if (newProgress >= 25 * (currentTopic + 1)) {
        setCurrentTopic((prev) =>
          Math.min(prev + 1, assessment.topics.length - 1)
        );
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartMCQs = () => {
    router.push(`/teacher/dashboard/assessments/${assessmentId}/mcqs`);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col p-3 sm:p-6 font-[montserrat]">
      {/* Header */}
      <div className="mb-3 sm:mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => router.push("/teacher/dashboard/assessments")}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-semibold truncate">
              {assessment.title}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {assessment.competency}
              </Badge>
              <span className="hidden sm:flex items-center gap-1">
                <Clock className="size-3" />
                {assessment.duration}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile sidebar toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] p-0 font-[montserrat]"
            >
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Assessment Info</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-60px)]">
                <div className="flex flex-col gap-4 p-4">
                  {/* Progress Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Award className="size-4" />
                        Your Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completion</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Topics Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <BookOpen className="size-4" />
                        Topics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {assessment.topics.map((topic, index) => (
                          <div
                            key={topic}
                            className={`flex items-center gap-2 rounded-md p-2 text-sm ${
                              index === currentTopic
                                ? "bg-primary/10 text-primary"
                                : index < currentTopic
                                ? "text-muted-foreground line-through"
                                : "text-muted-foreground"
                            }`}
                          >
                            {index < currentTopic ? (
                              <CheckCircle2 className="size-4 text-green-500" />
                            ) : index === currentTopic ? (
                              <div className="size-4 rounded-full border-2 border-primary" />
                            ) : (
                              <div className="size-4 rounded-full border-2 border-muted-foreground/30" />
                            )}
                            {topic}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Lightbulb className="size-4" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() =>
                          setInputValue(
                            "Can you explain this in simpler terms?"
                          )
                        }
                      >
                        Simplify explanation
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() =>
                          setInputValue("Can you give me a practical example?")
                        }
                      >
                        Give me an example
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() =>
                          setInputValue("I'm ready for a practice question!")
                        }
                      >
                        Practice question
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() =>
                          setInputValue("Let's move to the next topic")
                        }
                      >
                        Next topic
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Start MCQs Button - Mobile */}
                  <Button className="w-full gap-2" onClick={handleStartMCQs}>
                    <ClipboardList className="size-4" />
                    Start MCQs
                  </Button>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <Button className="hidden sm:flex gap-2" onClick={handleStartMCQs}>
            <ClipboardList className="size-4" />
            Start MCQs
          </Button>
        </div>
      </div>

      <div className="grid flex-1 gap-4 sm:gap-6 overflow-hidden lg:grid-cols-[1fr_300px]">
        {/* Chat Area */}
        <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-background">
          {/* AI Tutor Header */}
          <div className="flex items-center gap-3 border-b px-3 sm:px-4 py-2.5 sm:py-3">
            <div className="size-8 sm:size-9 shrink-0 rounded-full bg-primary/10 p-1.5 sm:p-2">
              <Image
                src={logo}
                alt="AI Tutor"
                className="size-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-medium">AI Tutor</h2>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Always here to help you learn
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-3 sm:px-4 py-4 sm:py-6">
              <div className="space-y-4 sm:space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 sm:gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="size-6 sm:size-7 shrink-0 rounded-full bg-primary/10 p-1 sm:p-1.5">
                        <Image
                          src={logo}
                          alt="AI"
                          className="size-full object-contain"
                        />
                      </div>
                    )}
                    <div
                      className={`max-w-[90%] sm:max-w-[85%] ${
                        message.role === "user"
                          ? "rounded-2xl rounded-tr-sm bg-primary px-3 sm:px-4 py-2 sm:py-2.5 text-primary-foreground"
                          : ""
                      }`}
                    >
                      <p
                        className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                          message.role === "assistant" ? "text-foreground" : ""
                        }`}
                      >
                        {message.content}
                      </p>
                      <p
                        className={`mt-1 text-[10px] ${
                          message.role === "user"
                            ? "text-primary-foreground/60"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 sm:gap-3">
                    <div className="size-6 sm:size-7 shrink-0 rounded-full bg-primary/10 p-1 sm:p-1.5">
                      <Image
                        src={logo}
                        alt="AI"
                        className="size-full object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-1 py-2">
                      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50" />
                      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0.15s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0.3s]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          <div className="border-t bg-muted/30 p-2 sm:p-3">
            <div className="flex items-end gap-2">
              <Textarea
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="min-h-10 sm:min-h-11 max-h-32 resize-none border-0 bg-background shadow-sm text-sm"
                rows={1}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="size-9 sm:size-10 shrink-0 rounded-full"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar - Hidden on mobile, shown on lg screens */}
        <div className="hidden lg:flex flex-col gap-4 overflow-auto">
          {/* Progress Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Award className="size-4" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Topics Card */}
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="size-4" />
                Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assessment.topics.map((topic, index) => (
                  <div
                    key={topic}
                    className={`flex items-center gap-2 rounded-md p-2 text-sm ${
                      index === currentTopic
                        ? "bg-primary/10 text-primary"
                        : index < currentTopic
                        ? "text-muted-foreground line-through"
                        : "text-muted-foreground"
                    }`}
                  >
                    {index < currentTopic ? (
                      <CheckCircle2 className="size-4 text-green-500" />
                    ) : index === currentTopic ? (
                      <div className="size-4 rounded-full border-2 border-primary" />
                    ) : (
                      <div className="size-4 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    {topic}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="size-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setInputValue("Can you explain this in simpler terms?");
                }}
              >
                Simplify explanation
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setInputValue("Can you give me a practical example?");
                }}
              >
                Give me an example
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setInputValue("I'm ready for a practice question!");
                }}
              >
                Practice question
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setInputValue("Let's move to the next topic");
                }}
              >
                Next topic
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssessmentChat;
