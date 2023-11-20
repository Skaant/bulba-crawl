import { writeFile } from "fs/promises";
import { PagePokemon } from "../_types/PagePokemon";
import { getObject } from "../_utils/_lines-manipulation/getObject";
import { getSection } from "../_utils/_lines-manipulation/getSection";
import { getStatsFromBaseStatsObject } from "./getStatsFromBaseStatsObject/getStatsFromBaseStatsObject";

export async function cachePokemonStats(
  pokemonPage: string[],
  pagePokemon: PagePokemon
) {
  const statsSection = getSection(pokemonPage, "====Base stats");
  if (statsSection) {
    const baseStatsSection =
      (pagePokemon.forms &&
        getSection(statsSection, `=====${pagePokemon.name}`)) ||
      statsSection;
    if (baseStatsSection) {
      const stats = getStatsFromBaseStatsObject(
        getObject(baseStatsSection) || {}
      );
      console.log(`${pagePokemon.name} stats : ${JSON.stringify(stats)}`);
      await writeFile(
        `./cache/refined/stats/${pagePokemon.name}.json`,
        JSON.stringify(stats, undefined, 2),
        { encoding: "utf-8" }
      );
    }
    if (pagePokemon.forms) {
      for (const form of pagePokemon.forms) {
        const formName = form.name.includes(pagePokemon.name)
          ? form.name
          : `${pagePokemon.name} (${form.name})`;
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
