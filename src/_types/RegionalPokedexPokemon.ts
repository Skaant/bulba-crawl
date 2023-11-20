import { Types } from "./Types";

export type RegionalPokedexPokemon = {
  ndex: number;
  rdex: number;
  form?: string;
  name: string;
  types: Types;
};
