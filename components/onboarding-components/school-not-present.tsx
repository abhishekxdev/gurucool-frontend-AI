"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const newSchoolRequestSchema = z.object({
  schoolName: z
    .string()
    .min(2, "School name must be at least 2 characters")
    .max(100, "School name must be less than 100 characters"),
  schoolEmail: z
    .string()
    .email("Please enter a valid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid school email"
    ),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d\s\-\+\(\)]+$/, "Please enter a valid phone number"),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must be less than 200 characters"),
  contactPersonName: z
    .string()
    .min(2, "Contact person name must be at least 2 characters")
    .max(100, "Contact person name must be less than 100 characters"),
});

type NewSchoolRequestData = z.infer<typeof newSchoolRequestSchema>;

interface SchoolNotPresentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchoolAdded?: (schoolName: string) => void;
}

const SchoolNotPresent = ({
  open,
  onOpenChange,
  onSchoolAdded,
}: SchoolNotPresentProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewSchoolRequestData>({
    resolver: zodResolver(newSchoolRequestSchema),
    defaultValues: {
      schoolName: "",
      schoolEmail: "",
      phone: "",
      address: "",
      contactPersonName: "",
    },
  });

  const onSubmit = async (data: NewSchoolRequestData) => {
    try {
      // Simulate API call to submit school request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("School request submitted!", {
        description: "We'll review your request and get back to you soon",
      });

      // Call the callback to add the school to the dropdown
      if (onSchoolAdded) {
        onSchoolAdded(data.schoolName);
      }

      onOpenChange(false);
      reset();
    } catch (error) {
      toast.error("Failed to submit request", {
        description: "Please try again",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-[525px] font-[montserrat] p-4">
      <DialogHeader>
        <DialogTitle>New School Request</DialogTitle>
        <DialogDescription>
        Fill in the details below to request a new school to be added to our
        system.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
        <Field>
          <FieldLabel htmlFor="schoolName">School Name</FieldLabel>
          <Input
          id="schoolName"
          placeholder="Springfield Elementary School"
          {...register("schoolName")}
          />
          {errors.schoolName && (
          <p className="text-sm text-red-500 mt-1">
            {errors.schoolName.message}
          </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="schoolEmail">School Email</FieldLabel>
          <Input
          id="schoolEmail"
          type="email"
          placeholder="admin@school.edu"
          {...register("schoolEmail")}
          />
          {errors.schoolEmail && (
          <p className="text-sm text-red-500 mt-1">
            {errors.schoolEmail.message}
          </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          {...register("phone")}
          />
          {errors.phone && (
          <p className="text-sm text-red-500 mt-1">
            {errors.phone.message}
          </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="address">Address</FieldLabel>
          <Input
          id="address"
          placeholder="123 Main St, Springfield, IL 62701"
          {...register("address")}
          />
          {errors.address && (
          <p className="text-sm text-red-500 mt-1">
            {errors.address.message}
          </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="contactPersonName">
          Contact Person Name
          </FieldLabel>
          <Input
          id="contactPersonName"
          placeholder="John Doe"
          {...register("contactPersonName")}
          />
          {errors.contactPersonName && (
          <p className="text-sm text-red-500 mt-1">
            {errors.contactPersonName.message}
          </p>
          )}
        </Field>
        </FieldGroup>

        <DialogFooter className="mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
          <>
            <Spinner className="mr-2" />
            Submitting...
          </>
          ) : (
          "Submit Request"
          )}
        </Button>
        </DialogFooter>
      </form>
      </DialogContent>
    </Dialog>
  );
};

export default SchoolNotPresent;
