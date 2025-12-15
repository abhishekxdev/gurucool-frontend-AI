"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "next-view-transitions";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps extends React.ComponentProps<"form"> {
  role?: "teacher" | "school_admin";
}

export function SignupForm({ className, role, ...props }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      await signUp({
        email: data.email,
        password: data.password,
        name: data.name,
        role: role || "teacher",
      });
      toast.success("Account created successfully!", {
        description: "Welcome to GuruCool",
      });
    } catch (error: any) {
      toast.error("Sign up failed", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6 font-[montserrat]", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
          {!errors.email && (
            <FieldDescription>
              We&apos;ll use this to contact you. We will not share your email
              with anyone else.
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
          {!errors.password && (
            <FieldDescription>
              Must be at least 8 characters long with uppercase, lowercase, and
              number.
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
          {!errors.confirmPassword && (
            <FieldDescription>Please confirm your password.</FieldDescription>
          )}
        </Field>
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms-2"
            checked={acceptTerms}
            onCheckedChange={(checked) =>
              setValue("acceptTerms", checked as boolean)
            }
          />
          <div className="grid gap-2">
            <Label htmlFor="terms-2">Accept terms and conditions</Label>
            <p className="text-muted-foreground text-sm">
              By clicking this checkbox, you agree to the terms and conditions.
            </p>
            {errors.acceptTerms && (
              <p className="text-sm text-red-500">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>
        </div>
        <Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Please wait...
              </>
            ) : (
              <>
                Create Account{" "}
                {role === "teacher"
                  ? "for Teacher"
                  : role === "school_admin"
                  ? "for School Admin"
                  : ""}
              </>
            )}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link href="/login">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
