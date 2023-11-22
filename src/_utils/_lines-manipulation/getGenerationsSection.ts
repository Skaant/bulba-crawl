import { GENERATIONS_ID_TO_NUMBER } from "../../_data/generationsIdToNumber.data";
import { GENERATIONS_NUMBER_TO_ID } from "../../_data/generationsNumberToId.data";
import { ByGenerations } from "../../_types/ByGenerations";
import { getSubSections } from "./getSubSections";

export function getGenerationsSection(
  lines: string[],
  /** Do not put ending "===". */
  section: string,
  fillWithMostRecent = false
) {
  const generationsBlocks = getSubSections(lines, section);
  if (generationsBlocks === undefined) return undefined;
  return generationsBlocks.reduce((generations, generationBlock) => {
    if (generationBlock.name === "Additional effects===") return generations;
    if (generationBlock.name.includes("onward")) {
      const generationId = `Generation ${generationBlock.name.split(" ")[1]}`;
      const generationNumber =
        GENERATIONS_ID_TO_NUMBER[
          generationId as keyof typeof GENERATIONS_ID_TO_NUMBER
        ];
      for (let i = generationNumber; i <= 9; i++) {
        generations[GENERATIONS_NUMBER_TO_ID[i.toString()]] =
          generationBlock.lines;
      }
    } else if (generationBlock.name.split(" ").length === 2) {
      const generationId = `Generation ${
        generationBlock.name.split(" ")[1].split("=")[0]
      }`;
      generations[generationId] = generationBlock.lines;
    } else {
      const splitBlockName = generationBlock.name.slice(0, -3).split(" ");
      const startGenerationId = `Generation ${splitBlockName[1]}`;
      const endGenerationId = `Generation ${splitBlockName[3]}`;
      for (
        let i =
          GENERATIONS_ID_TO_NUMBER[
            startGenerationId as keyof typeof GENERATIONS_ID_TO_NUMBER
          ];
        i <=
        GENERATIONS_ID_TO_NUMBER[
          endGenerationId as keyof typeof GENERATIONS_ID_TO_NUMBER
        ];
        i++
      ) {
        generations[GENERATIONS_NUMBER_TO_ID[i.toString()]] =
          generationBlock.lines;
      }
    }
    return generations;
  }, {} as Partial<ByGenerations<string[]>>) as ByGenerations<string[]>;
}
