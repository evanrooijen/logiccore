import type { NoiseFunction2D } from "simplex-noise";

import type { Biome, OreType, RockType } from "../types";

export interface TerrainNoises {
  continental: NoiseFunction2D;
  detail: NoiseFunction2D;
  erosion: NoiseFunction2D;
  moisture: NoiseFunction2D;
  tectonic: NoiseFunction2D;
}

interface TerrainSampleValues {
  elevation: number;
  erosion: number;
  heat: number;
  moisture: number;
  tectonic: number;
}

interface TerrainRichnessOptions {
  anomaly: number;
  geology: RockType;
  noise: NoiseFunction2D;
  worldX: number;
  worldY: number;
}

interface TerrainOreModifierOptions {
  anomaly: number;
  geology: RockType;
}

const clamp01 = (value: number): number => Math.min(Math.max(value, 0), 1);

const normalizeNoise = (value: number): number => (value + 1) / 2;

const GEOLOGY_POTENTIAL = {
  basalt: 0.82,
  granite: 0.74,
  limestone: 0.42,
  quartzite: 0.62,
  shale: 0.48,
} as const satisfies Record<RockType, number>;

export class TerrainSample {
  readonly elevation: number;

  readonly erosion: number;

  readonly heat: number;

  readonly moisture: number;

  readonly tectonic: number;

  constructor({
    elevation,
    erosion,
    heat,
    moisture,
    tectonic,
  }: TerrainSampleValues) {
    this.elevation = elevation;
    this.erosion = erosion;
    this.heat = heat;
    this.moisture = moisture;
    this.tectonic = tectonic;
  }

  getBiome(): Biome {
    switch (true) {
      case this.tectonic > 0.83 && this.elevation > 0.54 && this.heat > 0.45: {
        return "volcanic";
      }
      case this.elevation > 0.68 ||
        (this.tectonic > 0.74 && this.elevation > 0.56): {
        return "mountains";
      }
      case this.moisture < 0.24 && this.heat > 0.42: {
        return "desert";
      }
      case this.elevation < 0.34 && this.erosion > 0.48: {
        return "ancient_seabed";
      }
      default: {
        return "plains";
      }
    }
  }

  getRichness({
    anomaly,
    geology,
    noise,
    worldX,
    worldY,
  }: TerrainRichnessOptions): number {
    const depositNoise = normalizeNoise(noise(worldX * 0.003, worldY * 0.003));
    const faultContact = this.tectonic * (1 - Math.abs(this.elevation - 0.58));
    const exposedStrata = this.erosion * 0.45 + this.elevation * 0.28;
    const geologyPotential = GEOLOGY_POTENTIAL[geology];

    let richness =
      depositNoise * 0.34 +
      faultContact * 0.28 +
      exposedStrata * 0.18 +
      geologyPotential * 0.2;

    // Exaggerate rarity while keeping ore-bearing areas tied to terrain context.
    richness **= 2.2;

    switch (true) {
      case anomaly > 0.82: {
        richness *= 1.8;
        break;
      }
      default: {
        break;
      }
    }

    return clamp01(richness);
  }

  getOreModifiers({
    anomaly,
    geology,
  }: TerrainOreModifierOptions): Record<OreType, number> {
    const biome = this.getBiome();
    const oreModifiers: Record<OreType, number> = {
      coal: 1,
      copper: 1,
      gold: 1,
      iron: 1,
      silver: 1,
    };

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

    switch (biome) {
      case "mountains": {
        oreModifiers.gold += 0.3;
        break;
      }
      case "volcanic": {
        oreModifiers.copper += 0.3;
        break;
      }
      case "ancient_seabed": {
        oreModifiers.coal += 0.2;
        break;
      }
      default: {
        break;
      }
    }

    switch (true) {
      case this.tectonic > 0.72: {
        oreModifiers.iron += 0.2;
        oreModifiers.copper += 0.15;
        break;
      }
      default: {
        break;
      }
    }

    switch (true) {
      case this.erosion > 0.68: {
        oreModifiers.silver += 0.15;
        break;
      }
      default: {
        break;
      }
    }

    switch (true) {
      case anomaly > 0.82: {
        oreModifiers.gold += 1.5;
        break;
      }
      case anomaly < -0.8: {
        oreModifiers.silver += 1.2;
        break;
      }
      default: {
        break;
      }
    }

    return oreModifiers;
  }
}

interface TerrainPoint {
  x: number;
  y: number;
}

const sampleContinentalShelf = ({ x, y }: TerrainPoint): number => {
  const centerDistance = Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2;
  const edgeFalloff = clamp01(centerDistance);

  return 1 - edgeFalloff ** 1.7;
};

const sampleTectonicPressure = (
  noises: TerrainNoises,
  point: TerrainPoint
): number => {
  const primaryFault = Math.abs(
    noises.tectonic(point.x * 4.5 + 17.1, point.y * 4.5 - 9.3)
  );
  const secondaryFault = Math.abs(
    noises.tectonic(point.x * 9.5 - 3.7, point.y * 9.5 + 21.4)
  );

  const faultPressure = 1 - Math.min(primaryFault, secondaryFault * 1.15);
  const regionalPressure = normalizeNoise(
    noises.tectonic(point.x * 1.8 - 13.2, point.y * 1.8 + 6.4)
  );

  return clamp01(faultPressure * 0.68 + regionalPressure * 0.32);
};

export const sampleTerrain = (
  noises: TerrainNoises,
  worldX: number,
  worldY: number,
  worldSize: number,
  chunkSize: number
): TerrainSample => {
  const point = {
    x: (worldX + chunkSize / 2) / worldSize,
    y: (worldY + chunkSize / 2) / worldSize,
  };

  const continentalShelf = sampleContinentalShelf(point);
  const continentalNoise = normalizeNoise(
    noises.continental(point.x * 2.6 + 11.5, point.y * 2.6 - 4.2)
  );
  const detailNoise = normalizeNoise(
    noises.detail(point.x * 15.5 - 8.8, point.y * 15.5 + 2.3)
  );
  const erosion = normalizeNoise(
    noises.erosion(point.x * 6.5 + 4.1, point.y * 6.5 - 12.7)
  );
  const tectonic = sampleTectonicPressure(noises, point);

  const elevation = clamp01(
    continentalShelf * 0.34 +
      continentalNoise * 0.24 +
      detailNoise * 0.14 +
      tectonic * 0.38 -
      erosion * 0.18
  );

  const latitude = Math.abs(point.y - 0.5) * 2;
  const heatNoise = normalizeNoise(
    noises.detail(point.x * 3.2 + 31.3, point.y * 3.2 - 18.9)
  );
  const heat = clamp01(
    0.82 - latitude * 0.5 + heatNoise * 0.22 - elevation * 0.24
  );

  const prevailingWindMoisture = 1 - point.x * 0.42;
  const basinMoisture = (1 - elevation) * 0.26 + erosion * 0.18;
  const rainShadow = Math.max(0, elevation - 0.48) * (0.28 + point.x * 0.24);
  const moistureNoise = normalizeNoise(
    noises.moisture(point.x * 5.8 - 24.4, point.y * 5.8 + 14.6)
  );
  const moisture = clamp01(
    prevailingWindMoisture * 0.36 +
      basinMoisture +
      moistureNoise * 0.34 -
      heat * 0.14 -
      rainShadow
  );

  return new TerrainSample({
    elevation,
    erosion,
    heat,
    moisture,
    tectonic,
  });
};
