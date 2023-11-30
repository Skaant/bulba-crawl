import { Types } from "./Types";

export type PBNNPokemon = {
  ndex: number;
  name: string;
  formId?: string;
  formName?: string;
  types: Types;
};
