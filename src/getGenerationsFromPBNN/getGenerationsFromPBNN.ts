export function getGenerationsFromPBNN(lines: string[]): string[] {
  return lines
    .filter((line) => line.startsWith("===[[Generation"))
    .map((line) => line.replace("===[[", "").replace("]]===", ""));
}
