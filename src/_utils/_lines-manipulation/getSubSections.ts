import { getSection } from "./getSection";

export function getSubSections(
  lines: string[],
  parentSectionLevel: number
): { name: string; lines: string[] }[] | undefined {
  const subSections: { name: string; lines: string[] }[] = lines
    .filter((line) => line.startsWith("".padEnd(parentSectionLevel + 1, "=")))
    .map((line) => ({
      name: line.slice(parentSectionLevel + 1),
      lines: getSection(lines, line) ?? [],
    }));
  return subSections.length ? subSections : undefined;
}
