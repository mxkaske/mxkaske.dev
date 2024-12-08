"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { subscribe } from "./action";
import { useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { generateServerActionPromise } from "@/lib/promise";
import { UnsubscribeDialog } from "./unsubscribe-dialog";

// How to avoid reseting the form: https://github.com/facebook/react/issues/29034#issuecomment-2398001316
// Send toast notification on submission: https://github.com/vercel/next.js/discussions/67660

export function NewsletterForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget as typeof event.currentTarget & {
      email: HTMLInputElement;
    };
    const values = { email: form.email.value };

    startTransition(() => {
      toast.promise(generateServerActionPromise(subscribe(values)), {
        success: (value) => {
          return value?.message ?? "Thanks for subscribing!";
        },
        loading: "Subscribing...",
        error: (error) => {
          if (error instanceof Error) return error.message;
          return "Something went wrong. Please try again.";
        },
      });
    });
  }

  return (
    <div className="space-y-1.5">
      <form onSubmit={handleSubmit}>
        <div className="w-full flex items-end gap-2">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="subscribe-email">Email</Label>
            <Input
              id="subscribe-email"
              name="email"
              type="email"
              placeholder="max@openstatus.dev"
              className="w-full"
              required
            />
          </div>
          <Button disabled={isPending}>
            Subscribe
            {isPending ? (
              <LoaderCircle className="animate-spin ml-1 h-4 w-4" />
            ) : null}
          </Button>
        </div>
      </form>
      <p className="text-muted-foreground text-xs max-w-lg">
        Thanks for your trust. You will rarely receive an email from me. But
        when you do, it&apos;s worth it.{" "}
        <em className="text-foreground">
          Your email is stored in a simple redis db.
        </em>{" "}
        You can <UnsubscribeDialog /> at any time.
      </p>
    </div>
  );
}
