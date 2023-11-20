import { GENERATIONS_NUMBER_TO_ID } from "../_data/generationsNumberToId.data";
import { LV100EXP_TO_LEVELING_RATE } from "../_data/lv100expToLevelingRate.data";
import { STATS } from "../_enums/stats.enum";
import { PBNNPokemon } from "../_types/PBNNPokemon";
import { PagePokemon, PagePokemonForm } from "../_types/PagePokemon";

export function getPokemonFromPage(
  { form, ...pokemonPBNN }: PBNNPokemon,
  page: string[]
): PagePokemon {
  const infoboxStartIndex = page.findIndex((line) =>
    line.includes("{{Pokémon Infobox")
  );
  const infoboxEndIndex = page
    .slice(infoboxStartIndex)
    .findIndex(
      (line, index) => index > infoboxStartIndex && line.includes("}}")
    );
  const infobox = page
    .slice(infoboxStartIndex + 1, infoboxEndIndex + infoboxStartIndex)
    .reduce((acc, line) => {
      const [key, value] = line.slice(1).split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

  const nbFormes = infobox["forme"] && parseInt(infobox["forme"]);
  const firstFormNumber = infobox["form1"] ? 1 : 2;

  return {
    ...pokemonPBNN,
    firstGeneration: GENERATIONS_NUMBER_TO_ID[infobox["generation"]],
    forms: nbFormes
      ? [...Array(nbFormes + 1 - firstFormNumber).keys()].map((_, index) => {
          return {
            name: infobox[`form${index + firstFormNumber}`],
            types: infobox[`form${index + firstFormNumber}type1`] && [
              infobox[`form${index + firstFormNumber}type1`],
              ...(infobox[`form${index + firstFormNumber}type2`]
                ? [infobox[`form${index + firstFormNumber}type2`]]
                : []),
            ],
            ability: infobox[`abilitym${index === 0 ? "" : index + 1}`],
          } as PagePokemonForm;
        })
      : undefined,
    abilities: [
      infobox["ability1"],
      ...(infobox["ability2"] ? [infobox["ability2"]] : []),
    ],
    hiddenAbility: infobox["abilityd"],
    catchRate: parseInt(infobox["catchrate"]),
    levelingRate: LV100EXP_TO_LEVELING_RATE[infobox["lv100exp"]],
    expYield: parseInt(infobox["expyield"]),
    effortValuesYield: {
      ...(infobox["evhp"] ? { [STATS.HP]: parseInt(infobox["evhp"]) } : {}),
      ...(infobox["evat"] ? { [STATS.ATTACK]: parseInt(infobox["evat"]) } : {}),
      ...(infobox["evde"]
        ? { [STATS.DEFENSE]: parseInt(infobox["evde"]) }
        : {}),
      ...(infobox["evsa"]
        ? {
            [STATS.SP_ATTACK]: parseInt(infobox["evsa"]),
          }
        : {}),
      ...(infobox["evsd"]
        ? {
            [STATS.SP_DEFENSE]: parseInt(infobox["evsd"]),
          }
        : {}),
      ...(infobox["evsp"] ? { [STATS.SPEED]: parseInt(infobox["evsp"]) } : {}),
    },
  };
}
