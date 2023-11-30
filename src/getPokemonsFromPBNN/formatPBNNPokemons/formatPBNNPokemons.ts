import { PBNNPokemon } from "../../_types/PBNNPokemon";
import { Types } from "../../_types/Types";

function getTypes(values: string[], index: number): Types {
  const type1 = values[index];
  const type2 = values[index + 1];
  return type2 && !type2.startsWith("forms=") ? [type1, type2] : [type1];
}

export function formatPBNNPokemons(line: string, index?: number): PBNNPokemon {
  let values = line.slice(2, line.indexOf("}}")).split("|");
  console.log(`== Formating #${values[1]} ${values[2]} (${index}) ==`);
  const isFormLine = values[0].startsWith("ndex/form");
  const isInitialForm = values[3].startsWith("iform=");
  const formId = isFormLine
    ? values[3]
    : isInitialForm && values[3].split("=")[1];
  const formName = values[0].startsWith("ndex/form")
    ? values[4]
    : formId
    ? isInitialForm && values[4].split("=")[1]
    : values[3].split("=")[1];
  let types = getTypes(
    values,
    formId
      ? // Regional/alternative form
        5
      : formName
      ? isFormLine
        ? // Alternative form without id
          5
        : // Single & initial form
          4
      : // No form
        3
  );
  (formId || formName) &&
    console.log(
      `  > Forms : ${formName ? `${formName}` : ""}${
        formId && formName ? " " : ""
      }${formId ? `(${formId})` : ""}`
    );
  console.log(`  > Types : ${types.join(", ")}`);
  return {
    ndex: parseInt(values[1]),
    name: values[2],
    ...(formId && { formId }),
    ...(formName && { formName }),
    types,
  };
}
