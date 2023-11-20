export function getObject(
  lines: string[],
  label?: string
): Record<string, string> | undefined {
  const startIndex = lines.findIndex((line) =>
    line.startsWith(label ? `{{${label}` : "{{")
  );
  if (startIndex === -1) return undefined;
  const endIndex = lines.slice(startIndex).findIndex((line, index) => {
    return (
      (line.endsWith("}}") && lines[startIndex + index + 1] === "") ||
      line === "}}"
    );
  });
  const objectLines = lines.slice(
    startIndex + 1,
    endIndex === -1 ? undefined : startIndex + endIndex
  );
  objectLines.push(lines[startIndex + endIndex].slice(0, -2));
  return objectLines.reduce((acc, line) => {
    const [key, value] = line.slice(1).split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
}
