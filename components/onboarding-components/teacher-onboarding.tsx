"use client";

import SchoolNotPresent from "@/components/onboarding-components/school-not-present";
import { FileUpload } from "@/components/ui/ file-upload";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { countries } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    IconExclamationCircle,
    IconGenderFemale,
    IconGenderTransgender,
    IconMars,
} from "@tabler/icons-react";
import Cookies from "js-cookie";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Card, CardContent } from "../ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";

// Mock school data - replace with actual API data
const schools = [
  {
    value: "school-1",
    label: "Springfield Elementary School",
    status: "approved",
  },
  { value: "school-2", label: "Riverdale High School", status: "pending" },
  { value: "school-3", label: "Greenwood Academy", status: "approved" },
  {
    value: "school-4",
    label: "Oakridge International School",
    status: "pending",
  },
  { value: "school-5", label: "Maple Leaf Public School", status: "approved" },
  { value: "school-6", label: "Sunrise Secondary School", status: "approved" },
  { value: "school-7", label: "Heritage College", status: "pending" },
] as const;

const subjects = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Art",
  "Music",
  "Physical Education",
] as const;

const gradeLevels = [
  "KG",
  "Grade 1-5",
  "Grade 6-8",
  "Grade 9-10",
  "Grade 11-12",
  "College",
  "Other",
] as const;

const teacherOnboardingSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  schoolEmail: z
    .string()
    .email("Please enter a valid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid school email"
    ),
  schoolId: z.string().min(1, "Please select a school"),
  teachingExperience: z
    .string()
    .min(1, "Please enter your teaching experience"),
  subjects: z
    .array(z.string())
    .min(1, "Please select at least one subject")
    .max(5, "You can select up to 5 subjects"),
  gradeLevels: z
    .array(z.string())
    .min(1, "Please select at least one grade level"),
  certificates: z.string().optional(),
  staffId: z.string().optional(),
  countryId: z.string().min(1, "Please select your country"),
  gender: z.string().min(1, "Please select your gender"),
  aspiration: z.string().optional(),
});

type TeacherOnboardingData = z.infer<typeof teacherOnboardingSchema>;

