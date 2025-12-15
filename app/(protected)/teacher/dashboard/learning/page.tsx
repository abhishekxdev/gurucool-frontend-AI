"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useTeacher } from "@/hooks/useRoleGuard";
import logo from "@/public/gurucool/logo.png";
import { AlertTriangle, BookOpen, ClipboardList, Clock, Lightbulb, Lock, Send } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
};

// Helper to format time
const formatTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// Helper to get user initials
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Helper to render text with bold markdown
const renderMessageContent = (content: string) => {
  const parts = content.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold">
          {boldText}
        </strong>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const TeacherLearningPage = () => {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useTeacher();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [competencyDataMissing, setCompetencyDataMissing] = useState(false);

  const isPending = user?.status === "pending";

  useEffect(() => {
    setIsClient(true);
    // Simulate loading competency data
    // In real implementation, this would fetch from API
    const loadCompetencyData = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Check if competency data exists (mock check)
        const hasCompetencyData = true; // In real app, check actual data
        if (!hasCompetencyData) {
          setCompetencyDataMissing(true);
        }
      } catch (error) {
        setLoadingError("Unable to load tutor. Please retry.");
      }
    };
    loadCompetencyData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const mockResponses = [
    `That's a great question! Let me break it down for you:\n\n**Learning Styles** are the different ways students prefer to receive and process information:\n\n1. **Visual Learners** (65% of students)\n   - Learn through seeing\n   - Strategies: diagrams, charts, videos, color coding\n\n2. **Auditory Learners** (30% of students)\n   - Learn through listening\n   - Strategies: discussions, lectures, podcasts, verbal instructions\n\n3. **Kinesthetic Learners** (5% of students)\n   - Learn through doing\n   - Strategies: hands-on activities, movement, role-play\n\n**Pro Tip**: Most students use a combination of styles, so incorporate all three in your lessons!\n\nWould you like examples of how to implement this in your classroom?`,
    `Here's a practical example for a History lesson:\n\n**Topic**: World War II\n\n**Differentiated Approach:**\n\n📊 **Visual Track**\n- Timeline creation with key events\n- Map analysis of territories\n- Documentary clips\n\n🗣️ **Auditory Track**\n- Podcast on personal stories\n- Group discussions\n- Oral presentations\n\n🎭 **Kinesthetic Track**\n- Role-play historical figures\n- Create a museum exhibit\n- Interactive timeline walk\n\n**Assessment Options:**\n- Essay (traditional)\n- Video presentation\n- Podcast episode\n- Interactive poster\n\nAll paths lead to the same learning objectives but honor different strengths!\n\nDoes this make sense?`,
    `Excellent question! Let me address that:\n\n**Common Concern**: "How do I manage all these different activities?"\n\n**Solution - The Station Rotation Model:**\n\n🔄 Divide class into 3-4 groups that rotate through stations:\n\n**Station 1**: Teacher-led instruction (target struggling students)\n**Station 2**: Collaborative work (peer learning)\n**Station 3**: Independent practice (digital tools)\n**Station 4**: Hands-on activity (project work)\n\n⏱️ Each station: 15-20 minutes\n📱 Use timer & rotation signals\n📋 Clear instructions at each station\n\n**Benefits:**\n✓ Small group instruction time\n✓ Student autonomy\n✓ Multiple modalities in one lesson\n✓ Manageable for teacher\n\nWant to see a sample lesson plan using this model?`,
  ];

  const handleSend = () => {
    if (!inputValue.trim() || isPending) return;

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
        messages.length / 2,
        mockResponses.length - 1
      );
      const assistantMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: mockResponses[Math.floor(responseIndex)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isPending) {
        handleSend();
      }
    }
  };

  const handleStartAssessment = () => {
    router.push("/teacher/dashboard/assessments/1/mcqs");
  };

  const quickActionCards = [
    {
      icon: <BookOpen className="size-5 text-primary" />,
      title: "Current Module",
      description: "Differentiated Instruction",
      subtitle: "Duration: 45 minutes",
    },
  ];

  const showWelcome = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col font-[montserrat] ">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border rounded-xl shadow-sm mb-4">
        <div className="flex items-center gap-4">
          <div className="size-8 sm:size-9 shrink-0 rounded-full">
            <Image
              src={logo}
              alt="GuruCool.AI"
              className="size-full object-contain"
            />
          </div>
          <h1 className="font-medium">thegurucoolAI</h1>
        </div>

        <Button
          className="gap-2"
          onClick={handleStartAssessment}
          disabled={isPending}
        >
          <ClipboardList className="size-4" />
          <span className="hidden sm:inline">Start Assessment</span>
          <span className="sm:hidden">Start</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:py-12">
            {loadingError ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 max-w-lg mx-auto">
                <div className="size-20 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                  <AlertTriangle className="size-10 text-red-600" />
                </div>
                <div className="text-center space-y-3">
                  <h1 className="text-2xl font-bold">Unable to Load Tutor</h1>
                  <p className="text-muted-foreground">{loadingError}</p>
                  <Button onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              </div>
            ) : competencyDataMissing ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 max-w-lg mx-auto">
                <div className="size-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <Clock className="size-10 text-amber-600" />
                </div>
                <div className="text-center space-y-3">
                  <h1 className="text-2xl font-bold">Preparing Your Learning Path</h1>
                  <p className="text-muted-foreground">
                    We're preparing your learning path. Try again shortly.
                  </p>
                  <Button onClick={() => window.location.reload()}>
                    Refresh
                  </Button>
                </div>
              </div>
            ) : isPending ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 max-w-lg mx-auto">
                <div className="size-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <Lock className="size-10 text-amber-600" />
                </div>

                <div className="text-center space-y-3">
                  <h1 className="text-2xl font-bold">
                    Account Pending Approval
                  </h1>
                  <p className="text-muted-foreground">
                    Your account has been submitted to your school administrator
                    for review. You'll receive a notification in your dashboard
                    once approved.
                  </p>
                </div>

                <div className="w-full space-y-3 pt-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-3">
                        What happens next?
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">✓</span>
                          <span>
                            Your school admin is reviewing your credentials
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">✓</span>
                          <span>
                            You'll see a notification here once approved
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">✓</span>
                          <span>
                            Full access to chat and assessments will be granted
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </div>
            ) : showWelcome ? (
              /* Personalized Learning Path Welcome Screen */
              <div className="max-w-3xl mx-auto space-y-6">
                {/* AI Tutor Introduction Message */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="shrink-0">
                        <div className="size-8 sm:size-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Image
                            src={logo}
                            alt="GuruCool.AI"
                            className="size-6 object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>GuruCool.AI</span>
                          <span>{formatTime(new Date())}</span>
                        </div>
                        <div className="text-sm space-y-3">
                          <p className="font-semibold">
                            I've created a personalized learning path for you. Let's begin with your foundational skills.
                          </p>
                          <p>
                            Based on your profile and competency assessment, I've identified key areas where we can focus your professional development:
                          </p>
                          <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                            <p className="font-medium">Your Learning Path Includes:</p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              <li>Addressing competency gaps in AI in Teaching (40% score)</li>
                              <li>Building on your strengths in ToC Module (90% score)</li>
                              <li>Enhancing classroom management techniques</li>
                              <li>Developing differentiated learning strategies</li>
                            </ul>
                          </div>
                          <p>
                            This conversational learning experience adapts to your pace and teaching style. You can ask questions, request examples, or dive deeper into any topic at any time.
                          </p>
                          <p className="font-medium text-primary">
                            Ready to begin? Just ask me anything, or click on one of the quick start options below!
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {!isPending && (
                  <div className="flex justify-center mt-8">
                    {quickActionCards.map((card, index) => (
                      <Card
                        key={index}
                        className="cursor-pointer hover:bg-accent transition-colors w-full max-w-3xl"
                        onClick={() => {
                          setInputValue(
                            "Tell me more about the current module"
                          );
                        }}
                      >
                        <CardContent className=" space-y-3">
                          {/* Icon */}
                          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            {React.cloneElement(card.icon, {
                              className: "size-6 text-primary",
                            })}
                          </div>

                          {/* Title */}
                          <div>
                            <h3 className="font-semibold text-base mb-1">
                              {card.title}
                            </h3>
                            {card.subtitle && (
                              <p className="text-xs text-muted-foreground">
                                {card.subtitle}
                              </p>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {card.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Chat Messages */
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-50 text-blue-900"
                        : "bg-gray-50 text-gray-900"
                    }`}
                  >
                    <div className="shrink-0">
                      {message.role === "user" ? (
                        <div className="size-8 sm:size-9 rounded-full bg-blue-100 flex items-center justify-center">
                          {getInitials("User Name")}
                        </div>
                      ) : (
                        <Lock className="size-8 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>
                          {message.role === "user" ? "You" : "GuruCool.AI"}
                        </span>
                        <span>{formatTime(message.timestamp)}</span>
                      </div>
                      <div className="text-sm">
                        {renderMessageContent(message.content)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 p-4 rounded-lg bg-gray-50 text-gray-900 animate-pulse">
                    <div className="shrink-0">
                      <Lock className="size-8 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>GuruCool.AI</span>
                        <span>{formatTime(new Date())}</span>
                      </div>
                      <div className="text-sm">
                        <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded-full w-1/2" />
                        <div className="h-4 bg-gray-200 rounded-full w-5/6" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          <div
            className={`relative border rounded-2xl bg-background shadow-sm ${
              isPending ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <Textarea
              placeholder={
                isPending
                  ? "Chat is disabled while account is pending..."
                  : "Ask me anything..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="min-h-[80px] max-h-60 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm pr-14 py-4 px-4"
              rows={1}
              disabled={isPending}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping || isPending}
              size="icon"
              className="absolute bottom-3 right-3 size-9 shrink-0 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50"
              tabIndex={0}
            >
              <Send className="size-4 text-primary-foreground" />
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            Relatus may display inaccurate info, so please double check the
            response.{" "}
            <span className="underline cursor-pointer">
              Your Privacy & Relatus.AI
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLearningPage;
