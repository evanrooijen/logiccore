// oxlint-disable no-bitwise
export const mulberry32 = (seed: number) => {
  let state = seed;
  return () => {
    let t = (state += 0x6d_2b_79_f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    // oxlint-disable-next-line unicorn/prefer-math-trunc -- unsigned low 32 bits → [0,1)
    const u32 = (t ^ (t >>> 14)) >>> 0;
    return u32 / 4_294_967_296;
  };
};
