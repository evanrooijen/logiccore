"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";

import { useWorldMutations } from "@/lib/world";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

const generateWorldSchema = z.object({
  seed: z.number().nonnegative(),
});

function formatFieldError(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }
  if (
    error !== null &&
    error !== undefined &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "Invalid value";
}

function formatFieldErrors(errors: readonly unknown[]): string {
  return errors.map(formatFieldError).join(", ");
}

export const GenerateWorldForm = () => {
  const { addWorld } = useWorldMutations();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      seed: 0,
    },
    validators: {
      onSubmit: generateWorldSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);

      try {
        await addWorld(`World ${value.seed}`);
        form.reset();
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Failed to create world"
        );
      }
    },
  });

  return (
    <div className="flex flex-col gap-4 @container">
      {submitError ? (
        <p className="text-destructive text-xs">{submitError}</p>
      ) : null}
      <form
        className="flex flex-col gap-y-2 @md:max-w-sm"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="seed">
          {(field) => (
            <>
              <Input
                aria-invalid={field.state.meta.isValid ? undefined : true}
                name={field.name}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.valueAsNumber)
                }
                type="number"
                value={Number.isNaN(field.state.value) ? "" : field.state.value}
              />
              {field.state.meta.isValid ? null : (
                <p className="text-destructive text-xs" role="alert">
                  {formatFieldErrors(field.state.meta.errors)}
                </p>
              )}
            </>
          )}
        </form.Field>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              aria-disabled={!canSubmit || isSubmitting}
              disabled={!canSubmit || isSubmitting}
              type="submit"
            >
              Generate
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};
