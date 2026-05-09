"use server";

import { z } from "zod";

import { caller } from "./../utils/trpc/server";

export const generateWorldAction = async (
  _previousState: unknown,
  formData: FormData
) => {
  const value = formData.get("seed");

  const parsed = z.coerce.number().nonnegative().safeParse(value);

  console.dir(parsed);

  const seed = parsed.success ? parsed.data : 633_465;

  const result = await caller.generate({ seed });
  return result;
};
