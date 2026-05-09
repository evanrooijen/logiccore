import { createNoise2D } from "simplex-noise";

import { createRegionName, getBiome, getGeo, getRichness } from "./generators";
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

  const biomeNoise = createNoise2D(rng);
  const geologyNoise = createNoise2D(rng);
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

      const biome = getBiome(biomeNoise, worldX, worldY);

      /* =====================================================
         GEOLOGY
      ===================================================== */

      const geology = getGeo(geologyNoise, worldX, worldY);

      /* =====================================================
         BASE RICHNESS
      ===================================================== */

      let richness = getRichness(richnessNoise, worldX, worldY);

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
      if (biome === "mountains") {
        oreModifiers.gold += 0.3;
      }

      if (biome === "volcanic") {
        oreModifiers.copper += 0.3;
      }

      /* =====================================================
         RARE ANOMALIES
      ===================================================== */

      const anomaly = oreNoise(worldX * 0.0009, worldY * 0.0009);

      if (anomaly > 0.82) {
        oreModifiers.gold += 1.5;
        richness *= 1.8;
      }

      if (anomaly < -0.8) {
        oreModifiers.silver += 1.2;
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
