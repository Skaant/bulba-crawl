export function getObject(
  lines: string[],
  label?: string
): Record<string, string> | undefined {
  const _lines =
    lines.length === 1 ? lines?.[0].split("|").join("\n|").split("\n") : lines;
  const startIndex = _lines.findIndex((line) =>
    line.startsWith(label ? `{{${label}` : "{{")
  );
  if (startIndex === -1) return undefined;
  const endIndex = _lines.slice(startIndex).findIndex((line, index) => {
    return (
      (line.endsWith("}}") &&
        (!_lines[startIndex + index + 1] ||
          !_lines[startIndex + index + 1]?.startsWith("|"))) ||
      line === "}}"
    );
  });
  const objectLines = _lines.slice(
    startIndex + 1,
    endIndex === -1 ? undefined : startIndex + endIndex
  );
  objectLines.push(_lines[startIndex + endIndex].slice(0, -2));
  return objectLines.reduce((acc, line) => {
    const [key, value] = line
      .slice(line.startsWith("|") ? 1 : 0, line.endsWith("|") ? -1 : undefined)
      .split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
}
