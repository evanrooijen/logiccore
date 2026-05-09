import type { NoiseFunction2D } from "simplex-noise";

import type { Biome } from "../types";

export const getBiome = (
  noise: NoiseFunction2D,
  worldX: number,
  worldY: number
): Biome => {
  const biomeValue = noise(worldX * 0.0008, worldY * 0.0008);

  let biome: Biome;

  if (biomeValue < -0.45) {
    biome = "desert";
  } else if (biomeValue < -0.1) {
    biome = "plains";
  } else if (biomeValue < 0.3) {
    biome = "ancient_seabed";
  } else if (biomeValue < 0.65) {
    biome = "mountains";
  } else {
    biome = "volcanic";
  }

  return biome;
};
