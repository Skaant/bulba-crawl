import { LV100EXP_TO_LEVELING_RATE } from "../../_data/lv100expToLevelingRate.data";
import { STATS } from "../../_enums/stats.enum";
import { PBNNPokemon } from "../../_types/PBNNPokemon";
import { PagePokemon, PagePokemonForm } from "../../_types/PagePokemon";
import { getObject } from "../../_utils/_lines-manipulation/getObject";

export function getPokemonFromPage(
  { formId, ...pokemonPBNN }: PBNNPokemon,
  page: string[]
): PagePokemon {
  const infobox = getObject(page, "Pokémon Infobox");
  if (!infobox) throw new Error("No infobox");
  const nbFormes = infobox["forme"] && parseInt(infobox["forme"]);
  const firstFormNumber = infobox["form1"] ? 1 : 2;

  return {
    ...pokemonPBNN,
    firstGeneration: parseInt(infobox["generation"]),
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
