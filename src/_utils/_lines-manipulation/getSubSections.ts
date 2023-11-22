import { getSection } from "./getSection";

export function getSubSections(
  lines: string[],
  /** Do not put ending "===". */
  section: string
): { name: string; lines: string[] }[] | undefined {
  const sectionLines = getSection(lines, section);
  if (sectionLines === undefined) return undefined;
  const sectionLevel = section.split("=").length - 1;
  const subSections: { name: string; lines: string[] }[] = sectionLines
    .filter((line) => line.startsWith("".padEnd(sectionLevel + 1, "=")))
    .map((line) => ({
      name: line.slice(sectionLevel + 1),
      lines: getSection(sectionLines, line) ?? [],
    }));
  return subSections.length ? subSections : undefined;
}
