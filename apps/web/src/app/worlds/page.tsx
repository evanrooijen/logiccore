import WorldList from "@/components/world/world-list";
import { getCaller } from "@/utils/trpc/server";

export const dynamic = "force-dynamic";

const getWorlds = async () => {
  const data = await getCaller().world.list();

  return data;
};

export default async function Home() {
  const data = await getWorlds();
  return <WorldList initialData={data.data} />;
}
