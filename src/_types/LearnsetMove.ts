export type LearnsetMove = {
  level: number;
  name: string;
  type: string;
  category: "physical" | "special" | "status";
  power: number;
  accuracy: number;
  pp: number;
};
