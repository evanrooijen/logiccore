"use client";

import { tables } from "@logiccore/spacetimedb";
import type { Chunk, World } from "@logiccore/spacetimedb/types";
import Link from "next/link";
import { useMemo } from "react";
import { useTable } from "spacetimedb/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatEnumTag, getBiomeColor } from "@/lib/chunk-display";
import { cn } from "@/lib/utils";

interface ChunkGridProps {
  worldId: bigint;
  world: World;
  initialChunks: Chunk[];
}

const BIOME_LEGEND = [
  "Plains",
  "Mountains",
  "Desert",
  "Volcanic",
  "AncientSeabed",
] as const;

const ChunkGrid = ({ worldId, world, initialChunks }: ChunkGridProps) => {
  const chunkQuery = useMemo(
    () => tables.chunk.where((row) => row.worldId.eq(worldId)),
    [worldId]
  );

  const [chunks, isReady] = useTable(chunkQuery);
  const displayChunks = isReady ? chunks : initialChunks;

  const chunkByCoord = useMemo(() => {
    const map = new Map<string, Chunk>();
    for (const chunk of displayChunks) {
      map.set(`${chunk.chunkX},${chunk.chunkY}`, chunk);
    }
    return map;
  }, [displayChunks]);

  const columns = Array.from({ length: world.chunksWide }, (_, index) => index);
  const rows = Array.from({ length: world.chunksHigh }, (_, index) => index);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Button
            nativeButton={false}
            variant="outline"
            size="sm"
            render={<Link href="/worlds">Back to worlds</Link>}
          />
          <h1 className="mt-3 text-2xl font-semibold">
            World #{worldId.toString()}
          </h1>
          <p className="text-muted-foreground text-sm">
            Seed {world.seed} · {world.size}×{world.size} · {world.chunkSize}px
            chunks · {displayChunks.length.toLocaleString()} loaded
          </p>
        </div>
        <ul className="flex flex-wrap gap-3 text-xs">
          {BIOME_LEGEND.map((tag) => (
            <li key={tag} className="flex items-center gap-1.5">
              <span
                className={cn("size-3 rounded-sm", getBiomeColor(tag))}
                aria-hidden
              />
              {formatEnumTag(tag)}
            </li>
          ))}
        </ul>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Chunk map</CardTitle>
          <CardDescription>
            Hover a cell for biome, geology, richness, and region name.
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto p-4 pt-0">
          <div
            className="inline-grid gap-px bg-border"
            style={{
              gridTemplateColumns: `repeat(${world.chunksWide}, minmax(0, 1fr))`,
            }}
          >
            {rows.map((chunkY) =>
              columns.map((chunkX) => {
                const chunk = chunkByCoord.get(`${chunkX},${chunkY}`);
                const biomeTag = chunk?.biome.tag ?? "Unknown";

                return (
                  <div
                    key={`${chunkX}-${chunkY}`}
                    title={
                      chunk
                        ? `${formatEnumTag(chunk.biome.tag)} · ${formatEnumTag(chunk.geology.tag)}\n${chunk.regionName}\nRichness ${chunk.richness.toFixed(2)}`
                        : "Empty"
                    }
                    className={cn(
                      "size-2 sm:size-2.5",
                      getBiomeColor(biomeTag)
                    )}
                  />
                );
              })
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChunkGrid;
