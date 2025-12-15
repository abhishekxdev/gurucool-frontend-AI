"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { IconBook } from "@tabler/icons-react";
import { GraduationCap, School } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";
import { useState } from "react";
import IconGurucoolLight from "@/public/gurucool/full_light.png";
import GurucoolLogo from "@/public/gurucool/logo.png";
import IconGurucoolDark from "@/public/gurucool/logo_full_dark.png";

export function RoleSelection({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [selectedRole, setSelectedRole] = useState<
    "teacher" | "school-admin" | null
  >(null);
  const router = useTransitionRouter();

  const handleNext = () => {
    if (selectedRole === "teacher") {
      router.push("/signup/teacher");
    } else if (selectedRole === "school-admin") {
      router.push("/signup/school-admin");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="overflow-hidden p-0">
        <div className=" p-0  w-full">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6 font-[montserrat]">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  Welcome to GuruCool
                </h1>
                <p className="text-muted-foreground text-balance">
                  Select your role to continue with registration
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8">
                {/* Teacher Card */}
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedRole === "teacher" && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedRole("teacher")}
                >
                  <CardHeader>
                    <div className="flex flex-col items-center gap-3">
                      <div className=" text-primary flex p-2 items-center justify-center rounded-lg">
                        <IconBook className="size-14" strokeWidth={1} />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg">Teacher</div>
                        <p className="text-sm text-muted-foreground">
                          Learn and grow
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* School Admin Card */}
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedRole === "school-admin" && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedRole("school-admin")}
                >
                  <CardHeader>
                    <div className="flex flex-col items-center gap-3">
                      <div className=" text-primary flex p-2 items-center justify-center rounded-lg">
                        <School className="size-14" strokeWidth={1} />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg">
                          School Admin
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Manage & verify
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>

              <Button
                onClick={handleNext}
                disabled={!selectedRole}
                className="w-full"
              >
                Next
              </Button>

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Sign in
                </Link>
              </FieldDescription>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
