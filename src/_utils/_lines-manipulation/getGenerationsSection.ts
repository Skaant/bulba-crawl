import { GENERATIONS_ID_TO_NUMBER } from "../../_data/generationsIdToNumber.data";
import { GENERATIONS_NUMBER_TO_ID } from "../../_data/generationsNumberToId.data";
import { ByGenerations } from "../../_types/ByGenerations";
import { getSubSections } from "./getSubSections";

export function getGenerationsSection<T = string[]>(
  lines: string[],
  currentSectionLevel: number,
  firstGeneration: number = 1,
  transform?: (lines: string[]) => T
): ByGenerations<T> {
  const generationsBlocks = getSubSections(
    lines,
    currentSectionLevel,
    "Generation"
  );
  // No generations case
  if (!generationsBlocks) {
    const generations: ByGenerations<T> = {};
    const value = transform ? transform(lines) : (lines as T);
    for (let i = firstGeneration; i <= 9; i++) {
      generations[GENERATIONS_NUMBER_TO_ID[+i]] = value;
    }
    return generations;
  } else
    return generationsBlocks.reduce((generations, generationBlock) => {
      // Kind of a fix for data shape
      if (generationBlock.name === "Additional effects===") return generations;
      // Generation and onward
      if (generationBlock.name.includes("onward")) {
        const generationId = `Generation ${generationBlock.name.split(" ")[1]}`;
        const generationNumber =
          GENERATIONS_ID_TO_NUMBER[
            generationId as keyof typeof GENERATIONS_ID_TO_NUMBER
          ];
        for (let i = generationNumber; i <= 9; i++) {
          generations[GENERATIONS_NUMBER_TO_ID[i.toString()]] = transform
            ? transform(generationBlock.lines)
            : (generationBlock.lines as T);
        }
      }
      // Generations range
      else if (
        generationBlock.name.includes("-") ||
        generationBlock.name.includes(" to ")
      ) {
        const separator = generationBlock.name.includes("-") ? "-" : " to ";
        const splitBlockName = generationBlock.name
          .slice(separator === "-" ? 12 : 11, -currentSectionLevel - 1)
          .split(separator);
        const startGenerationId = `Generation ${splitBlockName[0]}`;
        const endGenerationId = `Generation ${splitBlockName[1]}`;
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
          generations[GENERATIONS_NUMBER_TO_ID[i.toString()]] = transform
            ? transform(generationBlock.lines)
            : (generationBlock.lines as T);
        }
      }
      // Single generation
      else {
        const generationId = `Generation ${
          generationBlock.name.split(" ")[1].split("=")[0]
        }`;
        generations[generationId] = transform
          ? transform(generationBlock.lines)
          : (generationBlock.lines as T);
      }
      return generations;
    }, {} as ByGenerations<T>);
}
