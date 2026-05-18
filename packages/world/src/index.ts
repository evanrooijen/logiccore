import { createNoise2D } from "simplex-noise";

import { createRegionName, getGeo, sampleTerrain } from "./generators";
import type { TerrainNoises } from "./generators";
import type { ChunkData, WorldData } from "./types";
import { mulberry32 } from "./utils";

export const generateWorld = (
  seed: number,
  size: number,
  chunkSize: number
): WorldData => {
  /* empty */
  if (size % chunkSize !== 0) {
    throw new Error("World size must divide evenly by chunk size");
  }

  const rng = mulberry32(seed);

  const terrainNoises: TerrainNoises = {
    continental: createNoise2D(rng),
    detail: createNoise2D(rng),
    erosion: createNoise2D(rng),
    moisture: createNoise2D(rng),
    tectonic: createNoise2D(rng),
  };
  const richnessNoise = createNoise2D(rng);
  const oreNoise = createNoise2D(rng);

  const chunksWide = size / chunkSize;
  const chunksHigh = size / chunkSize;

  const chunks: ChunkData[] = [];

  for (let chunkX = 0; chunkX < chunksWide; chunkX += 1) {
    for (let chunkY = 0; chunkY < chunksHigh; chunkY += 1) {
      /* =====================================================
         WORLD POSITION
      ===================================================== */

      const worldX = chunkX * chunkSize;

      const worldY = chunkY * chunkSize;

      /* =====================================================
         BIOME
      ===================================================== */

      const terrain = sampleTerrain(
        terrainNoises,
        worldX,
        worldY,
        size,
        chunkSize
      );
      const biome = terrain.getBiome();

      /* =====================================================
         GEOLOGY
      ===================================================== */

      const geology = getGeo(terrain);

      /* =====================================================
         RARE ANOMALIES
      ===================================================== */

      const anomaly = oreNoise(worldX * 0.0009, worldY * 0.0009);

      /* =====================================================
         BASE RICHNESS
      ===================================================== */

      const richness = terrain.getRichness({
        anomaly,
        geology,
        noise: richnessNoise,
        worldX,
        worldY,
      });

      /* =====================================================
         ORE MODIFIERS
      ===================================================== */

      const oreModifiers = terrain.getOreModifiers({ anomaly, geology });

      /* =====================================================
         REGION NAMING
      ===================================================== */

      const regionName = createRegionName(seed, chunkX, chunkY);

      /* =====================================================
         FINAL CHUNK
      ===================================================== */

      chunks.push({
        chunkX,
        chunkY,

        biome,
        geology,

        richness,

        oreModifiers,

        regionName,
      });
    }
  }

  return {
    seed,

    size,

    chunkSize,

    chunksWide,
    chunksHigh,

    chunks,
  };
};

export type { Biome, ChunkData, OreType, RockType, WorldData } from "./types";
