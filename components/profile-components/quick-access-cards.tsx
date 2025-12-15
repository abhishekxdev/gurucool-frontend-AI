"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Award, BarChart3, FileText } from "lucide-react";
import { Certificate, EarnedBadge } from "./profile-dialogs";

interface QuickAccessCardsProps {
  certificates: Certificate[];
  badges: EarnedBadge[];
  onCertificatesClick: () => void;
  onBadgesClick: () => void;
  onStatsClick: () => void;
}

export function QuickAccessCards({
  certificates,
  badges,
  onCertificatesClick,
  onBadgesClick,
  onStatsClick,
}: QuickAccessCardsProps) {
  return (
    <div className="space-y-4 font-[montserrat]">
      {/* Certificates Card */}
      <Card
        className="cursor-pointer group overflow-hidden border-border/50 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300"
        onClick={onCertificatesClick}
      >
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 group-hover:scale-105 transition-transform duration-300">
                <FileText className="size-6 text-green-500" />
              </div>
              <div className="absolute -top-1 -right-1 size-5 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-green-500/30">
                {certificates.length}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground group-hover:text-green-400 transition-colors">
                Certificates
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {certificates.filter((c) => c.type === "earned").length} earned,{" "}
                {certificates.filter((c) => c.type === "optional").length}{" "}
                optional
              </p>
            </div>
            <div className="text-muted-foreground group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-300">
              →
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Card */}
      <Card
        className="cursor-pointer group overflow-hidden border-border/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300"
        onClick={onBadgesClick}
      >
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                <Award className="size-6 text-amber-500" />
              </div>
              <div className="absolute -top-1 -right-1 size-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-amber-500/30">
                {badges.length}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground group-hover:text-amber-400 transition-colors">
                Earned Badges
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                From PD assessments
              </p>
            </div>
            <div className="text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-300">
              →
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Card */}
      <Card
        className="cursor-pointer group overflow-hidden border-border/50 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
        onClick={onStatsClick}
      >
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <BarChart3 className="size-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground group-hover:text-blue-400 transition-colors">
                Quick Stats
              </h3>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="px-2 py-0.5 text-xs rounded-md bg-amber-500/10 text-amber-400 font-medium">
                  {badges.length} badges
                </span>
                <span className="px-2 py-0.5 text-xs rounded-md bg-green-500/10 text-green-400 font-medium">
                  {certificates.filter((c) => c.type === "earned").length} certs
                </span>
              </div>
            </div>
            <div className="text-muted-foreground group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300">
              →
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
