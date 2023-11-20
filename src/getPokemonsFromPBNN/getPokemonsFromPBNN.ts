import { PBNNPokemon } from "../_types/PBNNPokemon";

export function getPokemonsFromPBNN(lines: string[]): PBNNPokemon[] {
  return lines
    .filter((line) => line.startsWith("{{ndex") && !line.startsWith("{{ndexh"))
    .map((line) => {
      let values = line.replace("{{", "").replace("}}", "").split("|");
      const _iform = values[3].startsWith("iform=");
      const initialForm = values[_iform ? 4 : 3].startsWith("formname=")
        ? values[_iform ? 4 : 3].split("=")[1]
        : undefined;
      const form = values[0].startsWith("ndex/form") ? values[4] : undefined;
      let types: [string] | [string, string];
      if (initialForm) {
        types = [values[_iform ? 5 : 4]];
        if (
          values[_iform ? 6 : 5] &&
          !values[_iform ? 6 : 5].startsWith("forms=")
        ) {
          types.push(values[_iform ? 6 : 5]);
        }
      } else if (form) {
        types = [values[5]];
        if (values[6]) {
          types.push(values[6]);
        }
      } else {
        types = [values[3]];
        if (values[4] && !values[4].startsWith("forms=")) {
          types.push(values[4]);
        }
      }
      return {
        ndex: parseInt(values[1]),
        name: values[2],
        ...(initialForm
          ? {
              form: initialForm,
            }
          : form
          ? { form }
          : {}),
        types,
      };
    });
}
