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
  Clock,
  Film,
  HardDrive,
  Pause,
  Play,
  RotateCcw,
  Trash2,
  Upload,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

// Zod schema for video file validation
const videoFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 50 * 1024 * 1024, {
      message: "File size must be less than 50MB",
    })
    .refine(
      (file) =>
        [
          "video/mp4",
          "video/webm",
          "video/ogg",
          "video/quicktime",
          "video/x-msvideo",
        ].includes(file.type),
      {
        message: "File must be a video file (MP4, WebM, OGG, MOV, AVI)",
      }
    ),
});

// Mock assessment data with video scenario questions
const mockAssessments = [
  {
    id: 1,
    title: "Classroom Management Fundamentals",
    competency: "Classroom Management",
    scenario:
      "Record a 2-3 minute video demonstrating how you would introduce yourself to a new class on the first day of school. Show how you would establish your presence, build rapport, and communicate your expectations clearly. Demonstrate your body language, tone, and engagement techniques.",
  },
  {
    id: 2,
    title: "Differentiated Instruction Strategies",
    competency: "Instructional Design",
    scenario:
      "Create a video demonstrating how you would explain a complex concept (e.g., photosynthesis, fractions, or a grammar rule) using differentiated instruction. Show at least two different approaches you would use for visual learners and kinesthetic learners.",
  },
  {
    id: 3,
    title: "Assessment & Evaluation Techniques",
    competency: "Assessment",
    scenario:
      "Record yourself explaining to students how they will be assessed on an upcoming project. Demonstrate how you would present a rubric, explain criteria clearly, and answer potential student questions about expectations.",
  },
  {
    id: 4,
    title: "Technology Integration in Teaching",
    competency: "Technology",
    scenario:
      "Create a short video tutorial demonstrating how you would teach students to use a digital tool (e.g., a presentation software, educational app, or online resource) for a learning activity. Show your screen-sharing and explanation skills.",
  },
  {
    id: 5,
    title: "Student Engagement Best Practices",
    competency: "Classroom Management",
    scenario:
      "Record a video demonstrating an engaging warm-up activity you would use to start a lesson. Show your enthusiasm, how you would involve students, and how you would transition from the activity to the main lesson content.",
  },
  {
    id: 6,
    title: "Inclusive Education Fundamentals",
    competency: "Inclusive Practices",
    scenario:
      "Create a video demonstrating how you would give instructions for a group activity while ensuring all students, including those with different learning needs, can participate. Show how you would use visual aids, repeat key information, and check for understanding.",
  },
  {
    id: 7,
    title: "Effective Communication with Parents",
    competency: "Communication",
    scenario:
      "Record a simulated parent-teacher conference introduction. Demonstrate how you would welcome a parent, set a positive tone, and begin discussing their child's progress. Show your professionalism, empathy, and communication skills.",
  },
  {
    id: 8,
    title: "Data-Driven Instruction",
    competency: "Assessment",
    scenario:
      "Create a video explaining to colleagues (in a professional development context) how you analyze student data to identify trends and adjust instruction. Use hypothetical examples to demonstrate your analytical thinking and planning process.",
  },
];

