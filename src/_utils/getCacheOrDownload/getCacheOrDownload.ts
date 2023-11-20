import { readFile, writeFile } from "fs/promises";
import { get } from "https";
import { getTextareaData } from "./getTextareaData/getTextareaData";

async function download(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error("Error downloading file"));
      }
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(data);
      });
    });
  });
}

/** Extracts `textarea`'s content from the page */
export async function getCacheOrDownload(
  cachePath: string,
  url: string,
  force = false
): Promise<string[]> {
  if (force) {
    const data = getTextareaData(await download(url));
    await writeFile(cachePath, JSON.stringify(data, undefined, 2), {
      encoding: "utf-8",
    });
    return data;
  }
  try {
    const data = await readFile(cachePath, "utf-8");
    return JSON.parse(data) as string[];
  } catch (error) {
    console.log("Cache not found, downloading ...");
    const data = getTextareaData(await download(url));
    await writeFile(cachePath, JSON.stringify(data, undefined, 2), {
      encoding: "utf-8",
    });
    return data;
  }
}
