export function getTextareaData(html: string) {
  const temp = html.match(/<textarea[\s\S]*?>([\s\S]*?)<\/textarea>/);
  return temp?.[0].split("\n") as string[];
}
