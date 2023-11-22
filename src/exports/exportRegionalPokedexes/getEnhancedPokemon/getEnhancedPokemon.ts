import { TYPES } from "../../../_enums/types.enum";
import { EnhancedPokemon } from "../../../_types/EnhancedPokemon";
import { LearnsetMove } from "../../../_types/LearnsetMove";
import { MovesSummary } from "../../../_types/MovesSummary";
import { PagePokemon } from "../../../_types/PagePokemon";
import { RegionalPokedexPokemon } from "../../../_types/RegionalPokedexPokemon";
import { Stats } from "../../../_types/Stats";
import { getCache } from "../../../_utils/getCacheOrDownload/getCache";

export async function getEnhancedPokemon(
  pokedexPokemon: RegionalPokedexPokemon
): Promise<EnhancedPokemon> {
  const pokemon = (await getCache(
    `./cache/refined/pokemons/${pokedexPokemon.name}.json`
  )) as PagePokemon;
  const stats = (await getCache(
    `./cache/refined/stats/${pokedexPokemon.name}.json`
  )) as Stats;
  const moves = (await getCache(
    `./cache/refined/learnsets/${pokedexPokemon.name}.json`
  )) as LearnsetMove[];
  return {
    rdex: pokedexPokemon.rdex,
    ...pokemon,
    types: pokedexPokemon.types,
    stats,
    moves,
  };
}
