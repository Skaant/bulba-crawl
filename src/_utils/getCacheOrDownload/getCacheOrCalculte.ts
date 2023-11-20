import { readFile, writeFile } from "fs/promises";

export async function getCacheOrCalculte<T>(
  cachePath: string,
  calculate: () => T,
  force = false
): Promise<T> {
  if (force) {
    const data = calculate();
    await writeFile(cachePath, JSON.stringify(data, undefined, 2), {
      encoding: "utf-8",
    });
    return data;
  }
  try {
    const data = await readFile(cachePath, "utf-8");
    return JSON.parse(data) as T;
  } catch (error) {
    const data = calculate();
    await writeFile(cachePath, JSON.stringify(data, undefined, 2), {
      encoding: "utf-8",
    });
    return data;
  }
}
