"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { GalleryVerticalEndIcon } from "lucide-react"
import { GithubIcon } from "@/components/icons/lucide-github"
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { signInWithGithub } from "@/features/auth/actions";

type GithubLoginFormProps = React.ComponentProps<"div"> & {
  callbackUrl?: string;
};

function GithubSubmitButton() {
  const { pending } = useFormStatus();

  let buttonLabel = "Continue with GitHub";
  let buttonIcon = <GithubIcon className="mr-2 size-4" />;

  if (pending) {
    buttonLabel = "Redirecting...";
    buttonIcon = <Loader2 className="mr-2 size-4 animate-spin" />;
  }

  return (
    <Button
      variant="outline"
      type="submit"
      className="w-full"
      disabled={pending}
    >
      {buttonIcon}
      {buttonLabel}
    </Button>
  );
}

export function GithubLoginForm({
  className,
  callbackUrl,
  ...props
}: GithubLoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <a
            href="#"
            className="flex flex-col items-center gap-2 font-medium"
          >
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              {/* add logo later */}
              <GalleryVerticalEndIcon className="size-6" />
            </div>
            <span className="sr-only">Codefox</span>
          </a>
          <h1 className="text-xl font-bold">Welcome to Codefox</h1>
          <FieldDescription>
            Sign in to analyze and review your repositories.
          </FieldDescription>
        </div>

        <form action={signInWithGithub} className="w-full">
          {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}

          <Field className="grid gap-4">
            <GithubSubmitButton />
          </Field>
        </form>
      </FieldGroup>

      <FieldDescription className="px-3 text-center">
        By clicking continue, you agree to our <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
