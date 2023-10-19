import { z } from "zod";

const OperatorType = z.object({
  $lte: z.number().optional(),
  $lt: z.number().optional(),
  $eq: z.number().optional(),
  $gte: z.number().optional(),
  $gt: z.number().optional(),
  $ne: z.number().optional(),
  $in_: z.array(z.number()).optional(),
  $nin: z.array(z.number()).optional(),
  $regex: z.string().optional(),
  $exists: z.boolean().optional(),
  $mod: z.array(z.number()).optional(),
  $all_: z.array(z.number()).optional(),
  $elemMatch: z.object({}).optional(),
  $size: z.number().optional(),
});

const BaseFilters = z.object({
  name: z.string().optional(),
  profile: z.string().optional(),
  decklist: z.string().optional(),
  wins: OperatorType.optional(),
  winsSwiss: OperatorType.optional(),
  winsBracket: OperatorType.optional(),
  winRate: OperatorType.optional(),
  winRateSwiss: OperatorType.optional(),
  winRateBracket: OperatorType.optional(),
  draws: OperatorType.optional(),
  losses: OperatorType.optional(),
  lossesSwiss: OperatorType.optional(),
  lossesBracket: OperatorType.optional(),
  standing: OperatorType.optional(),
  colorID: z.string().optional(),
  commander: z.string().optional(),
});

const TournamentFilters = z.object({
  date: OperatorType.optional(),
  dateCreated: OperatorType.optional(),
  size: OperatorType.optional(),
  TID: z.string().optional(),
  tournamentName: z.string().optional(),
  swissNum: OperatorType.optional(),
  topCut: OperatorType.optional(),
});

const AllFilters = z.object({
  tournament_filters: TournamentFilters.optional(),
  ...BaseFilters.shape,
});

const schemas = {
  baseFilters: BaseFilters,
  tournamentFilters: TournamentFilters,
  allFilters: AllFilters,
};

type AllFiltersType = z.infer<typeof AllFilters>;
type BaseFiltersType = z.infer<typeof BaseFilters>;
type TournamentFiltersType = z.infer<typeof TournamentFilters>;

export type { AllFiltersType, BaseFiltersType, TournamentFiltersType };
export { schemas };
