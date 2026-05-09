import type { NoiseFunction2D } from "simplex-noise";

import type { RockType } from "../types";

export const getGeo = (
  noise: NoiseFunction2D,
  worldX: number,
  worldY: number
): RockType => {
  const geologyValue = noise(worldX * 0.002, worldY * 0.002);

  let geology: RockType;

  if (geologyValue < -0.5) {
    geology = "shale";
  } else if (geologyValue < -0.1) {
    geology = "limestone";
  } else if (geologyValue < 0.2) {
    geology = "granite";
  } else if (geologyValue < 0.55) {
    geology = "quartzite";
  } else {
    geology = "basalt";
  }
  return geology;
};
