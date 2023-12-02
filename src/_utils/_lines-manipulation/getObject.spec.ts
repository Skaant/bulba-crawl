import { getCache } from "../getCacheOrDownload/getCache";
import { getObject } from "./getObject";
import { getSection } from "./getSection";

describe("getObject", () => {
  test("one line object", async () => {
    const raw = await getCache<string[]>("./cache/raw/pokemons/Koraidon.json");
    if (!raw) throw new Error("No raw");
    const statsSection = getSection(raw, "====Base stats");
    if (!statsSection) throw new Error("No stats section");
    const object = getObject(statsSection);
    expect(object).toBeDefined();
    if (object) {
      expect(object["type"]).toEqual("Fighting");
      expect(object["type2"]).toEqual("Dragon");
    }
  });
});
