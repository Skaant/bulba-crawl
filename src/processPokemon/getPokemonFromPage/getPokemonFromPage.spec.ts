import { PBNNPokemon } from "../../_types/PBNNPokemon";
import { getCache } from "../../_utils/getCacheOrDownload/getCache";
import { getPokemonFromPage } from "./getPokemonFromPage";

describe("getPokemonFromPage", () => {
  describe("Edge cases", () => {
    test("Electrode", async () => {
      const pbnn = (await getCache<PBNNPokemon[]>(
        "./cache/refined/pokemons-pbnn.json"
      )) as PBNNPokemon[];
      const raw = (await getCache<string[]>(
        "./cache/raw/pokemons/Electrode.json"
      )) as string[];
      const i = pbnn?.findIndex((pokemon) => pokemon.name === "Electrode");
      const pokemon = getPokemonFromPage(pbnn[i], raw);
      expect(pokemon.forms?.length).toBe(2);
    });
  });
});
