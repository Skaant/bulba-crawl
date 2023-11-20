import { getPokemonsFromPBNN } from "./src/getPokemonsFromPBNN/getPokemonsFromPBNN";
import { getCacheOrDownload } from "./src/_utils/getCacheOrDownload/getCacheOrDownload";
import { writeFile } from "fs/promises";
import { getPokemonFromPage } from "./src/getPokemonFromPage/getPokemonFromPage";
import { cachePokemonLearnsets } from "./src/cachePokemonLearnset/cachePokemonLearnsets";
import { cachePokemonStats } from "./src/cachePokemonStats/cachePokemonStats";
import { TYPES_LIST } from "./src/_data/types-list.data";
import { getGenerationsTypeEfficiencies } from "./src/getGenerationsTypesEfficiencies/getGenerationsTypeEfficiencies";
import { getCacheOrCalculte } from "./src/_utils/getCacheOrDownload/getCacheOrCalculte";
import { PBNNPokemon } from "./src/_types/PBNNPokemon";

const REFRESH_POKEMONS_PBNN = false;
const PROCESS_PURE_FORMS_POKEMONS_PBNN = false;
const PROCESS_TYPES_EFFICIENCIES = true;

async function run() {
  const pbnn = await getCacheOrDownload(
    "./cache/raw/pokemons-by-national-number.json",
    "https://bulbapedia.bulbagarden.net/w/index.php?title=List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number&action=edit"
  );

  const pokemonsPBNN = await getCacheOrCalculte<PBNNPokemon[]>(
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
      const pagePokemon = getPokemonFromPage(pokemonPBNN, pokemonPage);
      await writeFile(
        `./cache/refined/pokemons/${pokemonPBNN.name}.json`,
        JSON.stringify(pagePokemon, undefined, 2),
        { encoding: "utf-8" }
      );
      // Base stats crawling
      cachePokemonStats(pokemonPage, pagePokemon);
      // Learnsets crawling
      cachePokemonLearnsets(pokemonPage, pagePokemon);
      // Interval incrementation
      index++;
      if (index === pureFormPokemonsPBNN.length) {
        clearInterval(interval);
      }
    }, 100);
  }

  if (PROCESS_TYPES_EFFICIENCIES) {
    let index = 0;
    let interval = setInterval(async () => {
      const type = TYPES_LIST[index];
      console.log(`{${index}/${type}} Ok, it's ${type} !`);
      const typePage = await getCacheOrDownload(
        `./cache/raw/types/${type}.json`,
        `https://bulbapedia.bulbagarden.net/w/index.php?title=${type}_(type)&action=edit`
      );
      const typeEfficiencies = getGenerationsTypeEfficiencies(typePage);
      typeEfficiencies &&
        writeFile(
          `./cache/refined/types/${type}.json`,
          JSON.stringify(typeEfficiencies, undefined, 2),
          { encoding: "utf-8" }
        );
      index++;
      if (index === TYPES_LIST.length) {
        clearInterval(interval);
      }
    }, 6000);
  }
}

run();
