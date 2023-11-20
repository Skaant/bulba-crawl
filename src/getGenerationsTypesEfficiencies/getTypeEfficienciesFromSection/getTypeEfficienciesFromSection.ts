import { TypeEfficiencies } from "../../_types/TypeEfficiencies";
import { getObject } from "../../_utils/_lines-manipulation/getObject";
import { getTypeObjectProperties } from "./getTypeObjectProperties";

export function getTypeEfficienciesFromSection(
  lines: string[]
): TypeEfficiencies {
  const offenseStartIndex = lines.findIndex((line) =>
    line.startsWith("{{TypeProperties")
  );
  const offenseEndIndex =
    lines.slice(offenseStartIndex).findIndex((line, index) => {
      const nextLine = lines[offenseStartIndex + index + 1];
      return (
        line === "}}" ||
        (line.endsWith("}}") && !(nextLine && nextLine.startsWith("|")))
      );
    }) +
    offenseStartIndex +
    1;
  const offenseObject = getObject(
    lines.slice(offenseStartIndex, offenseEndIndex + 1)
  );
  const defenseStartIndex =
    lines
      .slice(offenseEndIndex)
      .findIndex((line) => line.startsWith("{{TypeProperties")) +
    offenseEndIndex;
  const defenseEndIndex =
    lines.slice(defenseStartIndex).findIndex((line, index) => {
      const nextLine = lines[defenseStartIndex + index + 1];
      return (
        line === "}}" ||
        (line.endsWith("}}") && !(nextLine && nextLine.startsWith("|")))
      );
    }) +
    defenseStartIndex +
    1;
  const defenseObject = getObject(
    lines.slice(defenseStartIndex, defenseEndIndex + 1)
  );
  return {
    offense: {
      ...(offenseObject?.["se"]
        ? { strong: getTypeObjectProperties(offenseObject["se"]) }
        : {}),
      ...(offenseObject?.["nve"]
        ? { weak: getTypeObjectProperties(offenseObject["nve"]) }
        : {}),
      ...(offenseObject?.["immune"]
        ? { immune: getTypeObjectProperties(offenseObject["immune"]) }
        : {}),
    },
    defense: {
      ...(defenseObject?.["immune"]
        ? { immune: getTypeObjectProperties(defenseObject["immune"]) }
        : {}),
      ...(defenseObject?.["se"]
        ? { strong: getTypeObjectProperties(defenseObject["se"]) }
        : {}),
      ...(defenseObject?.["nve"]
        ? { weak: getTypeObjectProperties(defenseObject["nve"]) }
        : {}),
    },
  };
}
