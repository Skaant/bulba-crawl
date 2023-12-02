import { STATS } from "../../_enums/stats.enum";
import { PagePokemon } from "../../_types/PagePokemon";
import * as getGenerationsSection from "../../_utils/_lines-manipulation/getGenerationsSection";
import { getCache } from "../../_utils/getCacheOrDownload/getCache";
import { processPokemonStats } from "./processPokemonStats";

describe("processPokemonStats", () => {
  test("Base case (#0001 Bulbasaur)", async () => {
    const page = await getCache<string[]>(
      "./cache/raw/pokemons/Bulbasaur.json"
    );
    if (!page) throw new Error("No page");
    const stats = await processPokemonStats(page, {
      name: "Bulbasaur",
      firstGeneration: 1,
    });
    expect(stats.type).toBe("no-form");
    if (stats.type === "no-form") {
      expect(stats.noForm["Generation I"]).toEqual({
        [STATS.HP]: 45,
        [STATS.ATTACK]: 49,
        [STATS.DEFENSE]: 49,
        [STATS.SP_ATTACK]: 65,
        [STATS.SP_DEFENSE]: 65,
        [STATS.SPEED]: 45,
      });
      expect(stats.noForm["Generation IX"]).toEqual({
        [STATS.HP]: 45,
        [STATS.ATTACK]: 49,
        [STATS.DEFENSE]: 49,
        [STATS.SP_ATTACK]: 65,
        [STATS.SP_DEFENSE]: 65,
        [STATS.SPEED]: 45,
      });
    }
  });
  test("Base case (#0016 Pidgey)", async () => {
    const page = await getCache<string[]>("./cache/raw/pokemons/Pidgey.json");
    if (!page) throw new Error("No page");
    const stats = await processPokemonStats(page, {
      name: "Pidgey",
      firstGeneration: 1,
    });
    expect(stats.type).toBe("no-form");
    if (stats.type === "no-form") {
      expect(stats.noForm["Generation I"]).toEqual({
        [STATS.HP]: 40,
        [STATS.ATTACK]: 45,
        [STATS.DEFENSE]: 40,
        [STATS.SP_ATTACK]: 35,
        [STATS.SP_DEFENSE]: 35,
        [STATS.SPEED]: 56,
      });
      expect(stats.noForm["Generation IX"]).toEqual({
        [STATS.HP]: 40,
        [STATS.ATTACK]: 45,
        [STATS.DEFENSE]: 40,
        [STATS.SP_ATTACK]: 35,
        [STATS.SP_DEFENSE]: 35,
        [STATS.SPEED]: 56,
      });
    }
  });
  test("Exact generations and onward (#0537 Seismitoad)", async () => {
    const page = await getCache<string[]>(
      "./cache/raw/pokemons/Seismitoad.json"
    );
    if (!page) throw new Error("No page");
    const stats = await processPokemonStats(page, {
      name: "Seismitoad",
      firstGeneration: 5,
    });
    expect(stats.type).toBe("no-form");
    if (stats.type === "no-form") {
      // Range
      expect(stats.noForm["Generation V"]).toEqual({
        [STATS.HP]: 105,
        [STATS.ATTACK]: 85,
        [STATS.DEFENSE]: 75,
        [STATS.SP_ATTACK]: 85,
        [STATS.SP_DEFENSE]: 75,
        [STATS.SPEED]: 74,
      });
      // Onward
      expect(stats.noForm["Generation VI"]).toEqual({
        [STATS.HP]: 105,
        [STATS.ATTACK]: 95,
        [STATS.DEFENSE]: 75,
        [STATS.SP_ATTACK]: 85,
        [STATS.SP_DEFENSE]: 75,
        [STATS.SPEED]: 74,
      });
      expect(stats.noForm["Generation IX"]).toEqual({
        [STATS.HP]: 105,
        [STATS.ATTACK]: 95,
        [STATS.DEFENSE]: 75,
        [STATS.SP_ATTACK]: 85,
        [STATS.SP_DEFENSE]: 75,
        [STATS.SPEED]: 74,
      });
    }
  });
  test("Range generations and onward (#0012 Butterfree)", async () => {
    const page = await getCache<string[]>(
      "./cache/raw/pokemons/Butterfree.json"
    );
    if (!page) throw new Error("No page");
    const stats = await processPokemonStats(page, {
      name: "Butterfree",
      firstGeneration: 1,
    });
    expect(stats.type).toBe("no-form");
    if (stats.type === "no-form") {
      // Range
      expect(stats.noForm["Generation I"]).toEqual({
        [STATS.HP]: 60,
        [STATS.ATTACK]: 45,
        [STATS.DEFENSE]: 50,
        [STATS.SP_ATTACK]: 80,
        [STATS.SP_DEFENSE]: 80,
        [STATS.SPEED]: 70,
      });
      expect(stats.noForm["Generation V"]).toEqual({
        [STATS.HP]: 60,
        [STATS.ATTACK]: 45,
        [STATS.DEFENSE]: 50,
        [STATS.SP_ATTACK]: 80,
        [STATS.SP_DEFENSE]: 80,
        [STATS.SPEED]: 70,
      });
      // Onward
      expect(stats.noForm["Generation VI"]).toEqual({
        [STATS.HP]: 60,
        [STATS.ATTACK]: 45,
        [STATS.DEFENSE]: 50,
        [STATS.SP_ATTACK]: 90,
        [STATS.SP_DEFENSE]: 80,
        [STATS.SPEED]: 70,
      });
      expect(stats.noForm["Generation IX"]).toEqual({
        [STATS.HP]: 60,
        [STATS.ATTACK]: 45,
        [STATS.DEFENSE]: 50,
        [STATS.SP_ATTACK]: 90,
        [STATS.SP_DEFENSE]: 80,
        [STATS.SPEED]: 70,
      });
    }
  });
  test("Regional form case (#037 Vulpix)", async () => {
    const raw = await getCache<string[]>("./cache/raw/pokemons/Vulpix.json");
    if (!raw) throw new Error("No page");
    const refined = (await getCache<PagePokemon>(
      "./cache/refined/pokemons/Vulpix.json"
    )) as PagePokemon;
    const stats = await processPokemonStats(raw, {
      name: "Vulpix",
      firstGeneration: 1,
      forms: refined.forms,
    });
    expect(stats.type).toBe("forms");
    if (stats.type === "forms") {
      expect(stats.baseForm).toBe("Vulpix");
      expect(stats.forms[stats.baseForm]["Generation I"]).toEqual({
        [STATS.HP]: 38,
        [STATS.ATTACK]: 41,
        [STATS.DEFENSE]: 40,
        [STATS.SP_ATTACK]: 50,
        [STATS.SP_DEFENSE]: 65,
        [STATS.SPEED]: 65,
      });
      expect(stats.forms["Alolan Vulpix"]["Generation VII"]).toEqual({
        [STATS.HP]: 38,
        [STATS.ATTACK]: 41,
        [STATS.DEFENSE]: 40,
        [STATS.SP_ATTACK]: 50,
        [STATS.SP_DEFENSE]: 65,
        [STATS.SPEED]: 65,
      });
      expect(stats.forms[stats.baseForm]["Generation IX"]).toEqual({
        [STATS.HP]: 38,
        [STATS.ATTACK]: 41,
        [STATS.DEFENSE]: 40,
        [STATS.SP_ATTACK]: 50,
        [STATS.SP_DEFENSE]: 65,
        [STATS.SPEED]: 65,
      });
    }
  });
  test("Base form generations & regional form case (#0026 Raichu)", async () => {
    const raw = await getCache<string[]>("./cache/raw/pokemons/Raichu.json");
    if (!raw) throw new Error("No page");
    const refined = (await getCache<PagePokemon>(
      "./cache/refined/pokemons/Raichu.json"
    )) as PagePokemon;
    const stats = await processPokemonStats(raw, {
      name: "Raichu",
      firstGeneration: 1,
      forms: refined.forms,
    });
    expect(stats.type).toBe("forms");
    if (stats.type === "forms") {
      expect(stats.baseForm).toBe("Raichu");
      expect(stats.forms[stats.baseForm]["Generation I"]).toEqual({
        [STATS.HP]: 60,
        [STATS.ATTACK]: 90,
        [STATS.DEFENSE]: 55,
        [STATS.SP_ATTACK]: 90,
        [STATS.SP_DEFENSE]: 80,
        [STATS.SPEED]: 100,
      });
      expect(stats.forms["Raichu"]["Generation VI"]).toEqual({
        [STATS.HP]: 60,
        [STATS.ATTACK]: 90,
        [STATS.DEFENSE]: 55,
        [STATS.SP_ATTACK]: 90,
        [STATS.SP_DEFENSE]: 80,
        [STATS.SPEED]: 110,
      });
      expect(stats.forms["Alolan Raichu"]["Generation VII"]).toEqual({
        [STATS.HP]: 60,
        [STATS.ATTACK]: 85,
        [STATS.DEFENSE]: 50,
        [STATS.SP_ATTACK]: 95,
        [STATS.SP_DEFENSE]: 85,
        [STATS.SPEED]: 110,
      });
    }
  });
  describe("Edge cases :", () => {
    test("Level 3 section (#0078 Rapidash)", async () => {
      const raw = await getCache<string[]>(
        "./cache/raw/pokemons/Rapidash.json"
      );
      if (!raw) throw new Error("No page");
      const refined = await getCache<PagePokemon>(
        "./cache/refined/pokemons/Rapidash.json"
      );
      if (!refined) throw new Error("No page pokemon object");
      const stats = await processPokemonStats(raw, {
        name: "Rapidash",
        firstGeneration: 1,
        forms: refined.forms,
        formName: refined.formName,
      });
      expect(stats.type).toBe("forms");
      if (stats.type === "forms") {
        expect(stats.forms["Rapidash"]["Generation I"]).toEqual({
          [STATS.HP]: 65,
          [STATS.ATTACK]: 100,
          [STATS.DEFENSE]: 70,
          [STATS.SP_ATTACK]: 80,
          [STATS.SP_DEFENSE]: 80,
          [STATS.SPEED]: 105,
        });
        expect(stats.forms["Rapidash"]["Generation IX"]).toEqual({
          [STATS.HP]: 65,
          [STATS.ATTACK]: 100,
          [STATS.DEFENSE]: 70,
          [STATS.SP_ATTACK]: 80,
          [STATS.SP_DEFENSE]: 80,
          [STATS.SPEED]: 105,
        });
        expect(stats.forms["Galarian Rapidash"]["Generation IX"]).toEqual({
          [STATS.HP]: 65,
          [STATS.ATTACK]: 100,
          [STATS.DEFENSE]: 70,
          [STATS.SP_ATTACK]: 80,
          [STATS.SP_DEFENSE]: 80,
          [STATS.SPEED]: 105,
        });
      }
    });
    test("}} inside infobox (#0101 Electrode)", async () => {
      const spyGetGenerationsSection = jest.spyOn(
        getGenerationsSection,
        "getGenerationsSection"
      );
      const raw = await getCache<string[]>(
        "./cache/raw/pokemons/Electrode.json"
      );
      if (!raw) throw new Error("No page");
      const refined = await getCache<PagePokemon>(
        "./cache/refined/pokemons/Electrode.json"
      );
      if (!refined) throw new Error("No page pokemon object");
      const stats = await processPokemonStats(raw, {
        name: "Electrode",
        firstGeneration: 1,
        forms: refined.forms,
        formName: refined.formName,
      });
      expect(spyGetGenerationsSection.mock.calls[0][1]).toBe(5);
      expect(stats.type).toBe("forms");
      if (stats.type === "forms") {
        expect(stats.forms["Electrode"]["Generation I"]).toEqual({
          [STATS.HP]: 60,
          [STATS.ATTACK]: 50,
          [STATS.DEFENSE]: 70,
          [STATS.SP_ATTACK]: 80,
          [STATS.SP_DEFENSE]: 80,
          [STATS.SPEED]: 140,
        });
        expect(stats.forms["Electrode"]["Generation IX"]).toEqual({
          [STATS.HP]: 60,
          [STATS.ATTACK]: 50,
          [STATS.DEFENSE]: 70,
          [STATS.SP_ATTACK]: 80,
          [STATS.SP_DEFENSE]: 80,
          [STATS.SPEED]: 150,
        });
        expect(stats.forms["Hisuian Electrode"]["Generation IX"]).toEqual({
          [STATS.HP]: 60,
          [STATS.ATTACK]: 50,
          [STATS.DEFENSE]: 70,
          [STATS.SP_ATTACK]: 80,
          [STATS.SP_DEFENSE]: 80,
          [STATS.SPEED]: 150,
        });
      }
    });
    test("|-ending object (#0177 Natu)", async () => {
      const raw = await getCache<string[]>("./cache/raw/pokemons/Natu.json");
      if (!raw) throw new Error("No page");
      const refined = await getCache<PagePokemon>(
        "./cache/refined/pokemons/Natu.json"
      );
      if (!refined) throw new Error("No page pokemon object");
      const stats = await processPokemonStats(raw, {
        name: "Natu",
        firstGeneration: refined.firstGeneration,
        forms: refined.forms,
        formName: refined.formName,
      });
      expect(stats.type).toBe("no-form");
      if (stats.type === "no-form") {
        expect(stats.noForm["Generation II"]).toEqual({
          [STATS.HP]: 40,
          [STATS.ATTACK]: 50,
          [STATS.DEFENSE]: 45,
          [STATS.SP_ATTACK]: 70,
          [STATS.SP_DEFENSE]: 45,
          [STATS.SPEED]: 70,
        });
        expect(stats.noForm["Generation IX"]).toEqual({
          [STATS.HP]: 40,
          [STATS.ATTACK]: 50,
          [STATS.DEFENSE]: 45,
          [STATS.SP_ATTACK]: 70,
          [STATS.SP_DEFENSE]: 45,
          [STATS.SPEED]: 70,
        });
      }
    });
    test("Alternative form level 5 instead of 4 (#0382 Kyogre)", async () => {
      const raw = await getCache<string[]>("./cache/raw/pokemons/Kyogre.json");
      if (!raw) throw new Error("No page");
      const refined = await getCache<PagePokemon>(
        "./cache/refined/pokemons/Kyogre.json"
      );
      if (!refined) throw new Error("No page pokemon object");
      const stats = await processPokemonStats(raw, refined);
      expect(stats.type).toBe("forms");
      if (stats.type === "forms") {
        expect(stats.forms["Kyogre"]["Generation III"]).toEqual({
          [STATS.HP]: 100,
          [STATS.ATTACK]: 100,
          [STATS.DEFENSE]: 90,
          [STATS.SP_ATTACK]: 150,
          [STATS.SP_DEFENSE]: 140,
          [STATS.SPEED]: 90,
        });
        expect(stats.forms["Kyogre"]["Generation IX"]).toEqual({
          [STATS.HP]: 100,
          [STATS.ATTACK]: 100,
          [STATS.DEFENSE]: 90,
          [STATS.SP_ATTACK]: 150,
          [STATS.SP_DEFENSE]: 140,
          [STATS.SPEED]: 90,
        });
        expect(stats.forms["Primal Kyogre"]["Generation IX"]).toEqual({
          [STATS.HP]: 100,
          [STATS.ATTACK]: 150,
          [STATS.DEFENSE]: 90,
          [STATS.SP_ATTACK]: 180,
          [STATS.SP_DEFENSE]: 160,
          [STATS.SPEED]: 90,
        });
      }
    });
    test("Stats section end section (#0901 Ursaluna)", async () => {
      const raw = await getCache<string[]>(
        "./cache/raw/pokemons/Ursaluna.json"
      );
      if (!raw) throw new Error("No page");
      const refined = await getCache<PagePokemon>(
        "./cache/refined/pokemons/Ursaluna.json"
      );
      if (!refined) throw new Error("No page pokemon object");
      const stats = await processPokemonStats(raw, refined);
      expect(stats.type).toBe("forms");
      if (stats.type === "forms") {
        expect(stats.forms["Ursaluna"]["Generation VIII"]).toEqual({
          [STATS.HP]: 130,
          [STATS.ATTACK]: 140,
          [STATS.DEFENSE]: 105,
          [STATS.SP_ATTACK]: 45,
          [STATS.SP_DEFENSE]: 80,
          [STATS.SPEED]: 50,
        });
        expect(stats.forms["Ursaluna"]["Generation IX"]).toEqual({
          [STATS.HP]: 130,
          [STATS.ATTACK]: 140,
          [STATS.DEFENSE]: 105,
          [STATS.SP_ATTACK]: 45,
          [STATS.SP_DEFENSE]: 80,
          [STATS.SPEED]: 50,
        });
        expect(stats.forms["Bloodmoon Ursaluna"]["Generation IX"]).toEqual({
          [STATS.HP]: 113,
          [STATS.ATTACK]: 70,
          [STATS.DEFENSE]: 120,
          [STATS.SP_ATTACK]: 135,
          [STATS.SP_DEFENSE]: 65,
          [STATS.SPEED]: 52,
        });
      }
    });
    test("No generation but versions section (#1002 Wo-Chien)", async () => {
      const raw = await getCache<string[]>(
        "./cache/raw/pokemons/Wo-Chien.json"
      );
      if (!raw) throw new Error("No page");
      const refined = await getCache<PagePokemon>(
        "./cache/refined/pokemons/Wo-Chien.json"
      );
      if (!refined) throw new Error("No page pokemon object");
      const stats = await processPokemonStats(raw, refined);
      expect(stats.type).toBe("no-form");
      if (stats.type === "no-form") {
        expect(stats.noForm["Generation IX"]).toEqual({
          [STATS.HP]: 85,
          [STATS.ATTACK]: 85,
          [STATS.DEFENSE]: 100,
          [STATS.SP_ATTACK]: 95,
          [STATS.SP_DEFENSE]: 135,
          [STATS.SPEED]: 70,
        });
      }
    });
    // Integration `getObject` single line case
    test("Single line stats (#1007 Koraidon)", async () => {
      const raw = await getCache<string[]>(
        "./cache/raw/pokemons/Koraidon.json"
      );
      if (!raw) throw new Error("No page");
      const refined = await getCache<PagePokemon>(
        "./cache/refined/pokemons/Koraidon.json"
      );
      if (!refined) throw new Error("No page pokemon object");
      const stats = await processPokemonStats(raw, refined);
      expect(stats.type).toBe("no-form");
      if (stats.type === "no-form") {
        expect(stats.noForm["Generation IX"]).toEqual({
          [STATS.HP]: 100,
          [STATS.ATTACK]: 135,
          [STATS.DEFENSE]: 115,
          [STATS.SP_ATTACK]: 85,
          [STATS.SP_DEFENSE]: 100,
          [STATS.SPEED]: 135,
        });
      }
    });
  });
});
