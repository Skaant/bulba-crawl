export function getCurrentGenerationFromSection(lines: string[]) {
  return (
    lines[0]?.startsWith("{{learnlist/levelh") &&
    parseInt(lines[0]["{{learnlist/levelh/".length])
  );
}
