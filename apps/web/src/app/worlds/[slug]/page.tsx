import { notFound } from "next/navigation";

import ChunkGrid from "@/components/world/chunk-grid";
import { caller } from "@/utils/trpc/server";

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
    notFound();
  }

  const [worldResult, chunksResult] = await Promise.all([
    caller.world.get({ worldId }),
    caller.world.chunks({ worldId }),
  ]);

  if (!worldResult.data) {
    notFound();
  }

  return (
    <ChunkGrid
      worldId={worldId}
      world={worldResult.data}
      initialChunks={[...chunksResult.data]}
    />
  );
}
