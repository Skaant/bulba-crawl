import { writeFile } from "fs/promises";
import { PagePokemon } from "../_types/PagePokemon";
import { getSection } from "../_utils/_lines-manipulation/getSection";
import { getFirstGenerationFromSection } from "./getFirstGenerationFromSection/getFirstGenerationFromSection";
import { getLearnsetFromSection } from "./getLearnsetFromSection/getLearnsetFromSection";
import { GENERATIONS_NUMBER_TO_ID } from "../_data/generationsNumberToId.data";
import { getCurrentGenerationFromSection } from "./getFirstGenerationFromSection/getCurrentGenerationFromSection";

export async function cachePokemonLearnsets(
  pokemonPage: string[],
  pagePokemon: PagePokemon
) {
  const learnsetSection = getSection(
    pokemonPage,
    "====By [[Level|leveling up]]"
  );
  if (learnsetSection) {
    const baseLearnsetSection =
      (pagePokemon.forms &&
        getSection(learnsetSection, `=====${pagePokemon.name}`)) ||
      learnsetSection;
    if (baseLearnsetSection) {
      const currentGeneration =
        getCurrentGenerationFromSection(baseLearnsetSection);
      const firstGeneration =
        getFirstGenerationFromSection(baseLearnsetSection);
      if (currentGeneration && firstGeneration) {
        const learnset = getLearnsetFromSection(
          baseLearnsetSection.slice(1),
          currentGeneration
        );
        const currentGenerationId =
          GENERATIONS_NUMBER_TO_ID[currentGeneration.toString()];
        console.log(
          `${pagePokemon.name} moves (${currentGenerationId}) : ${learnset.length}`
        ); /* 
        await writeFile(
          `./cache/refined/learnsets/${pagePokemon.name}_${currentGenerationId}.json`,
          JSON.stringify(learnset, undefined, 2),
          { encoding: "utf-8" }
        ); 
        
        Temporary */
        await writeFile(
          `./cache/refined/learnsets/${pagePokemon.name}.json`,
          JSON.stringify(learnset, undefined, 2),
          { encoding: "utf-8" }
        );
      }
    }
    if (pagePokemon.forms) {
      for (const form of pagePokemon.forms) {
        const formName = form.name.includes(pagePokemon.name)
          ? form.name
          : `${pagePokemon.name} (${form.name})`;
        const formBaseLearnsetSection = getSection(
          learnsetSection,
          `=====${form.name}`
        );
        if (formBaseLearnsetSection) {
          const formCurrentGeneration = getCurrentGenerationFromSection(
            formBaseLearnsetSection
          );
          const formFirstGeneration = getFirstGenerationFromSection(
            formBaseLearnsetSection
          );
          if (formCurrentGeneration && formFirstGeneration) {
            if (formBaseLearnsetSection) {
              const formLearnset = getLearnsetFromSection(
                formBaseLearnsetSection,
                formCurrentGeneration
              );
              const currentGenerationId =
                GENERATIONS_NUMBER_TO_ID[formCurrentGeneration.toString()];
              console.log(
                `${formName} moves (${currentGenerationId}) : ${formLearnset.length}`
              );
              await writeFile(
                `./cache/refined/learnsets/${formName}.json`,
                JSON.stringify(formLearnset, undefined, 2),
                { encoding: "utf-8" }
              );
            }
          }
        }
      }
    }
  }
  // const learnsetObject = getObject(learnsetSection)
}
