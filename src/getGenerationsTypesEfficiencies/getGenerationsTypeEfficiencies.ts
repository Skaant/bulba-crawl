import { GENERATIONS_NUMBER_TO_ID } from "../_data/generationsNumberToId.data";
import { ByGenerations } from "../_types/ByGenerations";
import { TypeEfficiencies } from "../_types/TypeEfficiencies";
import { getGenerationsSection } from "../_utils/_lines-manipulation/getGenerationsSection";
import { getSection } from "../_utils/_lines-manipulation/getSection";
import { getTypeEfficienciesFromSection } from "./getTypeEfficienciesFromSection/getTypeEfficienciesFromSection";

export function getGenerationsTypeEfficiencies(
  typePage: string[]
): ByGenerations<TypeEfficiencies> | undefined {
  const SECTION = "==Battle properties";
  const sections = getGenerationsSection(typePage, SECTION);
  if (sections) {
    return Object.entries(sections).reduce(
      (generations, [generationId, section]) => {
        const typesEfficiciency: TypeEfficiencies =
          getTypeEfficienciesFromSection(section);
        generations[generationId] = typesEfficiciency;
        return generations;
      },
      {} as Partial<ByGenerations<TypeEfficiencies>>
    ) as ByGenerations<TypeEfficiencies>;
  } else {
    const section = getSection(typePage, SECTION);
    if (!section) return undefined;
    const typesEfficiciency: TypeEfficiencies =
      getTypeEfficienciesFromSection(section);
    return [...Array(9)].reduce((generations, _, index) => {
      generations[GENERATIONS_NUMBER_TO_ID[index + 1]] = typesEfficiciency;
      return generations;
    }, {} as Partial<ByGenerations<Record<string, TypeEfficiencies>>>);
  }
}
