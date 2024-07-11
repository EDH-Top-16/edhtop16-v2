import { QueryParamKind, useQueryParams } from "@reverecre/next-query-params";
import Head from "next/head";
import { PropsWithChildren, useMemo } from "react";
import { graphql, useFragment, usePreloadedQuery } from "react-relay/hooks";
import { RelayProps, withRelay } from "relay-nextjs";
import { Banner } from "../../../components/banner/banner";
import { Navigation } from "../../../components/nav";
import { Table, TableColumnConfig } from "../../../components/table";
import { getClientEnvironment } from "../../../lib/client/relay_client_environment";
import { Commander_CommanderQuery } from "../../../queries/__generated__/Commander_CommanderQuery.graphql";
import { Commander_EntryTableData$key } from "../../../queries/__generated__/Commander_EntryTableData.graphql";
import {
  CommanderSortBy,
  SortDirection,
} from "../../../queries/__generated__/commanders_CommandersQuery.graphql";

const COMMANDERS_TABLE_COLUMN_CONFIG: TableColumnConfig[] = [
  {
    id: "name",
    displayName: "Player Name",
    sortVariable: "NAME",
  },
  { id: "standing", displayName: "Standing" },
  { id: "wins", displayName: "Wins" },
  { id: "losses", displayName: "Losses" },
  { id: "winRate", displayName: "Win Rate" },
  { id: "tournament", displayName: "Tournament" },
];

function EntriesTable(props: { entries: Commander_EntryTableData$key }) {
  const entries = useFragment(
    graphql`
      fragment Commander_EntryTableData on Entry @relay(plural: true) {
        player {
          name
        }

        tournament {
          name
        }

        id
        decklist
        standing
        wins
        losses
        draws
      }
    `,
    props.entries,
  );

  return (
    <Table
      // layout="WLD"
      columns={COMMANDERS_TABLE_COLUMN_CONFIG}
      data={entries.map((e) => {
        return {
          id: e.id,
          name: e.player?.name ?? "Unknown Player",
          href: e.decklist ?? undefined,
          metadata: {
            standing: e.standing,
            wins: e.wins,
            losses: e.losses,
            winRate: 0,
            tournament: e.tournament.name,
          },
        };
      })}
    />
  );
}

function CommandersPageShell({ children }: PropsWithChildren<{}>) {
  const [queryParams, updateQueryParams] = useQueryParams({
    minSize: QueryParamKind.STRING,
    maxSize: QueryParamKind.STRING,
    minEntries: QueryParamKind.STRING,
    maxEntries: QueryParamKind.STRING,
    minDate: QueryParamKind.STRING,
    maxDate: QueryParamKind.STRING,
    colorId: QueryParamKind.STRING,
  });

  const oneYearAgo = useMemo(() => {
    const now = new Date();
    now.setUTCFullYear(now.getUTCFullYear() - 1);
    return now.toISOString().split("T")[0];
  }, []);

  return (
    <div className="flex h-screen w-screen bg-secondary">
      <Navigation />
      <div className="flex flex-grow flex-col overflow-auto">
        <Banner
          title="View Decks"
          enableSearchbar
          filters={[
            {
              displayName: "Colors",
              variableName: "colorId",
              currentValue: queryParams.colorId,
              inputType: "colorId",
            },
            {
              displayName: "Entries",
              label: "Entries",
              variableName: [
                {
                  variableName: "minEntries",
                  label: "is greater than (≥)",
                  shortLabel: "≥",
                  currentValue: queryParams.minEntries,
                },
                {
                  variableName: "maxEntries",
                  label: "is less than (≤)",
                  shortLabel: "≤",
                  currentValue: queryParams.maxEntries,
                },
              ],
              inputType: "number",
            },
            {
              displayName: "Tournament Size",
              label: "Tournament Size",
              variableName: [
                {
                  variableName: "minSize",
                  label: "is greater than (≥)",
                  shortLabel: "≥",
                  currentValue:
                    queryParams.minSize == null && queryParams.maxSize == null
                      ? "64"
                      : queryParams.minSize,
                },
                {
                  variableName: "maxSize",
                  label: "is less than (≤)",
                  shortLabel: "≤",
                  currentValue: queryParams.maxSize,
                },
              ],
              inputType: "number",
            },
            {
              displayName: "Tournament Date",
              variableName: [
                {
                  variableName: "minDate",
                  label: "is after (≥)",
                  shortLabel: "≥",
                  currentValue:
                    queryParams.minDate == null && queryParams.maxDate == null
                      ? oneYearAgo
                      : queryParams.minDate,
                },
                {
                  variableName: "maxDate",
                  label: "is before (≤)",
                  shortLabel: "≤",
                  currentValue: queryParams.maxDate,
                },
              ],
              inputType: "date",
            },
          ]}
          onFilterChange={(nextValues) => {
            updateQueryParams(nextValues as any);
          }}
        />

        <main className="w-full bg-secondary px-2 py-4 text-white md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

const CommanderQuery = graphql`
  query Commander_CommanderQuery(
    # $filters: Filters
    # $sortBy: CommanderSortBy
    # $sortDir: SortDirection
    $commander: String!
  ) {
    commander(name: $commander) {
      entries {
        ...Commander_EntryTableData
      }
    }
  }
`;

function CommanderPage({
  preloadedQuery,
}: RelayProps<{}, Commander_CommanderQuery>) {
  const { commander } = usePreloadedQuery(CommanderQuery, preloadedQuery);

  return (
    <>
      <Head>
        <title>EDH Top16</title>
      </Head>
      <CommandersPageShell>
        <EntriesTable entries={commander.entries} />
      </CommandersPageShell>
    </>
  );
}

export default withRelay(CommanderPage, CommanderQuery, {
  fallback: (
    <CommandersPageShell>
      <Table columns={COMMANDERS_TABLE_COLUMN_CONFIG} />
    </CommandersPageShell>
  ),
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async (ctx) => {
    const { createServerEnvironment } = await import(
      "../../../lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
  // variablesFromContext: (ctx) => {
  //   let { sortBy, sortDir, ...filters } = parseQuery(ctx.query, {
  //     sortBy: QueryParamKind.STRING,
  //     sortDir: QueryParamKind.STRING,
  //     minSize: QueryParamKind.NUMBER,
  //     minEntries: QueryParamKind.NUMBER,
  //     minDate: QueryParamKind.STRING,
  //     maxSize: QueryParamKind.NUMBER,
  //     maxEntries: QueryParamKind.NUMBER,
  //     maxDate: QueryParamKind.STRING,
  //     colorId: QueryParamKind.STRING,
  //   });

  //   if (filters.minSize == null && filters.maxSize == null) {
  //     filters = { ...filters, minSize: 64 };
  //   }

  //   if (filters.minDate == null && filters.maxDate == null) {
  //     const now = new Date();
  //     now.setUTCFullYear(now.getUTCFullYear() - 1);
  //     filters = { ...filters, minDate: now.toISOString().split("T")[0] };
  //   }

  //   if (
  //     (sortBy != null && !isSortBy(sortBy)) ||
  //     (sortDir != null && !isSortDir(sortDir))
  //   ) {
  //     return { filters };
  //   }

  //   return { sortBy, sortDir, filters };
  // },
});

function isSortBy(s: string): s is CommanderSortBy {
  return ["ENTRIES", "TOP_CUTS", "NAME", "CONVERSION"].includes(s);
}

function isSortDir(s: string): s is SortDirection {
  return ["ASC", "DESC"].includes(s);
}
