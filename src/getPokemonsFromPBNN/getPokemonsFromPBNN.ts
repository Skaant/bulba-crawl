import { PBNNPokemon } from "../_types/PBNNPokemon";
import { formatPBNNPokemons } from "./formatPBNNPokemons/formatPBNNPokemons";

export function getPokemonsFromPBNN(lines: string[]): PBNNPokemon[] {
  const pokemons = lines
    .filter((line) => line.startsWith("{{ndex") && !line.startsWith("{{ndexh"))
    .map(formatPBNNPokemons);
  // FIXES
  pokemons[1056].formId = "-Male";
  pokemons[1056].types = ["Normal"];
  pokemons[1066].formId = "-Three";
  pokemons[1066].types = ["Normal"];

  return pokemons;
}
