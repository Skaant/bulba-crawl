export function getTypeObjectProperties(value: string): string[] {
  return (value.match(/{{TypeIcon\|([A-Z][a-z]+)}}/g) || []).map((match) =>
    match.slice(11, -2)
  );
}
