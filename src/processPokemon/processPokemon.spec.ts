import { PBNNPokemon } from "../_types/PBNNPokemon";
import * as getCacheOrCalculate from "../_utils/getCacheOrDownload/getCacheOrCalculate";
import * as getCacheOrDownload from "../_utils/getCacheOrDownload/getCacheOrDownload";
import { processPokemon } from "./processPokemon";

describe("processPokemon()", () => {
  test("Base integration", async () => {
    const spyRawPageCache = jest.spyOn(
      getCacheOrDownload,
      "getCacheOrDownload"
    );
    const spyRefinedPageCache = jest.spyOn(
      getCacheOrCalculate,
      "getCacheOrCalculate"
    );
    const temp = await processPokemon({
      name: "Ivysaur",
    } as PBNNPokemon);
    expect(spyRawPageCache).toHaveBeenCalled();
    expect(spyRefinedPageCache).toHaveBeenCalled();
    expect(temp.types).toEqual(["Grass", "Poison"]);
  });
});
