"use client"

import { Button } from "@/components/ui/button"
import {  useFormStatus } from 'react-dom';
import { LoadingAnimation } from "./loading-animation";

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-20 disabled:opacity-100"
    >
      {pending ? <LoadingAnimation /> : "Join"}
    </Button>
  )
}