import { getPokemonsFromPBNN } from "./src/getPokemonsFromPBNN/getPokemonsFromPBNN";
import { getCacheOrDownload } from "./src/_utils/getCacheOrDownload/getCacheOrDownload";
import { writeFile } from "fs/promises";
import { getPokemonFromPage } from "./src/getPokemonFromPage/getPokemonFromPage";
import { cachePokemonLearnsets } from "./src/cachePokemonLearnset/cachePokemonLearnsets";
import { cachePokemonStats } from "./src/cachePokemonStats/cachePokemonStats";
import { TYPES_LIST } from "./src/_data/types-list.data";
import { getGenerationsTypeEfficiencies } from "./src/getGenerationsTypesEfficiencies/getGenerationsTypeEfficiencies";
import { getCacheOrCalculate } from "./src/_utils/getCacheOrDownload/getCacheOrCalculate";
import { PBNNPokemon } from "./src/_types/PBNNPokemon";
import { getRegionalPokedexPokemons } from "./src/getRegionalPokedexPokemons/getRegionalPokedexPokemons";
import {
  REGIONAL_POKEDEXES_DATA,
  RegionalPokedexData,
} from "./src/_data/regional-pokedexes.data";
import { REGIONAL_POKEDEXES } from "./src/_enums/regional-pokedexes.enum";
import { TypeEfficiencies } from "./src/_types/TypeEfficiencies";
import { ByGenerations } from "./src/_types/ByGenerations";
import { GENERATIONS_LIST } from "./src/_data/generations-list.data";
import { getEnhancedPokemon } from "./src/exports/exportRegionalPokedexes/getEnhancedPokemon/getEnhancedPokemon";
import { PagePokemon } from "./src/_types/PagePokemon";
import { GAMES_DATA } from "./src/_data/games.data";

const OUTPUT_GAMES_LIST = true;

const REFRESH_POKEMONS_PBNN = false;

const PROCESS_PURE_FORMS_POKEMONS_PBNN = false;
const PROCESS_POKEMONS_STATS = false;
const PROCESS_POKEMONS_LEARNSETS = true;

const PROCESS_TYPES_EFFICIENCIES = false;

const PROCESS_REGIONAL_POKEDEXES = false;

async function run() {
  if (OUTPUT_GAMES_LIST) {
    await writeFile(
      "./cache/outputs/games.json",
      JSON.stringify(GAMES_DATA, undefined, 2)
    );
  }

  const pbnn = await getCacheOrDownload(
    "./cache/raw/pokemons-by-national-number.json",
    "https://bulbapedia.bulbagarden.net/w/index.php?title=List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number&action=edit"
  );

  const pokemonsPBNN = await getCacheOrCalculate<PBNNPokemon[]>(
    "./cache/refined/pokemons-pbnn.json",
    () => getPokemonsFromPBNN(pbnn),
    REFRESH_POKEMONS_PBNN
  );

  if (PROCESS_PURE_FORMS_POKEMONS_PBNN) {
    const pureFormPokemonsPBNN = pokemonsPBNN.filter(
      (pokemon, index) =>
        pokemon.ndex &&
        (pokemon.form === undefined ||
          pokemonsPBNN[index - 1]?.ndex !== pokemon.ndex)
    );

    let index = 0;
    let interval = setInterval(async () => {
      const pokemonPBNN = pureFormPokemonsPBNN[index];
      console.log(
        `{${index}/${pokemonPBNN.ndex}} Ok, it's ${pokemonPBNN.name} !`
      );
      // Page crawling
      const pokemonPage = await getCacheOrDownload(
        `./cache/raw/pokemons/${pokemonPBNN.name}.json`,
        `https://bulbapedia.bulbagarden.net/w/index.php?title=${pokemonPBNN.name}_(Pok%C3%A9mon)&action=edit`
      );
      const pagePokemon = await getCacheOrCalculate<PagePokemon>(
        `./cache/refined/pokemons/${pokemonPBNN.name}.json`,
        () => getPokemonFromPage(pokemonPBNN, pokemonPage)
      );
      // Base stats crawling
      PROCESS_POKEMONS_STATS && cachePokemonStats(pokemonPage, pagePokemon);
      // Learnsets crawling
      PROCESS_POKEMONS_LEARNSETS &&
        cachePokemonLearnsets(pokemonPage, pagePokemon);
      // Interval incrementation
      index++;
      if (index === pureFormPokemonsPBNN.length) {
        clearInterval(interval);
      }
    }, 100);
  }

  if (PROCESS_TYPES_EFFICIENCIES) {
    const typesGenerationsEfficiencies: Record<
      string,
      ByGenerations<TypeEfficiencies>
    > = {};

    const INTERVAL_DELAY = 100;
    let index = 0;
    let interval = setInterval(async () => {
      const type = TYPES_LIST[index];
      console.log(`{${index}/${type}} Ok, it's ${type} !`);
      const typePage = await getCacheOrDownload(
        `./cache/raw/types/${type}.json`,
        `https://bulbapedia.bulbagarden.net/w/index.php?title=${type}_(type)&action=edit`
      );
      const typeEfficiencies = getGenerationsTypeEfficiencies(typePage);
      if (typeEfficiencies) {
        writeFile(
          `./cache/refined/types/${type}.json`,
          JSON.stringify(typeEfficiencies, undefined, 2),
          { encoding: "utf-8" }
        );
        typesGenerationsEfficiencies[type] = typeEfficiencies;
      }
      index++;
      if (!TYPES_LIST[index]) {
        clearInterval(interval);
      }
    }, INTERVAL_DELAY);
    setTimeout(() => {
      GENERATIONS_LIST.forEach((generation) => {
        const typesEfficiencies = TYPES_LIST.reduce((acc, type) => {
          if (!typesGenerationsEfficiencies[type][generation]) return acc;
          acc[type] = typesGenerationsEfficiencies[type][generation];
          return acc;
        }, {} as Record<string, TypeEfficiencies>);
        if (typesEfficiencies) {
          writeFile(
            `./cache/outputs/types/${generation}.json`,
            JSON.stringify(typesEfficiencies, undefined, 2),
            { encoding: "utf-8" }
          );
        }
      });
    }, INTERVAL_DELAY * (TYPES_LIST.length + 2));
  }

  if (PROCESS_REGIONAL_POKEDEXES) {
    const pokemons = await getRegionalPokedexPokemons(
      REGIONAL_POKEDEXES_DATA[REGIONAL_POKEDEXES.KANTO] as RegionalPokedexData
    );
    if (pokemons) {
      const enhancedPokemons = await Promise.all(
        pokemons?.map(getEnhancedPokemon)
      );
      await writeFile(
        `./cache/outputs/pokedexes/${REGIONAL_POKEDEXES.KANTO}.json`,
        JSON.stringify(enhancedPokemons, undefined, 2),
        { encoding: "utf-8" }
      );
    }
  }
}

run();
