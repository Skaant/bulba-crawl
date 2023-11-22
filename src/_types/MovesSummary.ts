import { TYPES } from "../_enums/types.enum";

export type MovesSummary = {
  // Types sum = 100%
  types: { [type in TYPES]: number };
  // Categories sum = 100
  physical: number;
  special: number;
  status: number;
};
