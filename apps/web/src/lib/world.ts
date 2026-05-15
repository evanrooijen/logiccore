"use client";

import { reducers } from "@logiccore/spacetimedb";
import { useReducer } from "spacetimedb/react";

export function useWorldMutations() {
  const addWorld = useReducer(reducers.add);
  const deleteWorld = useReducer(reducers.deleteWorld);

  return {
    addWorld: (name: string) => addWorld({ name }),
    deleteWorld: (worldId: bigint) => deleteWorld({ worldId }),
  };
}
