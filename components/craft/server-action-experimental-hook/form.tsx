"use client";

/* eslint-disable react/no-unescaped-entities */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { submitEmail } from "./actions";
import { SubmitButton } from "./submit-button";
import { Suspense, useCallback, useEffect } from "react";
import { toast } from "sonner";

export function Form() {
  return (
    <Suspense>
      <FormWithoutSuspense />
    </Suspense>
  );
}

export function FormWithoutSuspense() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const resetSearchParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    console.log({ params });
    params.delete("email");
    params.delete("form");
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  useEffect(() => {
    const form = searchParams.has("form") && searchParams.get("form");
    const email = searchParams.has("email") && searchParams.get("email");

    if (form === "success" && email) {
      toast("Joined Waitlist", {
        description: `Added ${email} to the fake waitlist.`,
      });
      resetSearchParams();
    }
  }, [searchParams, resetSearchParams]);

  return (
    <form
      action={submitEmail}
      className="grid gap-1.5 w-full max-w-sm not-prose"
    >
      <div className="grid gap-1.5 w-full">
        <div className="flex gap-1.5 items-end w-full">
          <div className="grid gap-1.5 w-full">
            <Label htmlFor="email">Email</Label>
            <Input
              required
              name="email"
              id="email"
              type="email"
              placeholder="me@domain.com"
            />
          </div>
          <SubmitButton />
        </div>
        <p className="text-xs text-muted-foreground">
          Enter any fake email schema.
        </p>
      </div>
    </form>
  );
}
