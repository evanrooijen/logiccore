import type { NoiseFunction2D } from "simplex-noise";

import type { RockType } from "../types";
import type { TerrainSample } from "./terrain";

export const getRichness = (
  noise: NoiseFunction2D,
  worldX: number,
  worldY: number,
  terrain: TerrainSample,
  geology: RockType,
  anomaly = 0
): number =>
  terrain.getRichness({
    anomaly,
    geology,
    noise,
    worldX,
    worldY,
  });
