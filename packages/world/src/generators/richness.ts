import type { NoiseFunction2D } from "simplex-noise";

export const getRichness = (
  noise: NoiseFunction2D,
  worldX: number,
  worldY: number
) => {
  let richness = noise(worldX * 0.003, worldY * 0.003);

  // normalize to 0-1
  richness = (richness + 1) / 2;

  // exaggerate rarity
  richness **= 2.2;

  return richness;
};
