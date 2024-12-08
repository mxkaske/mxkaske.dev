import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateServerActionPromise } from "@/lib/promise";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { unsubscribe } from "./action";
import { LoaderCircle } from "lucide-react";
import { DialogTriggerProps } from "@radix-ui/react-dialog";

export function UnsubscribeDialog(props: DialogTriggerProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget as typeof event.currentTarget & {
      email: HTMLInputElement;
    };
    const values = { email: form.email.value };

    startTransition(() => {
      toast.promise(generateServerActionPromise(unsubscribe(values)), {
        success: (value) => {
          setOpen(false);
          return (
            value?.message ??
            "Unsubscribed! Feel free to subscribe again at any time."
          );
        },
        loading: "Unsubscribing...",
        error: (error) => {
          if (error instanceof Error) return error.message;
          return "Something went wrong. Please try again.";
        },
      });
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger {...props}>unsubscribe</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unsubscribe from the Newsletter</DialogTitle>
          <DialogDescription>
            No hard feelings! Enter your email to unsubscribe. You can always
            subscribe again later.
          </DialogDescription>
        </DialogHeader>
        <form id="unsubscribe" onSubmit={handleSubmit} className="py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unsubscribe-email">Email</Label>
            <Input
              id="unsubscribe-email"
              name="email"
              type="email"
              placeholder="max@openstatus.dev"
              className="col-span-3"
              required
            />
          </div>
        </form>
        <DialogFooter>
          <Button form="unsubscribe" type="submit" disabled={isPending}>
            Unsubscribe
            {isPending ? (
              <LoaderCircle className="animate-spin ml-1 h-4 w-4" />
            ) : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