const UploadVideoPage = () => {
  const params = useParams();
  const router = useRouter();
  const assessmentId = Number(params.id);

  const assessment = mockAssessments.find((a) => a.id === assessmentId);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [videoUrl]);

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

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate with zod
    const result = videoFileSchema.safeParse({ file });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    // Clear previous video
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }

    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setIsUploaded(false);
    setUploadProgress(0);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    setError(null);

    // Validate with zod
    const result = videoFileSchema.safeParse({ file });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    // Clear previous video
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }

    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setIsUploaded(false);
    setUploadProgress(0);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const deleteVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(null);
    setVideoUrl(null);
    setIsPlaying(false);
    setIsUploaded(false);
    setUploadProgress(0);
    setError(null);
    setCurrentTime(0);
    setDuration(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  const handleUpload = async () => {
    if (!videoFile) return;

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
        return prev + 5;
      });
    }, 150);
  };

  const handleContinue = () => {
    router.push(`/teacher/dashboard/assessments/${assessmentId}/submit`);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

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
                `/teacher/dashboard/assessments/${assessmentId}/audio`
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
                Video Response
              </Badge>
              <span>Step 4 of 5</span>
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
              <Badge variant="secondary">Video Task</Badge>
              Teaching Demonstration
            </CardTitle>
            <CardDescription>
              Record or upload a video demonstrating your teaching skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/50 p-4 text-sm sm:text-base leading-relaxed">
              {assessment.scenario}
            </div>
          </CardContent>
        </Card>

        {/* Video Upload Card */}
        <Card className="flex flex-1 flex-col overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">
              Upload Your Video Response
            </CardTitle>
            <CardDescription>
              Upload a video demonstrating your teaching approach. Maximum file
              size: 50MB
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col overflow-auto">
            {!videoFile ? (
              <Empty
                className={`flex-1 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <div
                      className={`p-4 rounded-full transition-colors ${
                        isDragging ? "bg-primary/10" : "bg-muted"
                      }`}
                    >
                      <Video
                        className={`size-8 ${
                          isDragging ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                  </EmptyMedia>
                  <EmptyTitle className="text-lg">
                    {isDragging ? "Drop your video here" : "Upload your video"}
                  </EmptyTitle>
                  <EmptyDescription className="max-w-sm">
                    Drag and drop your video file here, or click to browse from
                    your device
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex flex-col items-center gap-4">
                    <Button
                      variant="default"
                      size="lg"
                      type="button"
                      className="gap-2"
                    >
                      <Upload className="size-4" />
                      Choose Video File
                    </Button>
                    <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
                        <Film className="size-3" />
                        MP4, WebM, MOV
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
                        <HardDrive className="size-3" />
                        Max 50MB
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
                        <Clock className="size-3" />
                        2-5 min recommended
                      </span>
                    </div>
                  </div>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="flex flex-1 flex-col gap-4">
                {/* Video Player Container */}
                <div className="w-full max-w-2xl mx-auto">
                  {/* Video Preview */}
                  <div className="relative rounded-xl overflow-hidden bg-black shadow-lg group">
                    {videoUrl && (
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full aspect-video object-contain"
                        onClick={togglePlayback}
                      />
                    )}

                    {/* Play/Pause Overlay */}
                    <button
                      onClick={togglePlayback}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <div className="size-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                        {isPlaying ? (
                          <Pause className="size-7 text-gray-800" />
                        ) : (
                          <Play className="size-7 text-gray-800 ml-1" />
                        )}
                      </div>
                    </button>

                    {/* Video Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {/* Progress Bar */}
                      <div
                        ref={progressRef}
                        className="h-1.5 bg-white/30 rounded-full mb-3 cursor-pointer overflow-hidden"
                        onClick={handleProgressClick}
                      >
                        <div
                          className="h-full bg-white rounded-full transition-all duration-100"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      {/* Controls Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 text-white hover:bg-white/20"
                            onClick={togglePlayback}
                          >
                            {isPlaying ? (
                              <Pause className="size-4" />
                            ) : (
                              <Play className="size-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 text-white hover:bg-white/20"
                            onClick={handleRestart}
                          >
                            <RotateCcw className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 text-white hover:bg-white/20"
                            onClick={toggleMute}
                          >
                            {isMuted ? (
                              <VolumeX className="size-4" />
                            ) : (
                              <Volume2 className="size-4" />
                            )}
                          </Button>
                          <span className="text-xs text-white/80 ml-2">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* File Info Card */}
                  <div className="flex items-center justify-between mt-3 p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Video className="size-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {videoFile.name}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <HardDrive className="size-3" />
                            {formatFileSize(videoFile.size)}
                          </span>
                          {duration > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {formatTime(duration)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={deleteVideo}
                      disabled={isUploading}
                    >
                      <Trash2 className="size-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>

                {/* Upload Section */}
                <div className="w-full max-w-2xl mx-auto space-y-4">
                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2 p-4 rounded-lg border bg-muted/30">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Uploading video...</span>
                        <span className="text-muted-foreground">
                          {uploadProgress}%
                        </span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  {/* Upload Success */}
                  {isUploaded && (
                    <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle2 className="size-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Video uploaded successfully!
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  {!isUploaded ? (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleUpload}
                      disabled={isUploading}
                    >
                      <Upload className="size-4 mr-2" />
                      {isUploading ? "Uploading..." : "Upload Video"}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleContinue}
                    >
                      Continue to Submit
                      <CheckCircle2 className="size-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="w-full flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <span>💡 Tip: Ensure good lighting and clear audio</span>
              <span>📱 Record horizontally for best results</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UploadVideoPage;
