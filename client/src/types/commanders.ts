import { z } from "zod";

const Commander = z.object({
  colorID: z.string().optional(),
  wins: z.number().optional(),
  winsSwiss: z.number().optional(),
  winsBracket: z.number().optional(),
  draws: z.number().optional(),
  losses: z.number().optional(),
  lossesSwiss: z.number().optional(),
  lossesBracket: z.number().optional(),
  count: z.number().optional(),
  winRate: z.number().optional(),
  winRateSwiss: z.number().optional(),
  winRateBracket: z.number().optional(),
});

const Commanders = z.object({
  commanders: z.record(Commander),
});

const schemas = {
  commander: Commander,
  commanders: Commanders,
};

type CommanderType = z.infer<typeof Commander>;
type CommandersType = z.infer<typeof Commanders>;

export type { CommanderType, CommandersType };
export { schemas };
