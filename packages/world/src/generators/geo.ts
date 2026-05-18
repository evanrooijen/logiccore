import type { RockType } from "../types";
import type { TerrainSample } from "./terrain";

export const getGeo = (terrain: TerrainSample): RockType => {
  switch (true) {
    case terrain.tectonic > 0.76 && terrain.heat > 0.48: {
      return "basalt";
    }
    case terrain.elevation > 0.66 && terrain.erosion < 0.58: {
      return "granite";
    }
    case terrain.elevation < 0.38 && terrain.moisture > 0.46: {
      return "limestone";
    }
    case terrain.erosion > 0.62 || terrain.elevation < 0.3: {
      return "shale";
    }
    default: {
      return "quartzite";
    }
  }
};
