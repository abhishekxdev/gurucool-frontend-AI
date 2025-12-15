"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  CheckCircle2,
  Mic,
  Pause,
  Play,
  Square,
  Trash2,
  Upload,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";

// Mock assessment data
const mockAssessments = [
  {
    id: 1,
    title: "Classroom Management Fundamentals",
    competency: "Classroom Management",
  },
  {
    id: 2,
    title: "Differentiated Instruction Strategies",
    competency: "Instructional Design",
  },
  {
    id: 3,
    title: "Assessment & Evaluation Techniques",
    competency: "Assessment",
  },
  {
    id: 4,
    title: "Technology Integration in Teaching",
    competency: "Technology",
  },
  {
    id: 5,
    title: "Student Engagement Best Practices",
    competency: "Classroom Management",
  },
  {
    id: 6,
    title: "Inclusive Education Fundamentals",
    competency: "Inclusive Practices",
  },
  {
    id: 7,
    title: "Effective Communication with Parents",
    competency: "Communication",
  },
  {
    id: 8,
    title: "Data-Driven Instruction",
    competency: "Assessment",
  },
];

const UploadAudioPage = () => {
  const params = useParams();
  const router = useRouter();
  const assessmentId = Number(params.id);

  const assessment = mockAssessments.find((a) => a.id === assessmentId);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check your permissions.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
    setIsUploaded(false);
    setUploadProgress(0);
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
    if (!audioBlob) return;

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

  const handleComplete = () => {
    router.replace("/teacher/dashboard/assessments");
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
                `/teacher/dashboard/assessments/${assessmentId}/mcqs`
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
                Upload Audio
              </Badge>
              <span>Final Step</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="flex flex-1 flex-col">
        <CardHeader className="text-center">
          <h2 className="text-lg sm:text-xl font-semibold">
            Record Your Teaching Demo
          </h2>
          <p className="text-sm text-muted-foreground">
            Record a 2-3 minute audio explaining how you would apply the
            concepts learned in this assessment in your classroom.
          </p>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center gap-6">
          {/* Recording UI */}
          {!audioUrl ? (
            <div className="flex flex-col items-center gap-6">
              {/* Timer Display */}
              <div className="text-4xl font-mono font-bold">
                {formatTime(recordingTime)}
              </div>

              {/* Recording Indicator */}
              {isRecording && (
                <div className="flex items-center gap-2">
                  <span
                    className={`size-3 rounded-full ${
                      isPaused ? "bg-yellow-500" : "bg-red-500 animate-pulse"
                    }`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {isPaused ? "Paused" : "Recording..."}
                  </span>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center gap-4">
                {!isRecording ? (
                  <Button
                    size="lg"
                    className="size-16 rounded-full"
                    onClick={startRecording}
                  >
                    <Mic className="size-6" />
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      variant="outline"
                      className="size-14 rounded-full"
                      onClick={pauseRecording}
                    >
                      {isPaused ? (
                        <Play className="size-5" />
                      ) : (
                        <Pause className="size-5" />
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant="destructive"
                      className="size-14 rounded-full"
                      onClick={stopRecording}
                    >
                      <Square className="size-5" />
                    </Button>
                  </>
                )}
              </div>

              {!isRecording && recordingTime === 0 && (
                <p className="text-sm text-muted-foreground">
                  Click the microphone to start recording
                </p>
              )}
            </div>
          ) : (
            <div className="flex w-full max-w-md flex-col items-center gap-6">
              {/* Audio Player */}
              <div className="w-full rounded-lg border bg-muted/50 p-4">
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
                      <p className="text-sm font-medium">Recording</p>
                      <p className="text-xs text-muted-foreground">
                        Duration: {formatTime(recordingTime)}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={deleteRecording}
                    disabled={isUploading}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="w-full space-y-2">
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
                  className="w-full"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  <Upload className="size-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Audio"}
                </Button>
              ) : (
                <Button className="w-full" onClick={handleComplete}>
                  <CheckCircle2 className="size-4 mr-2" />
                  Complete Assessment
                </Button>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4">
          <p className="w-full text-center text-xs text-muted-foreground">
            Your audio will be reviewed as part of your assessment. Make sure to
            speak clearly and cover the key concepts.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UploadAudioPage;
