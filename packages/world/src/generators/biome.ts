import type { Biome } from "../types";
import type { TerrainSample } from "./terrain";

export const getBiome = (terrain: TerrainSample): Biome => {
  if (
    terrain.tectonic > 0.83 &&
    terrain.elevation > 0.54 &&
    terrain.heat > 0.45
  ) {
    return "volcanic";
  }

  if (
    terrain.elevation > 0.68 ||
    (terrain.tectonic > 0.74 && terrain.elevation > 0.56)
  ) {
    return "mountains";
  }

  if (terrain.moisture < 0.24 && terrain.heat > 0.42) {
    return "desert";
  }

  if (terrain.elevation < 0.34 && terrain.erosion > 0.48) {
    return "ancient_seabed";
  }

  return "plains";
};
