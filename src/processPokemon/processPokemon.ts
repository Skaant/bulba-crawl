import { PBNNPokemon } from "../_types/PBNNPokemon";
import { PagePokemon } from "../_types/PagePokemon";
import { getCacheOrCalculate } from "../_utils/getCacheOrDownload/getCacheOrCalculate";
import { getCacheOrDownload } from "../_utils/getCacheOrDownload/getCacheOrDownload";
import { cachePokemonLearnsets } from "../cachePokemonLearnset/cachePokemonLearnsets";
import { processPokemonStats } from "./processPokemonStats/processPokemonStats";
import { getPokemonFromPage } from "./getPokemonFromPage/getPokemonFromPage";

export type ProcessPokemonConfig = {
  REFRESH_POKEMON_FROM_PAGE?: true;
  PROCESS_STATS?: true;
  PROCESS_MOVES?: true;
};

export async function processPokemon(
  pokemon: PBNNPokemon,
  {
    REFRESH_POKEMON_FROM_PAGE,
    PROCESS_STATS,
    PROCESS_MOVES,
  }: ProcessPokemonConfig = {}
) {
  console.log(`== Process ${pokemon.name} ==`);
  // Page crawling
  const raw = await getCacheOrDownload(
    `./cache/raw/pokemons/${pokemon.name}.json`,
    `https://bulbapedia.bulbagarden.net/w/index.php?title=${pokemon.name}_(Pok%C3%A9mon)&action=edit`
  );
  const refined = await getCacheOrCalculate<PagePokemon>(
    `./cache/refined/pokemons/${pokemon.name}.json`,
    () => getPokemonFromPage(pokemon, raw),
    REFRESH_POKEMON_FROM_PAGE
  );
  // Stats crawling
  if (PROCESS_STATS) {
    processPokemonStats(raw, refined);
  }
  // Moves crawling
  if (PROCESS_MOVES) {
    cachePokemonLearnsets(raw, refined);
  }
  return refined;
}
