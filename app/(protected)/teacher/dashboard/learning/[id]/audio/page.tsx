"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  CheckCircle2,
  FileAudio,
  Pause,
  Play,
  Trash2,
  Upload,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { z } from "zod";

// Zod schema for audio file validation
const audioFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File size must be less than 10MB",
    })
    .refine(
      (file) =>
        [
          "audio/mpeg",
          "audio/mp3",
          "audio/wav",
          "audio/ogg",
          "audio/webm",
          "audio/m4a",
          "audio/x-m4a",
        ].includes(file.type),
      {
        message: "File must be an audio file (MP3, WAV, OGG, WebM, M4A)",
      }
    ),
});

// Mock assessment data with scenario questions
const mockAssessments = [
  {
    id: 1,
    title: "Classroom Management Fundamentals",
    competency: "Classroom Management",
    scenario:
      "You are teaching a Grade 5 class when you notice that two students in the back row are having a heated argument about a pencil. The argument is getting louder and disrupting other students. One student is visibly upset and the other is getting defensive. How would you handle this situation to restore calm and address the conflict effectively?",
  },
  {
    id: 2,
    title: "Differentiated Instruction Strategies",
    competency: "Instructional Design",
    scenario:
      "You have a class of 30 students with varying learning abilities. Five students are advanced learners who finish tasks quickly, ten students struggle with reading comprehension, and the rest are at grade level. You need to teach a lesson on fractions. How would you differentiate your instruction to meet all students' needs?",
  },
  {
    id: 3,
    title: "Assessment & Evaluation Techniques",
    competency: "Assessment",
    scenario:
      "After a unit test, you discover that 60% of your class scored below the passing grade. The test covered material you taught over three weeks. How would you analyze this situation and what steps would you take to address the learning gaps while keeping the curriculum on track?",
  },
  {
    id: 4,
    title: "Technology Integration in Teaching",
    competency: "Technology",
    scenario:
      "Your school has just received a set of tablets for classroom use, but many students have never used tablets for learning before. Some parents have expressed concerns about screen time. How would you introduce and integrate these tablets into your teaching while addressing parental concerns?",
  },
  {
    id: 5,
    title: "Student Engagement Best Practices",
    competency: "Classroom Management",
    scenario:
      "It's the last period on a Friday afternoon, and you notice your students are tired and disengaged. You have an important lesson on climate change that you need to complete. What strategies would you use to re-energize the class and ensure meaningful learning takes place?",
  },
  {
    id: 6,
    title: "Inclusive Education Fundamentals",
    competency: "Inclusive Practices",
    scenario:
      "A new student with autism spectrum disorder is joining your class next week. The student's parents have shared that their child has difficulty with sudden changes in routine and loud noises. How would you prepare your classroom and other students to create an inclusive and supportive environment?",
  },
  {
    id: 7,
    title: "Effective Communication with Parents",
    competency: "Communication",
    scenario:
      "A parent has sent you an angry email accusing you of treating their child unfairly because their child received a lower grade than expected. The parent is demanding an immediate meeting and threatens to escalate to the principal. How would you respond to this situation professionally?",
  },
  {
    id: 8,
    title: "Data-Driven Instruction",
    competency: "Assessment",
    scenario:
      "You have access to your students' performance data from the past semester, including test scores, assignment completion rates, and attendance records. You notice that a group of 8 students consistently underperform despite regular attendance. How would you use this data to create an intervention plan?",
  },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const UploadAudioPage = () => {
  const params = useParams();
  const router = useRouter();
  const assessmentId = Number(params.id);

  const assessment = mockAssessments.find((a) => a.id === assessmentId);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate with zod
    const result = audioFileSchema.safeParse({ file });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    // Clear previous audio
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setIsUploaded(false);
    setUploadProgress(0);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    setError(null);

    // Validate with zod
    const result = audioFileSchema.safeParse({ file });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    // Clear previous audio
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setIsUploaded(false);
    setUploadProgress(0);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const deleteAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioFile(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setIsUploaded(false);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleUpload = async () => {
    if (!audioFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsUploaded(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleContinue = () => {
    router.push(`/teacher/dashboard/assessments/${assessmentId}/video`);
  };

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
                `/teacher/dashboard/assessments/${assessmentId}/short-answer`
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
                Audio Response
              </Badge>
              <span>Step 3 of 5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        {/* Scenario Question Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Badge variant="secondary">Scenario</Badge>
              Classroom Situation
            </CardTitle>
            <CardDescription>
              Listen to or read the scenario below and record your response
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/50 p-4 text-sm sm:text-base leading-relaxed">
              {assessment.scenario}
            </div>
          </CardContent>
        </Card>

        {/* Audio Upload Card */}
        <Card className="flex flex-1 flex-col overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">
              Upload Your Audio Response
            </CardTitle>
            <CardDescription>
              Record your response explaining how you would handle this
              situation. Maximum file size: 10MB
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            {!audioFile ? (
              <Empty
                className="flex-1 border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileAudio className="size-5" />
                  </EmptyMedia>
                  <EmptyTitle>No audio file selected</EmptyTitle>
                  <EmptyDescription>
                    Drag and drop an audio file here, or click to browse.
                    <br />
                    Supported formats: MP3, WAV, OGG, WebM, M4A (Max 10MB)
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button variant="outline" type="button">
                    <Upload className="size-4 mr-2" />
                    Choose Audio File
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-6">
                {/* Audio Player */}
                <div className="w-full max-w-md rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-10 rounded-full"
                        onClick={togglePlayback}
                      >
                        {isPlaying ? (
                          <Pause className="size-4" />
                        ) : (
                          <Play className="size-4" />
                        )}
                      </Button>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[200px]">
                          {audioFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Size: {formatFileSize(audioFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={deleteAudio}
                      disabled={isUploading}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  {audioUrl && (
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />
                  )}
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="w-full max-w-md space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {/* Upload Success */}
                {isUploaded && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="size-5" />
                    <span className="text-sm font-medium">
                      Audio uploaded successfully!
                    </span>
                  </div>
                )}

                {/* Actions */}
                {!isUploaded ? (
                  <Button
                    className="w-full max-w-md"
                    onClick={handleUpload}
                    disabled={isUploading}
                  >
                    <Upload className="size-4 mr-2" />
                    {isUploading ? "Uploading..." : "Upload Audio"}
                  </Button>
                ) : (
                  <Button className="w-full max-w-md" onClick={handleContinue}>
                    <CheckCircle2 className="size-4 mr-2" />
                    Next Step: Upload Video
                  </Button>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <p className="mt-4 text-sm text-destructive text-center">
                {error}
              </p>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
          <CardFooter className="border-t pt-4">
            <p className="w-full text-center text-xs text-muted-foreground">
              Your audio response will be reviewed as part of your assessment.
              Speak clearly and explain your approach step by step.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UploadAudioPage;
