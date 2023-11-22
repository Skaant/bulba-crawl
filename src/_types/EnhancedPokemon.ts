import { LearnsetMove } from "./LearnsetMove";
import { PagePokemon } from "./PagePokemon";
import { RegionalPokedexPokemon } from "./RegionalPokedexPokemon";
import { Stats } from "./Stats";

export type EnhancedPokemon = Pick<RegionalPokedexPokemon, "rdex"> &
  PagePokemon & {
    stats: Stats;
    moves: LearnsetMove[];
  };
