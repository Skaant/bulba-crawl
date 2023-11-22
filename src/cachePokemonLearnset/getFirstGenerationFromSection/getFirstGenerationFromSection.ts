export function getFirstGenerationFromSection(lines: string[]) {
  return (
    lines[0]?.startsWith("{{learnlist/levelh") &&
    parseInt(lines[0].slice(-3, -2))
  );
}
