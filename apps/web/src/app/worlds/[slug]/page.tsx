import { notFound } from "next/navigation";

import ChunkGrid from "@/components/world/chunk-grid";
import { getCaller } from "@/utils/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const parseWorldId = (slug: string): bigint | null => {
  try {
    const worldId = BigInt(slug);
    if (worldId < 1) {
      return null;
    }
    return worldId;
  } catch {
    return null;
  }
};

export default async function WorldPage({ params }: PageProps) {
  const { slug } = await params;
  const worldId = parseWorldId(slug);

  if (worldId === null) {
    console.error(`Invalid world ID: ${slug}`);
    notFound();
  }

  const worldResult = await getCaller().world.get({ worldId });

  if (!worldResult.data) {
    console.error(`World not found: ${worldId}`);
    notFound();
  }

  return (
    <ChunkGrid worldId={worldId} world={worldResult.data} initialChunks={[]} />
  );
}
