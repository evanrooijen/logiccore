import { createNoise2D } from "simplex-noise";

import {
  createRegionName,
  getBiome,
  getGeo,
  getRichness,
  sampleTerrain,
} from "./generators";
import type { TerrainNoises } from "./generators";
import type { ChunkData, OreType, WorldData } from "./types";
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
      const biome = getBiome(terrain);

      /* =====================================================
         GEOLOGY
      ===================================================== */

      const geology = getGeo(terrain);

      /* =====================================================
         BASE RICHNESS
      ===================================================== */

      let richness = getRichness(
        richnessNoise,
        worldX,
        worldY,
        terrain,
        geology
      );

      /* =====================================================
         ORE MODIFIERS
      ===================================================== */

      const oreModifiers: Record<OreType, number> = {
        gold: 1,
        silver: 1,
        copper: 1,
        iron: 1,
        coal: 1,
      };

      // geological specialization
      switch (geology) {
        case "granite": {
          oreModifiers.gold += 0.5;
          break;
        }

        case "quartzite": {
          oreModifiers.silver += 0.4;
          break;
        }

        case "basalt": {
          oreModifiers.copper += 0.6;
          oreModifiers.iron += 0.3;
          break;
        }

        case "shale": {
          oreModifiers.coal += 0.7;
          break;
        }
        default: {
          break;
        }
      }

      // biome specialization
      switch (biome) {
        case "mountains": {
          oreModifiers.gold += 0.3;
          break;
        }
        case "volcanic": {
          oreModifiers.copper += 0.3;
          break;
        }
        case "ancient_seabed": {
          oreModifiers.coal += 0.2;
          break;
        }
        default: {
          break;
        }
      }

      if (terrain.tectonic > 0.72) {
        oreModifiers.iron += 0.2;
        oreModifiers.copper += 0.15;
      }

      if (terrain.erosion > 0.68) {
        oreModifiers.silver += 0.15;
      }

      /* =====================================================
         RARE ANOMALIES
      ===================================================== */

      const anomaly = oreNoise(worldX * 0.0009, worldY * 0.0009);

      switch (true) {
        case anomaly > 0.82: {
          oreModifiers.gold += 1.5;
          richness *= 1.8;
          break;
        }
        case anomaly < -0.8: {
          oreModifiers.silver += 1.2;
          break;
        }
        default: {
          break;
        }
      }

      richness = Math.min(richness, 1);

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
