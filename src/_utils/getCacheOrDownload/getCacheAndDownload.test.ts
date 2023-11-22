import { getCacheOrDownload } from "./getCacheOrDownload";
import fs from "fs/promises";

describe("getCacheOrDownload", () => {
  it("should return data from cache if it exists", async () => {
    const cachePath = "/cache/pokemons-by-national-number.json";
    const url =
      "https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number";
    const expectedData = "cached data";

    // Mock the readFile function to return the expected data
    jest.spyOn(fs, "readFile").mockResolvedValue(expectedData);

    const data = await getCacheOrDownload(cachePath, url);

    expect(data).toBe(expectedData);
    expect(fs.readFile).toHaveBeenCalledWith(cachePath, "utf-8");
    expect(fetch).not.toHaveBeenCalled();
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it("should download data and save it to cache if cache does not exist", async () => {
    const cachePath = "/cache/pokemons-by-national-number.json";
    const url =
      "https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number";
    const expectedData = "downloaded data";

    // Mock the readFile function to throw an error
    jest.spyOn(fs, "readFile").mockRejectedValue(new Error("Cache not found"));

    // Mock the fetch function to return a successful response
    /* jest.spyOn(fetch, "fetch").mockResolvedValue({
      status: 200,
      text: jest.fn().mockResolvedValue(expectedData),
    } as Response); */

    // Mock the writeFile function
    jest.spyOn(fs, "writeFile").mockResolvedValue();

    const data = await getCacheOrDownload(cachePath, url);

    expect(data).toBe(expectedData);
    expect(fs.readFile).toHaveBeenCalledWith(cachePath, "utf-8");
    // expect(fetch).toHaveBeenCalledWith(url);
    expect(fs.writeFile).toHaveBeenCalledWith(cachePath, expectedData, {
      encoding: "utf-8",
    });
  });

  it("should throw an error if downloading the file fails", async () => {
    const cachePath = "/cache/pokemons-by-national-number.json";
    const url =
      "https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number";

    // Mock the readFile function to throw an error
    jest.spyOn(fs, "readFile").mockRejectedValue(new Error("Cache not found"));

    // Mock the fetch function to return an error response
    /* jest.spyOn(global, "fetch").mockResolvedValue({
      status: 500,
    }); */

    await expect(getCacheOrDownload(cachePath, url)).rejects.toThrow(
      "Error downloading file"
    );
    expect(fs.readFile).toHaveBeenCalledWith(cachePath, "utf-8");
    // expect(fetch).toHaveBeenCalledWith(url);
    expect(fs.writeFile).not.toHaveBeenCalled();
  });
});
