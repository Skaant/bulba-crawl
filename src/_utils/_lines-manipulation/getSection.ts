export function getSection(
  lines: string[],
  /** Do not put ending "===". */
  section: string
): string[] | undefined {
  const sectionStartIndex = lines.findIndex((line) => line.startsWith(section));
  if (sectionStartIndex === -1) return undefined;
  const sectionLevel = section.split("=").length - 1;
  const sectionEndIndex = lines
    .slice(sectionStartIndex + 1)
    .findIndex(
      (line) =>
        line.startsWith("=") && (line.split("=").length - 1) / 2 <= sectionLevel
    );
  return lines
    .slice(
      sectionStartIndex + 1,
      sectionEndIndex === -1
        ? undefined
        : sectionStartIndex + sectionEndIndex + 1
    )
    .filter((line) => line !== "");
}
