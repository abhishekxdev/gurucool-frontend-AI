"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { useSchoolAdmin } from "@/hooks/useRoleGuard";
import { LogOut } from "lucide-react";

const PendingApprovalPage = () => {
  const { logout } = useAuth();
  const user = useSchoolAdmin();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30 font-[montserrat]">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Spinner className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Pending Approval</CardTitle>
          <CardDescription className="text-base">
            Your account is currently under review. Once the admin has approved
            your request, you will be automatically redirected to your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6 space-y-4">
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Waiting for approval...
            </p>
          </div>

          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApprovalPage;
