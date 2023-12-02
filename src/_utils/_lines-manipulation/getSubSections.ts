import { getSection } from "./getSection";

export function getSubSections(
  lines: string[],
  parentSectionLevel: number,
  lineStartsWith: string = ""
): { name: string; lines: string[] }[] | undefined {
  const _lineStartsWith =
    "".padEnd(parentSectionLevel + 1, "=") + lineStartsWith;
  const subSections: { name: string; lines: string[] }[] = lines
    .filter((line) => line.startsWith(_lineStartsWith))
    .map((line) => ({
      name: line.slice(parentSectionLevel + 1),
      lines: getSection(lines, line) ?? [],
    }));
  return subSections.length ? subSections : undefined;
}
