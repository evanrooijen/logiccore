export type Biome =
  | "plains"
  | "mountains"
  | "desert"
  | "volcanic"
  | "ancient_seabed";

export type RockType =
  | "granite"
  | "basalt"
  | "limestone"
  | "shale"
  | "quartzite";

export type OreType = "gold" | "silver" | "copper" | "iron" | "coal";

export interface ChunkData {
  chunkX: number;
  chunkY: number;

  biome: Biome;
  geology: RockType;

  richness: number;

  oreModifiers: Record<OreType, number>;

  regionName: string;
}

export interface WorldData {
  seed: number;

  size: number;

  chunkSize: number;

  chunksWide: number;
  chunksHigh: number;

  chunks: ChunkData[];
}
