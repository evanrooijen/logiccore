"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { useWorldMutations } from "@/lib/world";

const deleteWorldSchema = z.object({
  worldId: z.bigint(),
});

interface DeleteWorldFormProps {
  worldId: bigint;
}

export const DeleteWorldForm = ({ worldId }: DeleteWorldFormProps) => {
  const { deleteWorld } = useWorldMutations();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      worldId,
    },
    validators: {
      onSubmit: deleteWorldSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);

      try {
        await deleteWorld(value.worldId);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Failed to delete world"
        );
      }
    },
  });

  return (
    <div className="flex flex-col gap-1">
      {submitError ? (
        <p className="text-destructive text-xs">{submitError}</p>
      ) : null}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              aria-disabled={isSubmitting}
              disabled={isSubmitting}
              type="submit"
              variant="destructive"
            >
              Delete
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};
