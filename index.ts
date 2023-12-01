import { writeFile } from "fs/promises";
import { ByGenerations } from "./src/_types/ByGenerations";
import { TypeEfficiencies } from "./src/_types/TypeEfficiencies";
import { PBNNPokemon } from "./src/_types/PBNNPokemon";
import { REGIONAL_POKEDEXES } from "./src/_enums/regional-pokedexes.enum";
import {
  REGIONAL_POKEDEXES_DATA,
  RegionalPokedexData,
} from "./src/_data/regional-pokedexes.data";
import { GENERATIONS_LIST } from "./src/_data/generations-list.data";
import { GAMES_DATA } from "./src/_data/games.data";
import { TYPES_LIST } from "./src/_data/types-list.data";
import { getPokemonsFromPBNN } from "./src/getPokemonsFromPBNN/getPokemonsFromPBNN";
import { getCacheOrDownload } from "./src/_utils/getCacheOrDownload/getCacheOrDownload";
import { getGenerationsTypeEfficiencies } from "./src/getGenerationsTypesEfficiencies/getGenerationsTypeEfficiencies";
import { getCacheOrCalculate } from "./src/_utils/getCacheOrDownload/getCacheOrCalculate";
import { getRegionalPokedexPokemons } from "./src/getRegionalPokedexPokemons/getRegionalPokedexPokemons";
import { getEnhancedPokemon } from "./src/exports/exportRegionalPokedexes/getEnhancedPokemon/getEnhancedPokemon";
import {
  processPokemon,
  ProcessPokemonConfig,
} from "./src/processPokemon/processPokemon";

export type ProcessConfig = {
  PROCESS_GAMES?: true;
  REFRESH_POKEMONS_PBNN_REFINEMENT?: true;
  PROCESS_POKEMONS?: ProcessPokemonConfig;
};

const PROCESS_CONFIG: ProcessConfig = {
  PROCESS_POKEMONS: {
    REFRESH_POKEMON_FROM_PAGE: true,
    PROCESS_STATS: true,
  },
};

// Deprecated. Move to PROCESS_CONFIG
const PROCESS_TYPES_EFFICIENCIES = false;
const PROCESS_REGIONAL_POKEDEXES = false;

async function run() {
  if (PROCESS_CONFIG.PROCESS_GAMES) {
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
    PROCESS_CONFIG.REFRESH_POKEMONS_PBNN_REFINEMENT
  );

  if (PROCESS_CONFIG.PROCESS_POKEMONS) {
    const pureFormPokemonsPBNN = pokemonsPBNN.filter(
      (pokemon, index) =>
        pokemon.ndex &&
        (pokemon.formName === undefined ||
          pokemonsPBNN[index - 1]?.ndex !== pokemon.ndex)
    );

    let index = 0;
    let interval = setInterval(async () => {
      const pokemonPBNN = pureFormPokemonsPBNN[index];

      processPokemon(pokemonPBNN, PROCESS_CONFIG.PROCESS_POKEMONS);

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

    const INTERVAL_DELAY = 10000;
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
