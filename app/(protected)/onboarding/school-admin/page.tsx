import { SchoolOnboardingForm } from "@/components/onboarding-components/school-admin-onboarding";
import IconGurucoolLight from "@/public/gurucool/full_light.png";
import GurucoolLogo from "@/public/gurucool/logo.png";
import IconGurucoolDark from "@/public/gurucool/logo_full_dark.png";
import { IconQuoteFilled } from "@tabler/icons-react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[40%_60%] font-[montserrat]">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-white text-neutral-900 dark:bg-[#161616] dark:text-white border-r border-neutral-200 dark:border-neutral-700/80 w-full max-lg:mx-auto">
        <div className="flex justify-center gap-2 md:justify-start">
          {/* <ModeToggle /> */}
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="absolute">
              {/* Light Mode Logo */}
              <Image
                src={IconGurucoolLight}
                alt="Gurucool Logo Light"
                width={200}
                height={200}
                className="block dark:hidden"
              />

              {/* Dark Mode Logo */}
              <Image
                src={IconGurucoolDark}
                alt="Gurucool Logo Dark"
                width={200}
                height={200}
                className="hidden dark:block"
              />
            </div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">
            <SchoolOnboardingForm />
          </div>
        </div>
      </div>

      <div className="relative hidden lg:flex items-center justify-center bg-slate-50 text-neutral-900 dark:bg-neutral-950 dark:text-white w-full">
        <div className="relative max-w-3xl px-10">
          {/* Background Icon */}
          <IconQuoteFilled
            size={150}
            className="absolute -left-4 -top-12 text-black/10 dark:text-white/10 z-0 rotate-180"
            aria-hidden
          />

          {/* Text */}
          <h2 className="relative z-10 text-3xl font-semibold text-left leading-snug p-4">
            Unlock the power of curiosity. Gurucool AI transforms learning into
            a journey of discovery, growth, and limitless possibilities.
          </h2>

          <div className="flex flex-row items-center mt-2 relative gap-4">
            <Image
              alt="logo"
              src={GurucoolLogo}
              width={40}
              height={40}
              aria-hidden
            />
            <p className="text-sm text-muted-foreground">Team GurucoolAI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
