import { LearnsetMove } from "../../_types/LearnsetMove";

export function getLearnsetFromSection(
  lines: string[],
  currentGeneration: number
): LearnsetMove[] {
  return lines
    .filter((line) => line.startsWith(`{{learnlist/level${currentGeneration}`))
    .map((line) => {
      const values = line.slice(2, -2).split("|");
      return {
        level: parseInt(values[1]),
        name: values[2],
        type: values[3],
        category: values[4],
        power: parseInt(values[5]),
        accuracy: parseInt(values[6]),
        pp: parseInt(values[7]),
      } as LearnsetMove;
    });
}
