"use client";

import { useActionState } from "react";

import { generateWorldAction } from "@/lib/world";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const GenerateWorldForm = () => {
  const [state, submit, isPending] = useActionState(generateWorldAction, null);

  return (
    <div className="flex flex-col gap-4 @container">
      <div className="text-muted-foreground text-xs">
        {typeof state?.worldId === "number" ? (
          <p className="font-medium">Saved as world #{state.worldId}</p>
        ) : null}
      </div>
      <pre className="max-h-48 overflow-auto text-xs">
        {state?.data ? JSON.stringify(state.data, null, 2) : null}
      </pre>
      <form className="flex flex-col gap-y-2 @md:max-w-sm" action={submit}>
        <Input type="number" name="seed" />
        <Button disabled={isPending} type="submit">
          Generate
        </Button>
      </form>
    </div>
  );
};
