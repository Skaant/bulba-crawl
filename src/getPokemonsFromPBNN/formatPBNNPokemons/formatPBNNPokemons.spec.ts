import { PBNNPokemon } from "../../_types/PBNNPokemon";
import { getCacheOrDownload } from "../../_utils/getCacheOrDownload/getCacheOrDownload";
import { formatPBNNPokemons } from "./formatPBNNPokemons";

function getLine(page: string[], start: string): string {
  return page.find((line) => line.startsWith(start)) as string;
}

describe("formatPBNNPokemons", () => {
  let PBNNPage: string[];
  beforeAll(async () => {
    PBNNPage = await getCacheOrDownload(
      "./cache/raw/pokemons-by-national-number.json",
      "https://bulbapedia.bulbagarden.net/w/index.php?title=List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number&action=edit"
    );
  });
  test("Base case (Bulbasaur)", () => {
    const line = getLine(PBNNPage, "{{ndex|0001");
    expect(formatPBNNPokemons(line as string)).toStrictEqual({
      ndex: 1,
      name: "Bulbasaur",
      types: ["Grass", "Poison"],
    } as PBNNPokemon);
  });
  test("Regional form case (Rattata)", () => {
    const line1 = getLine(PBNNPage, "{{ndex|0019");
    expect(formatPBNNPokemons(line1 as string)).toStrictEqual({
      ndex: 19,
      name: "Rattata",
      types: ["Normal"],
    } as PBNNPokemon);
    const line2 = getLine(PBNNPage, "{{ndex/form|0019");
    expect(formatPBNNPokemons(line2 as string)).toStrictEqual({
      ndex: 19,
      name: "Rattata",
      formId: "-Alola",
      formName: "Alolan Form",
      types: ["Dark", "Normal"],
    } as PBNNPokemon);
  });
  test("Multiple regional forms case (#128 Tauros)", () => {
    const line1 = getLine(PBNNPage, "{{ndex|0128");
    expect(formatPBNNPokemons(line1 as string)).toStrictEqual({
      ndex: 128,
      name: "Tauros",
      types: ["Normal"],
    } as PBNNPokemon);
    const line2 = getLine(PBNNPage, "{{ndex/form|0128|Tauros|-Paldea Combat");
    expect(formatPBNNPokemons(line2 as string)).toStrictEqual({
      ndex: 128,
      name: "Tauros",
      formId: "-Paldea Combat",
      formName: "Paldean Form",
      types: ["Fighting"],
    } as PBNNPokemon);
    const line3 = getLine(PBNNPage, "{{ndex/form|0128|Tauros|-Paldea Blaze");
    expect(formatPBNNPokemons(line3 as string)).toStrictEqual({
      ndex: 128,
      name: "Tauros",
      formId: "-Paldea Blaze",
      formName: "Paldean Form",
      types: ["Fighting", "Fire"],
    } as PBNNPokemon);
    const line4 = getLine(PBNNPage, "{{ndex/form|0128|Tauros|-Paldea Aqua");
    expect(formatPBNNPokemons(line4 as string)).toStrictEqual({
      ndex: 128,
      name: "Tauros",
      formId: "-Paldea Aqua",
      formName: "Paldean Form",
      types: ["Fighting", "Water"],
    } as PBNNPokemon);
  });
  test("Single and initial form case (#201 Unown)", () => {
    const line1 = getLine(PBNNPage, "{{ndex|0201");
    expect(formatPBNNPokemons(line1 as string)).toStrictEqual({
      ndex: 201,
      name: "Unown",
      formName: "One form",
      types: ["Psychic"],
    } as PBNNPokemon);
  });
  test("Multiple alternative forms case (#351 Castform)", () => {
    const line1 = getLine(PBNNPage, "{{ndex|0351");
    expect(formatPBNNPokemons(line1 as string)).toStrictEqual({
      ndex: 351,
      name: "Castform",
      formName: "Normal",
      types: ["Normal"],
    } as PBNNPokemon);
    const line2 = getLine(PBNNPage, "{{ndex/form|0351|Castform|-Sunny");
    expect(formatPBNNPokemons(line2 as string)).toStrictEqual({
      ndex: 351,
      name: "Castform",
      formId: "-Sunny",
      formName: "Sunny Form",
      types: ["Fire"],
    } as PBNNPokemon);
    const line3 = getLine(PBNNPage, "{{ndex/form|0351|Castform|-Rainy");
    expect(formatPBNNPokemons(line3 as string)).toStrictEqual({
      ndex: 351,
      name: "Castform",
      formId: "-Rainy",
      formName: "Rainy Form",
      types: ["Water"],
    } as PBNNPokemon);
    const line4 = getLine(PBNNPage, "{{ndex/form|0351|Castform|-Snowy");
    expect(formatPBNNPokemons(line4 as string)).toStrictEqual({
      ndex: 351,
      name: "Castform",
      formId: "-Snowy",
      formName: "Snowy Form",
      types: ["Ice"],
    } as PBNNPokemon);
  });
  test("Multiple alternative & initial 1-type forms case (#412 Burmy)", () => {
    const line1 = getLine(PBNNPage, "{{ndex|0412");
    expect(formatPBNNPokemons(line1 as string)).toStrictEqual({
      ndex: 412,
      name: "Burmy",
      formId: "-Plant",
      formName: "Plant Cloak",
      types: ["Bug"],
    } as PBNNPokemon);
    const line2 = getLine(PBNNPage, "{{ndex/form|0412|Burmy|-Sandy");
    expect(formatPBNNPokemons(line2 as string)).toStrictEqual({
      ndex: 412,
      name: "Burmy",
      formId: "-Sandy",
      formName: "Sandy Cloak",
      types: ["Bug"],
    } as PBNNPokemon);
    const line3 = getLine(PBNNPage, "{{ndex/form|0412|Burmy|-Trash");
    expect(formatPBNNPokemons(line3 as string)).toStrictEqual({
      ndex: 412,
      name: "Burmy",
      formId: "-Trash",
      formName: "Trash Cloak",
      types: ["Bug"],
    } as PBNNPokemon);
  });
  test("Multiple alternative & initial 2-types forms case (#413 Wormadam)", () => {
    const line1 = getLine(PBNNPage, "{{ndex|0413");
    expect(formatPBNNPokemons(line1 as string)).toStrictEqual({
      ndex: 413,
      name: "Wormadam",
      formId: "-Plant",
      formName: "Plant Cloak",
      types: ["Bug", "Grass"],
    } as PBNNPokemon);
    const line2 = getLine(PBNNPage, "{{ndex/form|0413|Wormadam|-Sandy");
    expect(formatPBNNPokemons(line2 as string)).toStrictEqual({
      ndex: 413,
      name: "Wormadam",
      formId: "-Sandy",
      formName: "Sandy Cloak",
      types: ["Bug", "Ground"],
    } as PBNNPokemon);
    const line3 = getLine(PBNNPage, "{{ndex/form|0413|Wormadam|-Trash");
    expect(formatPBNNPokemons(line3 as string)).toStrictEqual({
      ndex: 413,
      name: "Wormadam",
      formId: "-Trash",
      formName: "Trash Cloak",
      types: ["Bug", "Steel"],
    } as PBNNPokemon);
  });
  test("Multiple forms with no id (#888 Zacian)", () => {
    const line1 = getLine(PBNNPage, "{{ndex|0888");
    expect(formatPBNNPokemons(line1 as string)).toStrictEqual({
      ndex: 888,
      name: "Zacian",
      formId: "-Hero",
      formName: "Hero of Many Battles",
      types: ["Fairy"],
    } as PBNNPokemon);
    const line2 = getLine(PBNNPage, "{{ndex/form|0888|Zacian||Crowned");
    expect(formatPBNNPokemons(line2 as string)).toStrictEqual({
      ndex: 888,
      name: "Zacian",
      formName: "Crowned Sword",
      types: ["Fairy", "Steel"],
    } as PBNNPokemon);
  });
});
