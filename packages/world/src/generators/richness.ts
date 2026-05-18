import type { NoiseFunction2D } from "simplex-noise";

import type { RockType } from "../types";
import type { TerrainSample } from "./terrain";

const clamp01 = (value: number): number => Math.min(Math.max(value, 0), 1);

const GEOLOGY_POTENTIAL = {
  basalt: 0.82,
  granite: 0.74,
  limestone: 0.42,
  quartzite: 0.62,
  shale: 0.48,
} as const satisfies Record<RockType, number>;

export const getRichness = (
  noise: NoiseFunction2D,
  worldX: number,
  worldY: number,
  terrain: TerrainSample,
  geology: RockType
) => {
  const depositNoise = (noise(worldX * 0.003, worldY * 0.003) + 1) / 2;
  const faultContact =
    terrain.tectonic * (1 - Math.abs(terrain.elevation - 0.58));
  const exposedStrata = terrain.erosion * 0.45 + terrain.elevation * 0.28;
  const geologyPotential = GEOLOGY_POTENTIAL[geology];

  let richness =
    depositNoise * 0.34 +
    faultContact * 0.28 +
    exposedStrata * 0.18 +
    geologyPotential * 0.2;

  // Exaggerate rarity while keeping ore-bearing areas tied to terrain context.
  richness **= 2.2;

  return clamp01(richness);
};
