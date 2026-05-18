import type { NoiseFunction2D } from "simplex-noise";
import { describe, expect, it } from "vitest";

import { TerrainSample } from "./terrain";

const maxNoise: NoiseFunction2D = () => 1;

describe("TerrainSample", () => {
  it("should classify its own biome", () => {
    const terrain = new TerrainSample({
      elevation: 0.7,
      erosion: 0.35,
      heat: 0.6,
      moisture: 0.5,
      tectonic: 0.86,
    });

    expect(terrain.getBiome()).toBe("volcanic");
  });

  it("should calculate richness from terrain and geology", () => {
    const terrain = new TerrainSample({
      elevation: 0.58,
      erosion: 0.65,
      heat: 0.55,
      moisture: 0.45,
      tectonic: 0.8,
    });

    const normalRichness = terrain.getRichness({
      anomaly: 0,
      geology: "granite",
      noise: maxNoise,
      worldX: 0,
      worldY: 0,
    });
    const anomalyRichness = terrain.getRichness({
      anomaly: 0.9,
      geology: "granite",
      noise: maxNoise,
      worldX: 0,
      worldY: 0,
    });

    expect(normalRichness).toBeGreaterThan(0);
    expect(normalRichness).toBeLessThanOrEqual(1);
    expect(anomalyRichness).toBeGreaterThan(normalRichness);
    expect(anomalyRichness).toBeLessThanOrEqual(1);
  });

  it("should calculate ore modifiers from terrain, geology, biome, and anomaly", () => {
    const terrain = new TerrainSample({
      elevation: 0.7,
      erosion: 0.7,
      heat: 0.6,
      moisture: 0.5,
      tectonic: 0.86,
    });

    const oreModifiers = terrain.getOreModifiers({
      anomaly: 0.9,
      geology: "basalt",
    });

    expect(oreModifiers.copper).toBeGreaterThan(1);
    expect(oreModifiers.gold).toBeGreaterThan(1);
    expect(oreModifiers.iron).toBeGreaterThan(1);
    expect(oreModifiers.silver).toBeGreaterThan(1);
  });
});
