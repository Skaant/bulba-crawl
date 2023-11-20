import { readFile, writeFile } from "fs/promises";

export async function getCache<T>(cachePath: string): Promise<T | undefined> {
  try {
    const data = await readFile(cachePath, "utf-8");
    return JSON.parse(data) as T;
  } catch (error) {
    return undefined;
  }
}
