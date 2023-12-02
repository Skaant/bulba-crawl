import { STATS } from "../../../_enums/stats.enum";
import { Stats } from "../../../_types/Stats";
import { getObject } from "../../../_utils/_lines-manipulation/getObject";

export function getStatsFromSection(section: string[]): Stats | undefined {
  const object = getObject(section);
  if (!object) return undefined;
  if (
    !object["HP"] ||
    !object["Attack"] ||
    !object["Defense"] ||
    !object["SpAtk"] ||
    !object["SpDef"] ||
    !object["Speed"]
  ) {
    throw new Error("Missing stats");
  }
  return {
    [STATS.HP]: +object["HP"],
    [STATS.ATTACK]: +object["Attack"],
    [STATS.DEFENSE]: +object["Defense"],
    [STATS.SP_ATTACK]: +object["SpAtk"],
    [STATS.SP_DEFENSE]: +object["SpDef"],
    [STATS.SPEED]: +object["Speed"],
  };
}
