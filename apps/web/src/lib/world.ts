"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { caller } from "./../utils/trpc/server";

export const generateWorldAction = async (
  _previousState: unknown,
  formData: FormData
) => {
  const value = formData.get("seed");

  const parsed = z.coerce.number().nonnegative().safeParse(value);

  const seed = parsed.success ? parsed.data : 633_465;

  const result = await caller.world.add({ name: `World ${seed}` });
  revalidateTag("worlds", "max");
  revalidatePath("/worlds");
  return result;
};

export const deleteWorldAction = async (formData: FormData) => {
  const value = formData.get("worldId");

  const parsed = z.coerce.bigint().positive().parse(value);

  console.dir({ parsed });

  await caller.world.delete({ worldId: parsed });
  revalidateTag("worlds", "max");
  revalidatePath("/worlds");
};
