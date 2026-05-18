// oxlint-disable unicorn/no-array-for-each
import { describe, it, expect } from "vitest";

import { generateWorld } from "./index";

describe("generateWorld", () => {
  describe("validation", () => {
    it("should throw an error if size is not divisible by chunkSize", () => {
      expect(() => generateWorld(12_345, 100, 30)).toThrow(
        "World size must divide evenly by chunk size"
      );
    });

    it("should not throw when size divides evenly by chunkSize", () => {
      expect(() => generateWorld(12_345, 100, 25)).not.toThrow();
    });
  });

  describe("world generation", () => {
    it("should generate a valid WorldData object", () => {
      const world = generateWorld(12_345, 100, 25);

      expect(world).toHaveProperty("seed");
      expect(world).toHaveProperty("size");
      expect(world).toHaveProperty("chunkSize");
      expect(world).toHaveProperty("chunksWide");
      expect(world).toHaveProperty("chunksHigh");
      expect(world).toHaveProperty("chunks");
    });

    it("should calculate correct chunk grid dimensions", () => {
      const world = generateWorld(42, 200, 50);

      expect(world.chunksWide).toBe(4);
      expect(world.chunksHigh).toBe(4);
      expect(world.chunks).toHaveLength(16);
    });

    it("should preserve seed and size parameters", () => {
      const seed = 99_999;
      const size = 256;
      const chunkSize = 32;

      const world = generateWorld(seed, size, chunkSize);

      expect(world.seed).toBe(seed);
      expect(world.size).toBe(size);
      expect(world.chunkSize).toBe(chunkSize);
    });

    it("should generate consistent results with same seed", () => {
      const seed = 54_321;
      const size = 100;
      const chunkSize = 25;

      const world1 = generateWorld(seed, size, chunkSize);
      const world2 = generateWorld(seed, size, chunkSize);

      expect(world1.chunks).toEqual(world2.chunks);
    });

    it("should generate different results with different seeds", () => {
      const size = 100;
      const chunkSize = 25;

      const world1 = generateWorld(111, size, chunkSize);
      const world2 = generateWorld(222, size, chunkSize);

      const hasDifference = world1.chunks.some(
        (chunk, index) =>
          chunk.biome !== world2.chunks[index]?.biome ||
          chunk.geology !== world2.chunks[index]?.geology ||
          chunk.richness !== world2.chunks[index]?.richness
      );

      expect(hasDifference).toBe(true);
    });

    it("should blend multiple terrain factors into varied regions", () => {
      const world = generateWorld(13_579, 512, 32);

      const biomes = new Set(world.chunks.map((chunk) => chunk.biome));
      const geologies = new Set(world.chunks.map((chunk) => chunk.geology));

      expect(biomes.size).toBeGreaterThan(2);
      expect(geologies.size).toBeGreaterThan(2);
    });
  });

  describe("chunk data", () => {
    it("should assign correct chunk coordinates", () => {
      const world = generateWorld(12_345, 100, 25);

      for (const chunk of world.chunks) {
        expect(chunk.chunkX).toBeGreaterThanOrEqual(0);
        expect(chunk.chunkX).toBeLessThan(world.chunksWide);
        expect(chunk.chunkY).toBeGreaterThanOrEqual(0);
        expect(chunk.chunkY).toBeLessThan(world.chunksHigh);
      }
    });

    it("should have all required chunk properties", () => {
      const world = generateWorld(12_345, 100, 25);
      const [chunk] = world.chunks;

      expect(chunk).toHaveProperty("chunkX");
      expect(chunk).toHaveProperty("chunkY");
      expect(chunk).toHaveProperty("biome");
      expect(chunk).toHaveProperty("geology");
      expect(chunk).toHaveProperty("richness");
      expect(chunk).toHaveProperty("oreModifiers");
      expect(chunk).toHaveProperty("regionName");
    });

    it("should keep richness within valid bounds [0, 1]", () => {
      const world = generateWorld(12_345, 100, 25);

      world.chunks.forEach((chunk) => {
        expect(chunk.richness).toBeGreaterThanOrEqual(0);
        expect(chunk.richness).toBeLessThanOrEqual(1);
      });
    });

    it("should have valid ore modifiers", () => {
      const world = generateWorld(12_345, 100, 25);
      const validOreTypes = ["gold", "silver", "copper", "iron", "coal"];

      world.chunks.forEach((chunk) => {
        const oreTypes = Object.keys(chunk.oreModifiers);
        expect(oreTypes).toEqual(expect.arrayContaining(validOreTypes));

        Object.values(chunk.oreModifiers).forEach((modifier) => {
          expect(modifier).toBeGreaterThan(0);
        });
      });
    });

    it("should generate region names for all chunks", () => {
      const world = generateWorld(12_345, 100, 25);

      world.chunks.forEach((chunk) => {
        expect(chunk.regionName).toBeDefined();
        expect(typeof chunk.regionName).toBe("string");
        expect(chunk.regionName.length).toBeGreaterThan(0);
      });
    });
  });

  describe("geology specialization", () => {
    it("should boost gold in granite", () => {
      const world = generateWorld(12_345, 100, 25);

      const graniteChunks = world.chunks.filter(
        (chunk) => chunk.geology === "granite"
      );
      const otherChunks = world.chunks.filter(
        (chunk) => chunk.geology !== "granite"
      );

      if (graniteChunks.length > 0 && otherChunks.length > 0) {
        const graniteGoldAvg =
          graniteChunks.reduce((sum, c) => sum + c.oreModifiers.gold, 0) /
          graniteChunks.length;
        const otherGoldAvg =
          otherChunks.reduce((sum, c) => sum + c.oreModifiers.gold, 0) /
          otherChunks.length;

        expect(graniteGoldAvg).toBeGreaterThan(otherGoldAvg);
      }
    });

    it("should boost copper and iron in basalt", () => {
      const world = generateWorld(12_345, 100, 25);

      const basaltChunks = world.chunks.filter(
        (chunk) => chunk.geology === "basalt"
      );

      basaltChunks.forEach((chunk) => {
        expect(chunk.oreModifiers.copper).toBeGreaterThan(1);
        expect(chunk.oreModifiers.iron).toBeGreaterThan(1);
      });
    });
  });

  describe("biome specialization", () => {
    it("should boost gold in mountains", () => {
      const world = generateWorld(12_345, 100, 25);

      const mountainChunks = world.chunks.filter(
        (chunk) => chunk.biome === "mountains"
      );

      mountainChunks.forEach((chunk) => {
        expect(chunk.oreModifiers.gold).toBeGreaterThan(1);
      });
    });

    it("should boost copper in volcanic biome", () => {
      const world = generateWorld(12_345, 100, 25);

      const volcanicChunks = world.chunks.filter(
        (chunk) => chunk.biome === "volcanic"
      );

      for (const chunk of volcanicChunks) {
        expect(chunk.oreModifiers.copper).toBeGreaterThan(1);
      }
    });
  });
});
