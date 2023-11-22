import { writeFile } from "fs/promises";
import { RegionalPokedexData } from "../_data/regional-pokedexes.data";
import { RegionalPokedexPokemon } from "../_types/RegionalPokedexPokemon";
import { getSection } from "../_utils/_lines-manipulation/getSection";
import { getCache } from "../_utils/getCacheOrDownload/getCache";
import { getCacheOrDownload } from "../_utils/getCacheOrDownload/getCacheOrDownload";

export async function getRegionalPokedexPokemons({
  id,
  url,
  section,
}: RegionalPokedexData): Promise<RegionalPokedexPokemon[] | undefined> {
  const pokedex = (await getCache(
    `./cache/refined/regional-pokedexes/${id}.json`
  )) as RegionalPokedexPokemon[] | undefined;
  console.log(1);
  if (pokedex) return pokedex;
  const page = await getCacheOrDownload(
    `./cache/raw/regional-pokedexes/${id}.json`,
    url
  );
  const pokedexSection = getSection(page, section || "==List of Pokémon by");
  console.log(2);
  if (!pokedexSection) return undefined;
  const pokemons = pokedexSection
    .filter((line) => line.startsWith("{{rdex|"))
    .map((line) => {
      const values = line.slice(2, -2).split("|");
      return {
        ndex: +values[1],
        rdex: +values[2],
        name: values[3],
        types: values[4] === "1" ? [values[5]] : [values[5], values[6]],
      } as RegionalPokedexPokemon;
    });
  await writeFile(
    `./cache/refined/regional-pokedexes/${id}.json`,
    JSON.stringify(pokemons, undefined, 2),
    { encoding: "utf-8" }
  );
  return pokemons;
}
