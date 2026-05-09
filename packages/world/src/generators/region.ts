import { mulberry32 } from "../utils";

const PREFIXES = [
  "Ash",
  "Red",
  "Black",
  "Iron",
  "Gold",
  "Silver",
  "Broken",
  "Hollow",
  "Deep",
  "North",
  "South",
] as const;

const SUFFIXES = [
  "Basin",
  "Ridge",
  "Expanse",
  "Shelf",
  "Reach",
  "Fault",
  "Valley",
  "Scar",
  "Frontier",
] as const;

const regionGridSize = 8 as const;

export function createRegionName(
  seed: number,
  chunkX: number,
  chunkY: number
): string {
  const regionX = Math.floor(chunkX / regionGridSize);

  const regionY = Math.floor(chunkY / regionGridSize);

  // deterministic region seed
  const regionSeed = seed + regionX * 99_991 + regionY * 77_713;

  const rng = mulberry32(regionSeed);

  const prefix = PREFIXES[Math.floor(rng() * PREFIXES.length)];

  const suffix = SUFFIXES[Math.floor(rng() * SUFFIXES.length)];

  return `${prefix} ${suffix}`;
}
