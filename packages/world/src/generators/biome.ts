import type { Biome } from "../types";
import type { TerrainSample } from "./terrain";

export const getBiome = (terrain: TerrainSample): Biome => terrain.getBiome();
