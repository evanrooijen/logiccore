const BIOME_COLORS: Record<string, string> = {
  Plains: "bg-emerald-600",
  Mountains: "bg-stone-500",
  Desert: "bg-amber-500",
  Volcanic: "bg-red-600",
  AncientSeabed: "bg-sky-600",
};

export const getBiomeColor = (tag: string): string =>
  BIOME_COLORS[tag] ?? "bg-zinc-600";

export const formatEnumTag = (tag: string): string =>
  tag.replaceAll(/([A-Z])/g, " $1").trim();