const ErrorIcon = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-auto">
            <IconExclamationCircle className="w-5 h-5 text-red-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-accent text-white font-[inter]"
        >
          {message}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function TeacherOnboardingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [staffIdFiles, setStaffIdFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [staffIdUploadProgress, setStaffIdUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isStaffIdUploading, setIsStaffIdUploading] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGradeLevels, setSelectedGradeLevels] = useState<string[]>([]);
  const [showCustomSubjectInput, setShowCustomSubjectInput] = useState(false);
  const [customSubjectValue, setCustomSubjectValue] = useState("");
  const [dynamicSchools, setDynamicSchools] = useState<
    Array<{ value: string; label: string; status?: string }>
  >([]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [gradeLevelsOpen, setGradeLevelsOpen] = useState(false);
  const router = useTransitionRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<TeacherOnboardingData>({
    resolver: zodResolver(teacherOnboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      schoolEmail: "",
      schoolId: "",
      teachingExperience: "",
      subjects: [],
      gradeLevels: [],
      certificates: "",
      staffId: "",
      countryId: "",
      gender: "",
      aspiration: "",
    },
  });

  const schoolId = watch("schoolId");
  const countryId = watch("countryId");
  const allSchools = [...schools, ...dynamicSchools];

  // Check if school requires staff ID verification
  const requiresStaffIdVerification = () => {
    if (!schoolId) return false;

    const selectedSchool = allSchools.find(
      (school) => school.value === schoolId
    );

    // If school is from dynamic schools (added by user) or has pending status
    const isDynamicSchool = dynamicSchools.some(
      (school) => school.value === schoolId
    );
    const isPendingSchool = selectedSchool?.status === "pending";

    return isDynamicSchool || isPendingSchool;
  };

  const handleSchoolAdded = (schoolName: string) => {
    const newSchool = {
      value: `school-dynamic-${Date.now()}`,
      label: schoolName,
      status: "pending", // Dynamic schools are considered pending
    };
    setDynamicSchools([...dynamicSchools, newSchool]);
    setValue("schoolId", newSchool.value);
  };

  const handleCertificateSelect = (files: File[]) => {
    setCertificateFiles(files);

    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Store file references (in real app, upload to server and store URLs)
    if (files.length > 0) {
      setValue("certificates", files[0].name);
    }
  };

  const handleCertificateRemove = (index: number) => {
    setCertificateFiles([]);
    setValue("certificates", "");
    setUploadProgress(0);
  };

  const handleStaffIdSelect = (files: File[]) => {
    setStaffIdFiles(files);

    // Simulate upload progress
    setIsStaffIdUploading(true);
    setStaffIdUploadProgress(0);

    const interval = setInterval(() => {
      setStaffIdUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsStaffIdUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Store file references (in real app, upload to server and store URLs)
    if (files.length > 0) {
      setValue("staffId", files[0].name);
    }
  };

  const handleStaffIdRemove = (index: number) => {
    setStaffIdFiles([]);
    setValue("staffId", "");
    setStaffIdUploadProgress(0);
  };

  const toggleSubject = (subject: string) => {
    if (subject === "Other") {
      setShowCustomSubjectInput(true);
      setSubjectsOpen(false);
      return;
    }

    const newSubjects = selectedSubjects.includes(subject)
      ? selectedSubjects.filter((s) => s !== subject)
      : [...selectedSubjects, subject];

    if (newSubjects.length <= 5) {
      setSelectedSubjects(newSubjects);
      setValue("subjects", newSubjects);
    }
  };

  const handleCustomSubjectAdd = () => {
    if (customSubjectValue.trim() && selectedSubjects.length < 5) {
      const newSubjects = [...selectedSubjects, customSubjectValue.trim()];
      setSelectedSubjects(newSubjects);
      setValue("subjects", newSubjects);
      setCustomSubjectValue("");
      setShowCustomSubjectInput(false);
    }
  };

  const toggleGradeLevel = (gradeLevel: string) => {
    const newGradeLevels = selectedGradeLevels.includes(gradeLevel)
      ? selectedGradeLevels.filter((g) => g !== gradeLevel)
      : [...selectedGradeLevels, gradeLevel];

    setSelectedGradeLevels(newGradeLevels);
    setValue("gradeLevels", newGradeLevels);
  };

  const handleNextStep = async () => {
    const fieldsToValidate: Array<keyof TeacherOnboardingData> = [
      "firstName",
      "lastName",
      "schoolEmail",
      "schoolId",
      "countryId",
      "gender",
    ];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(2);
    }
  };

  const handleStep2Next = async () => {
    const fieldsToValidate: Array<keyof TeacherOnboardingData> = [
      "teachingExperience",
      "subjects",
      "gradeLevels",
    ];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(3);
    }
  };

  const { user: authUser, setUser } = useAuthStore();

  const onSubmit = async (data: TeacherOnboardingData) => {
    // Validate staff ID if required
    if (requiresStaffIdVerification() && !data.staffId) {
      toast.error("Staff ID or Employment Proof is required", {
        description:
          "Please upload your staff ID or employment proof to verify your employment.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get current user from cookies
      const userStr = Cookies.get("user");
      if (userStr) {
        const user = JSON.parse(userStr);

        // Update user data
        const updatedUser = {
          ...user,
          profileCompleted: true,
          firstName: data.firstName,
          lastName: data.lastName,
          name: `${data.firstName} ${data.lastName}`,
          schoolEmail: data.schoolEmail,
          schoolId: data.schoolId,
          teachingExperience: data.teachingExperience,
          subjects: data.subjects,
          gradeLevels: data.gradeLevels,
          countryId: data.countryId,
          gender: data.gender,
          certificates: data.certificates,
          staffId: data.staffId,
          aspiration: data.aspiration,
          verificationStatus: requiresStaffIdVerification()
            ? "pending"
            : "approved",
        };

        // Update cookie
        Cookies.set("user", JSON.stringify(updatedUser), { expires: 7 });

        // Update auth store
        setUser(updatedUser);
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (requiresStaffIdVerification()) {
        toast.success("Profile submitted for verification!", {
          icon: "⏳",
          description:
            "Your profile will be reviewed and approved by the school admin.",
        });
      } else {
        toast.success("Profile completed successfully!", {
          icon: "🎉",
          description: "Welcome to GuruCool AI",
        });
      }

      // Redirect to teacher dashboard profile
      router.push("/teacher/dashboard/profile");
    } catch (error) {
      toast.error("Failed to save profile", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full font-[montserrat]">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Complete Your Teacher Profile</h1>
          <p className="text-muted-foreground mt-2">
            Tell us about yourself to get started
          </p>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className={step === 1 ? "text-primary" : ""}>
                Basic Information
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className={step === 2 ? "text-primary" : ""}>
                Teaching Details
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className={step === 3 ? "text-primary" : ""}>
                {requiresStaffIdVerification()
                  ? "Verification Documents"
                  : "Certificates"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <div className="relative flex flex-row ">
                      <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                      {errors.firstName && (
                        <ErrorIcon message={errors.firstName?.message} />
                      )}
                    </div>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...register("firstName")}
                    />
                  </Field>

                  <Field>
                    <div className="relative flex flex-row ">
                      <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                      {errors.lastName && (
                        <ErrorIcon message={errors.lastName?.message} />
                      )}
                    </div>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...register("lastName")}
                    />
                  </Field>
                </div>

                <Field>
                  <div className="relative flex flex-row mb-3">
                    <FieldLabel htmlFor="gender">Gender</FieldLabel>
                    {errors.gender && (
                      <ErrorIcon message={errors.gender?.message} />
                    )}
                  </div>

                  <div className="flex gap-4 flex-wrap">
                    {/* Male */}
                    <button
                      type="button"
                      onClick={() => setValue("gender", "male")}
                      className={cn(
                        "flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-all min-w-[120px]",
                        watch("gender") === "male"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <IconMars className="w-8 h-8" />
                      <span className="text-sm font-medium">Male</span>
                    </button>

                    {/* Female */}
                    <button
                      type="button"
                      onClick={() => setValue("gender", "female")}
                      className={cn(
                        "flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-all min-w-[120px]",
                        watch("gender") === "female"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <IconGenderFemale className="w-8 h-8" />
                      <span className="text-sm font-medium">Female</span>
                    </button>

                    {/* Other */}
                    <button
                      type="button"
                      onClick={() => setValue("gender", "other")}
                      className={cn(
                        "flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-all min-w-[120px]",
                        watch("gender") === "other"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <IconGenderTransgender className="w-8 h-8" />
                      <span className="text-sm font-medium">Other</span>
                    </button>
                  </div>
                </Field>

                <Field>
                  <div className="relative flex flex-row ">
                    <FieldLabel htmlFor="schoolEmail">
                      School Email (Official)
                    </FieldLabel>
                    {errors.schoolEmail && (
                      <ErrorIcon message={errors.schoolEmail?.message} />
                    )}
                  </div>
                  <Input
                    id="schoolEmail"
                    type="email"
                    placeholder="teacher@school.edu"
                    {...register("schoolEmail")}
                  />
                </Field>

                <Field>
                  <div className="relative flex flex-row ">
                    <FieldLabel htmlFor="countryId">
                      Select Your Country
                    </FieldLabel>
                    {errors.countryId && (
                      <ErrorIcon message={errors.countryId?.message} />
                    )}
                  </div>
                  <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={countryOpen}
                        className={cn(
                          "w-full justify-between font-normal",
                          !countryId && "text-muted-foreground"
                        )}
                      >
                        {countryId
                          ? countries.find((c) => c.id === countryId)?.label ||
                            "Select your country..."
                          : "Select your country..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-(--radix-popover-trigger-width) p-2">
                      <Command className="font-[montserrat]">
                        <CommandInput
                          placeholder="Search country..."
                          className="h-9 pb-2"
                        />
                        <CommandList>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {countries.map((country) => (
                              <CommandItem
                                key={country.id}
                                value={country.label}
                                onSelect={() => {
                                  setValue("countryId", country.id);
                                  setCountryOpen(false);
                                }}
                                className="cursor-pointer"
                              >
                                <p>{country.flag} </p>
                                {country.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </Field>

                <Field>
                  <div className="relative flex flex-row">
                    <FieldLabel htmlFor="schoolId">School Selection</FieldLabel>
                    {errors.schoolId && (
                      <ErrorIcon message={errors.schoolId?.message} />
                    )}
                  </div>
                  <Popover open={schoolOpen} onOpenChange={setSchoolOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={schoolOpen}
                        className={cn(
                          "w-full justify-between font-normal",
                          !schoolId && "text-muted-foreground"
                        )}
                      >
                        {schoolId
                          ? allSchools.find(
                              (school) => school.value === schoolId
                            )?.label || "Select your school..."
                          : "Select your school..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                      <Command className="font-[montserrat]">
                        <CommandInput
                          placeholder="Search school..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No school found.</CommandEmpty>
                          <CommandGroup>
                            {allSchools.map((school) => (
                              <CommandItem
                                key={school.value}
                                value={school.label}
                                onSelect={() => {
                                  setValue("schoolId", school.value);
                                  setSchoolOpen(false);
                                }}
                                className="cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    schoolId === school.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex items-center justify-between w-full">
                                  <span>{school.label}</span>
                                  {school.status === "pending" && (
                                    <span className="text-xs bg-yellow-100/50 text-yellow-300 px-2 py-0.5 rounded ml-2 font-[inter]">
                                      Pending
                                    </span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                        <div className="border-t">
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground h-9 px-2 font-normal"
                            onClick={() => {
                              setSchoolOpen(false);
                              setDialogOpen(true);
                            }}
                          >
                            School not in the list
                          </Button>
                        </div>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {requiresStaffIdVerification() && schoolId && (
                    <Card className="mt-2 p-3  rounded-md">
                      <CardContent>
                        <p className="text-xs">
                          ⚠️ This school requires verification. You'll need to
                          upload your Staff ID or Employment Proof in the final
                          step.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </Field>

                <Button
                  type="button"
                  className="w-full"
                  onClick={handleNextStep}
                >
                  Next: Teaching Details
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <Field>
                  <div className="relative flex flex-row">
                    <FieldLabel htmlFor="teachingExperience">
                      Teaching Experience
                    </FieldLabel>
                    {errors.teachingExperience && (
                      <ErrorIcon message={errors.teachingExperience?.message} />
                    )}
                  </div>
                  <Select
                    onValueChange={(value) =>
                      setValue("teachingExperience", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent className="font-[montserrat]">
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <div className="relative flex flex-row">
                    <FieldLabel>Grade Levels Taught *</FieldLabel>
                    {errors.gradeLevels && (
                      <ErrorIcon message={errors.gradeLevels?.message} />
                    )}
                  </div>
                  <Popover
                    open={gradeLevelsOpen}
                    onOpenChange={setGradeLevelsOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={gradeLevelsOpen}
                        className="w-full justify-between font-normal h-auto min-h-[40px]"
                      >
                        <div className="flex flex-wrap gap-1">
                          {selectedGradeLevels.length > 0 ? (
                            selectedGradeLevels.map((level) => (
                              <span
                                key={level}
                                className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs"
                              >
                                {level}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted-foreground">
                              Select grade levels...
                            </span>
                          )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                      <Command className="font-[montserrat]">
                        <CommandList>
                          <CommandEmpty>No grade level found.</CommandEmpty>
                          <CommandGroup>
                            {gradeLevels.map((level) => (
                              <CommandItem
                                key={level}
                                value={level}
                                onSelect={() => toggleGradeLevel(level)}
                                className="cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedGradeLevels.includes(level)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {level}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedGradeLevels.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedGradeLevels.map((level) => (
                        <div
                          key={level}
                          className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm flex items-center gap-2"
                        >
                          {level}
                          <button
                            type="button"
                            onClick={() => toggleGradeLevel(level)}
                            className="hover:bg-primary-foreground/20 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Field>

                <Field>
                  <div className="relative flex flex-row">
                    <FieldLabel>Subjects (Select up to 5)</FieldLabel>
                    {errors.subjects && (
                      <ErrorIcon message={errors.subjects?.message} />
                    )}
                  </div>
                  <Popover open={subjectsOpen} onOpenChange={setSubjectsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={subjectsOpen}
                        className="w-full justify-between font-normal h-auto min-h-[40px]"
                      >
                        <div className="flex flex-wrap gap-1">
                          {selectedSubjects.length > 0 ? (
                            selectedSubjects.map((subject) => (
                              <span
                                key={subject}
                                className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs"
                              >
                                {subject}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted-foreground">
                              Select subjects...
                            </span>
                          )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                      <Command className="font-[montserrat]">
                        <CommandInput
                          placeholder="Search subject..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No subject found.</CommandEmpty>
                          <CommandGroup>
                            {subjects.map((subject) => (
                              <CommandItem
                                key={subject}
                                value={subject}
                                onSelect={() => toggleSubject(subject)}
                                disabled={
                                  selectedSubjects.length >= 5 &&
                                  !selectedSubjects.includes(subject)
                                }
                                className={cn(
                                  "cursor-pointer",
                                  selectedSubjects.length >= 5 &&
                                    !selectedSubjects.includes(subject) &&
                                    "opacity-50 cursor-not-allowed"
                                )}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedSubjects.includes(subject)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {subject}
                              </CommandItem>
                            ))}
                            <CommandItem
                              value="Other"
                              onSelect={() => toggleSubject("Other")}
                              disabled={selectedSubjects.length >= 5}
                              className={cn(
                                "cursor-pointer",
                                selectedSubjects.length >= 5 &&
                                  "opacity-50 cursor-not-allowed"
                              )}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  showCustomSubjectInput
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              Other
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {showCustomSubjectInput && (
                    <div className="mt-2 flex gap-2">
                      <Input
                        placeholder="Enter custom subject"
                        value={customSubjectValue}
                        onChange={(e) => setCustomSubjectValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleCustomSubjectAdd();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleCustomSubjectAdd}
                        disabled={
                          !customSubjectValue.trim() ||
                          selectedSubjects.length >= 5
                        }
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowCustomSubjectInput(false);
                          setCustomSubjectValue("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  {selectedSubjects.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSubjects.map((subject) => (
                        <div
                          key={subject}
                          className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm flex items-center gap-2"
                        >
                          {subject}
                          <button
                            type="button"
                            onClick={() => toggleSubject(subject)}
                            className="hover:bg-primary-foreground/20 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Field>

                <Field>
                  <div className="relative flex flex-row">
                    <FieldLabel htmlFor="aspiration">
                      Career Aspiration (Optional)
                    </FieldLabel>
                    {errors.aspiration && (
                      <ErrorIcon message={errors.aspiration?.message} />
                    )}
                  </div>
                  <Select
                    onValueChange={(value) =>
                      setValue("aspiration", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your career aspiration" />
                    </SelectTrigger>
                    <SelectContent className="font-[montserrat]">
                      <SelectItem value="principal">Principal</SelectItem>
                      <SelectItem value="vice-principal">Vice Principal</SelectItem>
                      <SelectItem value="head-teacher">Head Teacher</SelectItem>
                      <SelectItem value="department-head">Department Head</SelectItem>
                      <SelectItem value="curriculum-coordinator">Curriculum Coordinator</SelectItem>
                      <SelectItem value="education-consultant">Education Consultant</SelectItem>
                      <SelectItem value="teacher-trainer">Teacher Trainer</SelectItem>
                      <SelectItem value="school-administrator">School Administrator</SelectItem>
                      <SelectItem value="education-researcher">Education Researcher</SelectItem>
                      <SelectItem value="subject-specialist">Subject Specialist</SelectItem>
                      <SelectItem value="senior-teacher">Senior Teacher</SelectItem>
                      <SelectItem value="continue-teaching">Continue Teaching</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={handleStep2Next}
                  >
                    {requiresStaffIdVerification()
                      ? "Next: Upload Verification Documents"
                      : "Next: Upload Certificates"}
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                {requiresStaffIdVerification() && (
                  <>
                    <Field>
                      <FieldLabel>Staff ID / Employment Proof *</FieldLabel>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload your staff ID card, employment letter, or any
                        official document that proves your employment at the
                        selected school. This is required for verification.
                      </p>
                      <FileUpload
                        accept=".jpg,.jpeg,.png,.pdf"
                        maxSize={10}
                        maxFiles={2}
                        multiple={true}
                        showPreview={true}
                        uploadProgress={staffIdUploadProgress}
                        isUploading={isStaffIdUploading}
                        onFileSelect={handleStaffIdSelect}
                        onFileRemove={handleStaffIdRemove}
                      />
                    </Field>
                  </>
                )}

                <Field>
                  <FieldLabel>Upload Prior Certificates (Optional)</FieldLabel>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your teaching certificates, degrees, or any other
                    relevant credentials. This is optional but helps verify your
                    qualifications.
                  </p>
                  <FileUpload
                    accept=".jpg,.jpeg,.png,.pdf"
                    maxSize={10}
                    maxFiles={3}
                    multiple={true}
                    showPreview={true}
                    uploadProgress={uploadProgress}
                    isUploading={isUploading}
                    onFileSelect={handleCertificateSelect}
                    onFileRemove={handleCertificateRemove}
                  />
                </Field>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2" />
                        Saving...
                      </>
                    ) : requiresStaffIdVerification() ? (
                      "Submit for Verification"
                    ) : (
                      "Complete Profile"
                    )}
                  </Button>
                </div>
              </>
            )}
          </FieldGroup>
        </form>

        <SchoolNotPresent
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSchoolAdded={handleSchoolAdded}
        />
      </div>
    </div>
  );
}
