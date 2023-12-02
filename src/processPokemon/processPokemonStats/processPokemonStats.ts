import { writeFile } from "fs/promises";
import { PagePokemon } from "../../_types/PagePokemon";
import { getSection } from "../../_utils/_lines-manipulation/getSection";
import { getStatsFromSection } from "./getStatsFromSection/getStatsFromSection";
import { getGenerationsSection } from "../../_utils/_lines-manipulation/getGenerationsSection";
import { ByGenerations } from "../../_types/ByGenerations";
import { Stats } from "../../_types/Stats";
import { getSubSections } from "../../_utils/_lines-manipulation/getSubSections";

type ProcessPokemonStatsReturn =
  | {
      type: "no-form";
      noForm: ByGenerations<Stats>;
    }
  | {
      type: "forms";
      baseForm: string;
      forms: { [form: string]: ByGenerations<Stats> };
    };

export async function processPokemonStats(
  page: string[],
  pokemon: Pick<PagePokemon, "firstGeneration" | "formName" | "forms" | "name">
): Promise<ProcessPokemonStatsReturn> {
  let statsSection =
    getSection(page, "====Base stats") || getSection(page, "====Base Stats");

  // Fix for pages with stats section level 3 instead of 4
  const statsSectionLevel3Case = !statsSection
    ? getSection(page, "===Base stats") || getSection(page, "===Stats")
    : undefined;
  if (statsSectionLevel3Case) statsSection = statsSectionLevel3Case;

  if (!statsSection) throw new Error("No stats section");

  // Fix for pages with stats in version sections
  const versionsSectionCase = getSubSections(
    statsSection,
    statsSectionLevel3Case ? 3 : 4,
    "Version"
  )?.pop()?.lines;
  if (versionsSectionCase) statsSection = versionsSectionCase;

  const baseFormSection =
    pokemon.forms &&
    ((pokemon.formName &&
      getSection(
        statsSection,
        statsSectionLevel3Case
          ? `====${pokemon.formName}`
          : `=====${pokemon.formName}`
      )) ||
      getSection(
        statsSection,
        statsSectionLevel3Case ? `====${pokemon.name}` : `=====${pokemon.name}`
      ));
  const baseFormStats = getGenerationsSection(
    baseFormSection || statsSection,
    (baseFormSection ? 5 : 4) - (statsSectionLevel3Case ? 1 : 0),
    pokemon.firstGeneration,
    getStatsFromSection as (lines: string[]) => Stats
  );
  console.log(
    `${pokemon.name} stats (Generation IX)${
      baseFormSection ? " (base form)" : ""
    } : ${JSON.stringify(baseFormStats["Generation IX"])}`
  );
  await writeFile(
    `./cache/refined/stats/${pokemon.name}.json`,
    JSON.stringify(baseFormStats, undefined, 2),
    { encoding: "utf-8" }
  );

  if (!pokemon.forms) {
    return { type: "no-form", noForm: baseFormStats };
  } else {
    const forms: Record<string, ByGenerations<Stats>> = {};
    for (const form of pokemon.forms.filter(
      ({ name }) => name !== pokemon.name
    )) {
      const formName = form.name.includes(pokemon.name)
        ? form.name
        : `${pokemon.name} (${form.name})`;
      let formSection = getSection(
        statsSection,
        statsSectionLevel3Case ? `====${form.name}` : `=====${form.name}`
      );
      // Fix Kyogre (forms is lvl 5 instead of 4)
      if (statsSectionLevel3Case && !formSection) {
        formSection = getSection(statsSection, `=====${form.name}`);
      }
      if (formSection) {
        let formStats = getGenerationsSection(
          formSection,
          statsSectionLevel3Case ? 4 : 5,
          pokemon.firstGeneration,
          getStatsFromSection
        );
        if (!formStats["Generation IX"]) {
          formStats = baseFormStats;
        }
        console.log(
          `${formName} stats (Generation IX) : ${JSON.stringify(
            formStats["Generation IX"]
          )}`
        );
        await writeFile(
          `./cache/refined/stats/${formName}.json`,
          JSON.stringify(formStats, undefined, 2),
          { encoding: "utf-8" }
        );
        if (formStats) forms[formName] = formStats as ByGenerations<Stats>;
      } else console.log(`🤔 No stats for ${formName}`);
    }
    return {
      type: "forms",
      baseForm: pokemon.name,
      forms: {
        [pokemon.name]: baseFormStats,
        ...forms,
      },
    };
  }
}
