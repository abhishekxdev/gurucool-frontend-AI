"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle2, MapPin, Phone, XCircle } from "lucide-react";

// School details interface for the card
export interface SchoolDetailsCardProps {
  name: string;
  address: string;
  phone: string;
  officialEmail: string;
  isVerified: boolean;
}

export function SchoolDetailsCard({
  name,
  address,
  phone,
  officialEmail,
  isVerified,
}: SchoolDetailsCardProps) {
  return (
    <Card className="font-[montserrat] overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border/50">
        <CardTitle className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-primary/10">
            <MapPin className="size-5 text-primary" />
          </span>
          School Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* School Name */}
        <div className="space-y-2.5">
          <Label className="text-muted-foreground font-medium">
            School Name
          </Label>
          <p className="text-base py-2.5 px-3 rounded-xl bg-muted/30 border border-border/30">
            {name}
          </p>
        </div>

        {/* Address */}
        <div className="space-y-2.5">
          <Label className="flex items-center gap-2 text-muted-foreground font-medium">
            <MapPin className="size-4" />
            Address
          </Label>
          <p className="text-base py-2.5 px-3 rounded-xl bg-muted/30 border border-border/30">
            {address}
          </p>
        </div>

        {/* Phone Number */}
        <div className="space-y-2.5">
          <Label className="flex items-center gap-2 text-muted-foreground font-medium">
            <Phone className="size-4" />
            Phone Number
          </Label>
          <p className="text-base py-2.5 px-3 rounded-xl bg-muted/30 border border-border/30">
            {phone}
          </p>
        </div>

        {/* Official Email */}
        <div className="space-y-2.5">
          <Label className="text-muted-foreground font-medium">
            Official Email
          </Label>
          <p className="text-base py-2.5 px-3 rounded-xl bg-muted/30 border border-border/30">
            {officialEmail}
          </p>
        </div>

        {/* Verification Status */}
        <div className="space-y-2.5">
          <Label className="text-muted-foreground font-medium">
            Verification Status
          </Label>
          <div>
            <Badge
              variant={isVerified ? "outline" : "destructive"}
              className={`px-3 py-1 font-medium ${
                isVerified
                  ? "border-green-700/50 bg-green-950/30 text-green-400"
                  : "border-red-700/50 bg-red-950/30 text-red-400"
              }`}
            >
              {isVerified ? (
                <span className="flex items-center">
                  <CheckCircle2 className="size-3.5 mr-1.5" /> Verified
                </span>
              ) : (
                <span className="flex items-center">
                  <XCircle className="size-3.5 mr-1.5" /> Not Verified
                </span>
              )}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
