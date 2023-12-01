import { STATS } from "../_enums/stats.enum";
import { PBNNPokemon } from "./PBNNPokemon";
import { Types } from "./Types";

export type PagePokemonForm = {
  name: string;
  types?: Types;
  ability?: string;
};

export type PagePokemon = Omit<PBNNPokemon, "form"> & {
  firstGeneration: number;
  forms?: PagePokemonForm[];
  abilities: string[];
  hiddenAbility?: string;
  catchRate?: number;
  levelingRate?: string;
  expYield?: number;
  effortValuesYield?: { [key in STATS]?: number };
};
