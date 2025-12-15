"use client";

import {
  Bell,
  CheckCircle2,
  Pencil,
  School,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import avatar from "@/public/gurucool/avatar.png";

// Zod validation schema
const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string().email("Please enter a valid email address"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .regex(/^\+?[\d\s-]{10,}$/, "Please enter a valid contact number"),
  gender: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema> & {
  profilePhoto?: string | null;
  address: string;
};

interface AdminProfile {
  name: string;
  email: string;
  contactNumber: string;
  profilePhoto: string | null;
}

interface ActivityItem {
  id: string;
  type:
    | "school_approved"
    | "school_rejected"
    | "profile_updated"
    | "school_suspended"
    | "limit_changed";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "info" | "success" | "warning";
  read: boolean;
}

const initialProfile = {
  firstName: "Neel",
  lastName: "",
  email: "neel@gurucool.com",
  phone: "+91-98765-43210",
  address: "Delhi, India",
  profilePhoto: "/avatars/avatar.jpg",
  gender: "Male",
  country: "India",
  experience: "8 years",
  subjects: ["Mathematics", "Science"],
  proficiencyLevel: "Expert",
  gradeLevels: ["6", "7", "8"],
  currentSchool: "Gurucool Academy",
  schoolId: "SCH-001",
  latestPd: "AI in Education",
  lastActive: "December 10, 2025",
  totalPdCompleted: 12,
  totalBadgesEarned: 5,
  pdHours: 40,
  joinDate: "2020-06-15",
  approvalStatus: "approved",
  emailVerified: true,
};

const AdminProfilePage = () => {
  // Mock initial profile data
  const [profile, setProfile] = useState<AdminProfile>({
    name: "Neel",
    email: "neel@gurucool.com",
    contactNumber: "+91-98765-43210",
    profilePhoto: "/avatars/avatar.jpg",
  });

  const [activeTab, setActiveTab] = useState("profile");

  // Mock activity data - ADD MORE ITEMS
  const [activities] = useState<ActivityItem[]>([
    {
      id: "act-1",
      type: "school_approved",
      title: "School Approved",
      description: "Approved Riverside Academy",
      timestamp: "2 hours ago",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    },
    {
      id: "act-2",
      type: "profile_updated",
      title: "Profile Updated",
      description: "Updated contact information",
      timestamp: "1 day ago",
      icon: <User className="h-4 w-4 text-blue-500" />,
    },
    {
      id: "act-3",
      type: "school_suspended",
      title: "School Suspended",
      description: "Suspended Harmony International",
      timestamp: "2 days ago",
      icon: <XCircle className="h-4 w-4 text-red-500" />,
    },
    {
      id: "act-4",
      type: "limit_changed",
      title: "Onboarding Limit Changed",
      description: "Updated limit for Green Valley High to 40 teachers",
      timestamp: "3 days ago",
      icon: <School className="h-4 w-4 text-purple-500" />,
    },
    {
      id: "act-5",
      type: "school_rejected",
      title: "School Rejected",
      description: "Rejected Ocean Breeze International application",
      timestamp: "5 days ago",
      icon: <XCircle className="h-4 w-4 text-amber-500" />,
    },
    {
      id: "act-6",
      type: "school_approved",
      title: "School Approved",
      description: "Approved Mountain View School",
      timestamp: "1 week ago",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    },
    {
      id: "act-7",
      type: "limit_changed",
      title: "Onboarding Limit Changed",
      description: "Updated limit for Sunrise Public School to 60 teachers",
      timestamp: "1 week ago",
      icon: <School className="h-4 w-4 text-purple-500" />,
    },
  ]);

  // Mock notifications - ADD MORE ITEMS
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "New School Registration",
      description: "3 new schools are pending approval",
      timestamp: "1 hour ago",
      type: "info",
      read: false,
    },
    {
      id: "notif-2",
      title: "Profile Update Successful",
      description: "Your profile has been updated successfully",
      timestamp: "1 day ago",
      type: "success",
      read: true,
    },
    {
      id: "notif-3",
      title: "School Limit Warning",
      description: "5 schools are approaching their teacher limit",
      timestamp: "2 days ago",
      type: "warning",
      read: false,
    },
    {
      id: "notif-4",
      title: "System Maintenance",
      description: "Scheduled maintenance on Dec 15, 2024",
      timestamp: "3 days ago",
      type: "info",
      read: true,
    },
    {
      id: "notif-5",
      title: "New PD Content Added",
      description: "2 new PD assessments added to the library",
      timestamp: "4 days ago",
      type: "success",
      read: false,
    },
    {
      id: "notif-6",
      title: "School Verification Required",
      description: "10 schools need verification review",
      timestamp: "5 days ago",
      type: "warning",
      read: true,
    },
    {
      id: "notif-7",
      title: "Weekly Report Available",
      description: "Platform activity report for last week is ready",
      timestamp: "1 week ago",
      type: "info",
      read: true,
    },
    {
      id: "notif-8",
      title: "Bulk School Approval",
      description: "Successfully approved 5 schools in bulk",
      timestamp: "1 week ago",
      type: "success",
      read: true,
    },
  ]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: profile.name,
    email: profile.email,
    contactNumber: profile.contactNumber,
    gender: "Male",
    profilePhoto: profile.profilePhoto,
    address: initialProfile.address,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    setFormData({
      name: profile.name,
      email: profile.email,
      contactNumber: profile.contactNumber,
      address: formData.address,
    });
    setErrors({});
    setIsEditDialogOpen(true);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profilePhoto: imageUrl }));
      toast.success("Profile photo updated!");
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFormChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    try {
      profileSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSaveClick = () => {
    if (!validateForm()) {
      toast.error("Validation failed", {
        description: "Please fix the errors in the form",
      });
      return;
    }
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsProcessing(true);
    setIsConfirmDialogOpen(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const shouldFail = Math.random() < 0.1;
      if (shouldFail) {
        throw new Error(
          "Network error: Unable to update profile. Please try again."
        );
      }

      setProfile({
        ...profile,
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
      });

      toast.success("Profile updated successfully", {
        description: "Your profile information has been saved.",
      });

      setIsEditDialogOpen(false);
      setErrors({});
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error("Update failed", {
        description: errorMessage,
      });
    }
  };

  const handlePhotoSave = async () => {
    if (!selectedPhoto) return;

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const shouldFail = Math.random() < 0.1;
      if (shouldFail) {
        throw new Error(
          "Network error: Unable to upload photo. Please try again."
        );
      }

      const photoUrl = photoPreview || URL.createObjectURL(selectedPhoto);
      setProfile({
        ...profile,
        profilePhoto: photoUrl,
      });

      toast.success("Profile photo updated", {
        description: "Your profile photo has been changed successfully.",
      });

      setIsPhotoDialogOpen(false);
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload photo";
      toast.error("Upload failed", {
        description: errorMessage,
      });
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "warning":
        return <XCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      email: profile.email,
      contactNumber: profile.contactNumber,
      address: formData.address,
      gender: formData.gender,
      profilePhoto: formData.profilePhoto,
    });
    setIsEditing(false);
    setEditingField(null);
  };

  const InfoRow = ({
    label,
    value,
    field,
    description,
    editable = true,
    multiline = false,
    renderValue,
  }: {
    label: string;
    value?: string | React.ReactNode;
    field?: string;
    description?: string;
    editable?: boolean;
    multiline?: boolean;
    renderValue?: () => React.ReactNode;
  }) => (
    <div className="flex items-center justify-between py-4 group">
      <div className="flex-shrink-0 w-64">
        <Label className="text-sm text-muted-foreground">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-1 flex items-center justify-end gap-4">
        ]
        {isEditing && editingField === field && editable && field ? (
          multiline ? (
            <Textarea
              value={formData[field as keyof typeof formData] as string}
              onChange={(e) => handleInputChange(field, e.target.value)}
              rows={3}
              className="max-w-md"
            />
          ) : field === "gender" ? (
            <Select
              value={formData.gender}
              onValueChange={(value) => handleInputChange("gender", value)}
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={formData[field as keyof typeof formData] as string}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="max-w-xs"
            />
          )
        ) : renderValue ? (
          renderValue()
        ) : (
          <p className="text-base text-right">{value}</p>
        )}
        {editable && field && !isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setEditingField(field);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="size-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 font-[montserrat] max-w-2xl mx-auto w-full pb-16">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profile Information</h1>
        {isEditing && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel} size="sm">
              Discard
            </Button>
            <Button onClick={handleSaveClick} size="sm">
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Profile Photo */}
      <div className="flex items-center justify-between py-6 group">
        <div>
          <Label className="text-sm text-muted-foreground">Profile Photo</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Min 400×400px, PNG or JPEG formats.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative size-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            <Image
              src={formData.profilePhoto || "/avatar.png"}
              alt="Profile"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePhotoClick}
            type="button"
          >
            Change
          </Button>
        </div>
      </div>

      <Separator />

      {/* Name */}
      <div className="flex items-center justify-between py-4 group">
        <div>
          <Label className="text-sm text-muted-foreground">Full Name</Label>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4">
          {isEditing && editingField === "name" ? (
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Full name"
              className="w-64"
            />
          ) : (
            <p className="text-base">{formData.name}</p>
          )}
          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditingField("name");
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="size-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Email */}
      <div className="flex items-center justify-between py-4 group">
        <div>
          <Label className="text-sm text-muted-foreground">Email</Label>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4">
          {isEditing && editingField === "email" ? (
            <Input
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Email"
              className="w-64"
            />
          ) : (
            <p className="text-base">{formData.email}</p>
          )}
          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditingField("email");
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="size-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Contact Number */}
      <div className="flex items-center justify-between py-4 group">
        <div>
          <Label className="text-sm text-muted-foreground">
            Contact Number
          </Label>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4">
          {isEditing && editingField === "contactNumber" ? (
            <Input
              value={formData.contactNumber}
              onChange={(e) =>
                handleInputChange("contactNumber", e.target.value)
              }
              placeholder="Contact Number"
              className="w-64"
            />
          ) : (
            <p className="text-base">{formData.contactNumber}</p>
          )}
          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditingField("contactNumber");
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="size-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Address */}
      <div className="flex items-center justify-between py-4 group">
        <div>
          <Label className="text-sm text-muted-foreground">Address</Label>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4">
          {isEditing && editingField === "address" ? (
            <Textarea
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Address"
              className="w-64"
              rows={2}
            />
          ) : (
            <p className="text-base">{formData.address}</p>
          )}
          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditingField("address");
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="size-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="font-[montserrat]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information. Changes will be saved
              immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">
                Contact Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) =>
                  handleFormChange("contactNumber", e.target.value)
                }
                placeholder="+91-98765-43210"
              />
              {errors.contactNumber && (
                <p className="text-sm text-destructive">
                  {errors.contactNumber}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveClick} disabled={isProcessing}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Photo Dialog */}
      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent className="font-[montserrat]">
          <DialogHeader>
            <DialogTitle>Change Profile Photo</DialogTitle>
            <DialogDescription>
              Upload a new profile photo. Supported formats: PNG, JPEG (max 5MB)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {photoPreview && (
              <div className="flex justify-center">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-border">
                  <Image
                    src={photoPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="photo">Select Photo</Label>
              <Input
                id="photo"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handlePhotoUpload}
              />
              <p className="text-xs text-muted-foreground">
                Maximum file size: 5MB. Supported formats: PNG, JPEG
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsPhotoDialogOpen(false);
                setSelectedPhoto(null);
                setPhotoPreview(null);
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePhotoSave}
              disabled={!selectedPhoto || isProcessing}
            >
              {isProcessing ? "Uploading..." : "Save Photo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent className="font-[montserrat]">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Profile Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these changes to your profile? The
              updates will be reflected immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 text-sm">
            {formData.name !== profile.name && (
              <div>
                <p className="text-muted-foreground">Name:</p>
                <p className="font-medium">
                  {profile.name} → {formData.name}
                </p>
              </div>
            )}
            {formData.email !== profile.email && (
              <div>
                <p className="text-muted-foreground">Email:</p>
                <p className="font-medium">
                  {profile.email} → {formData.email}
                </p>
              </div>
            )}
            {formData.contactNumber !== profile.contactNumber && (
              <div>
                <p className="text-muted-foreground">Contact Number:</p>
                <p className="font-medium">
                  {profile.contactNumber} → {formData.contactNumber}
                </p>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave}>
              Confirm & Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProfilePage;
