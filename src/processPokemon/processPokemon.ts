import { PBNNPokemon } from "../_types/PBNNPokemon";
import { PagePokemon } from "../_types/PagePokemon";
import { getCacheOrCalculate } from "../_utils/getCacheOrDownload/getCacheOrCalculate";
import { getCacheOrDownload } from "../_utils/getCacheOrDownload/getCacheOrDownload";
import { cachePokemonLearnsets } from "../cachePokemonLearnset/cachePokemonLearnsets";
import { cachePokemonStats } from "../cachePokemonStats/cachePokemonStats";
import { getPokemonFromPage } from "./getPokemonFromPage/getPokemonFromPage";

export type ProcessPokemonConfig = {
  PROCESS_STATS?: true;
  PROCESS_MOVES?: true;
};

export async function processPokemon(
  pokemon: PBNNPokemon,
  { PROCESS_STATS, PROCESS_MOVES }: ProcessPokemonConfig = {}
) {
  console.log(`== Process ${pokemon.name} ==`);
  // Page crawling
  const rawPageContent = await getCacheOrDownload(
    `./cache/raw/pokemons/${pokemon.name}.json`,
    `https://bulbapedia.bulbagarden.net/w/index.php?title=${pokemon.name}_(Pok%C3%A9mon)&action=edit`
  );
  const refinedPagePokemon = await getCacheOrCalculate<PagePokemon>(
    `./cache/refined/pokemons/${pokemon.name}.json`,
    () => getPokemonFromPage(pokemon, rawPageContent)
  );
  // Stats crawling
  if (PROCESS_STATS) {
    cachePokemonStats(rawPageContent, refinedPagePokemon);
  }
  // Moves crawling
  if (PROCESS_MOVES) {
    cachePokemonLearnsets(rawPageContent, refinedPagePokemon);
  }
  return refinedPagePokemon;
}
