import { cacheLife, cacheTag } from "next/cache";

import WorldList from "@/components/world/world-list";
import { caller } from "@/utils/trpc/server";

const getWorlds = async () => {
  "use cache";
  cacheTag("worlds");
  cacheLife("hours");

  const data = await caller.world.list();

  return data;
};

export default async function Home() {
  const data = await getWorlds();
  return <WorldList data={data.data} />;
}
