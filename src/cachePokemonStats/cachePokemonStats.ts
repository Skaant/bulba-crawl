import { writeFile } from "fs/promises";
import { PagePokemon } from "../_types/PagePokemon";
import { getObject } from "../_utils/_lines-manipulation/getObject";
import { getSection } from "../_utils/_lines-manipulation/getSection";
import { getStatsFromBaseStatsObject } from "./getStatsFromBaseStatsObject/getStatsFromBaseStatsObject";

export async function cachePokemonStats(page: string[], pokemon: PagePokemon) {
  const statsSection = getSection(page, "====Base stats");
  if (statsSection) {
    const baseStatsSection =
      (pokemon.forms && getSection(statsSection, `=====${pokemon.name}`)) ||
      statsSection;
    if (baseStatsSection) {
      const stats = getStatsFromBaseStatsObject(
        getObject(baseStatsSection) || {}
      );
      console.log(`${pokemon.name} stats : ${JSON.stringify(stats)}`);
      await writeFile(
        `./cache/refined/stats/${pokemon.name}.json`,
        JSON.stringify(stats, undefined, 2),
        { encoding: "utf-8" }
      );
    }
    if (pokemon.forms) {
      for (const form of pokemon.forms) {
        const formName = form.name.includes(pokemon.name)
          ? form.name
          : `${pokemon.name} (${form.name})`;
        const formStatsSection = getSection(statsSection, `=====${form.name}`);
        if (formStatsSection) {
          const formStatsObject = getObject(formStatsSection);
          const formStatsStats =
            (formStatsObject && getStatsFromBaseStatsObject(formStatsObject)) ||
            (baseStatsSection &&
              getStatsFromBaseStatsObject(getObject(baseStatsSection) || {}));
          console.log(`${formName} stats : ${JSON.stringify(formStatsStats)}`);
          await writeFile(
            `./cache/refined/stats/${formName}.json`,
            JSON.stringify(formStatsStats, undefined, 2),
            { encoding: "utf-8" }
          );
        }
      }
    }
  }
}
