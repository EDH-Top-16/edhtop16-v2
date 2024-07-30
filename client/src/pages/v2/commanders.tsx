import {
  QueryParamKind,
  parseQuery,
  useQueryParams,
} from "@reverecre/next-query-params";
import Head from "next/head";
import { PropsWithChildren, useMemo } from "react";
import { graphql, useFragment, usePreloadedQuery } from "react-relay/hooks";
import { RelayProps, withRelay } from "relay-nextjs";
import { Banner } from "../../components/banner/banner";
import { Navigation } from "../../components/nav";
import { Table, TableColumnConfig } from "../../components/table";
import { getClientEnvironment } from "../../lib/client/relay_client_environment";
import {
  CommanderSortBy,
  SortDirection,
  commanders_CommandersQuery,
} from "../../queries/__generated__/commanders_CommandersQuery.graphql";
import { commanders_CommandersTableData$key } from "../../queries/__generated__/commanders_CommandersTableData.graphql";

const COMMANDERS_TABLE_COLUMN_CONFIG: TableColumnConfig[] = [
  {
    id: "name",
    displayName: "Commander",
    sortVariable: "NAME",
  },
  {
    id: "count",
    displayName: "Top 16s",
    sortVariable: "TOP_CUTS",
  },
  {
    id: "entries",
    displayName: "Entries",
    sortVariable: "ENTRIES",
  },

  {
    id: "conversion",
    displayName: "Conversion",
    sortVariable: "CONVERSION",
    showOnMobile: false,
  },
  {
    id: "colors",
    displayName: "Colors",
  },
];

function CommandersTable(props: {
  commanders: commanders_CommandersTableData$key;
}) {
  const commanders = useFragment(
    graphql`
      fragment commanders_CommandersTableData on Commander
      @relay(plural: true) {
        name
        breakdownUrl
        colorId
        conversionRate(filters: $filters)
        count(filters: $filters)
        topCuts(filters: $filters)
      }
    `,
    props.commanders,
  );

  return (
    <Table
      columns={COMMANDERS_TABLE_COLUMN_CONFIG}
      data={commanders.map((c) => {
        return {
          id: c.name,
          name: c.name,
          href: c.breakdownUrl,
          colorIdentity: c.colorId,
          metadata: {
            count: c.topCuts,
            entries: c.count,
            conversion: `${Math.round(c.conversionRate * 10000) / 100}%`,
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
                      ? "60"
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

const CommandersQuery = graphql`
  query commanders_CommandersQuery(
    $filters: Filters
    $sortBy: CommanderSortBy
    $sortDir: SortDirection
  ) {
    commanders(filters: $filters, sortBy: $sortBy, sortDir: $sortDir) {
      ...commanders_CommandersTableData
    }
  }
`;

function CommandersPage({
  preloadedQuery,
}: RelayProps<{}, commanders_CommandersQuery>) {
  const { commanders } = usePreloadedQuery(CommandersQuery, preloadedQuery);

  return (
    <>
      <Head>
        <title>EDH Top16</title>
      </Head>
      <CommandersPageShell>
        <CommandersTable commanders={commanders} />
      </CommandersPageShell>
    </>
  );
}

export default withRelay(CommandersPage, CommandersQuery, {
  fallback: (
    <CommandersPageShell>
      <Table columns={COMMANDERS_TABLE_COLUMN_CONFIG} />
    </CommandersPageShell>
  ),
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async (ctx) => {
    const { createServerEnvironment } = await import(
      "../../lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
  variablesFromContext: (ctx) => {
    let { sortBy, sortDir, ...filters } = parseQuery(ctx.query, {
      sortBy: QueryParamKind.STRING,
      sortDir: QueryParamKind.STRING,
      minSize: QueryParamKind.NUMBER,
      minEntries: QueryParamKind.NUMBER,
      minDate: QueryParamKind.STRING,
      maxSize: QueryParamKind.NUMBER,
      maxEntries: QueryParamKind.NUMBER,
      maxDate: QueryParamKind.STRING,
      colorId: QueryParamKind.STRING,
    });

    if (filters.minSize == null && filters.maxSize == null) {
      filters = { ...filters, minSize: 60 };
    }

    if (filters.minDate == null && filters.maxDate == null) {
      const now = new Date();
      now.setUTCFullYear(now.getUTCFullYear() - 1);
      filters = { ...filters, minDate: now.toISOString().split("T")[0] };
    }

    if (
      (sortBy != null && !isSortBy(sortBy)) ||
      (sortDir != null && !isSortDir(sortDir))
    ) {
      return { filters };
    }

    return { sortBy, sortDir, filters };
  },
});

function isSortBy(s: string): s is CommanderSortBy {
  return ["ENTRIES", "TOP_CUTS", "NAME", "CONVERSION"].includes(s);
}

function isSortDir(s: string): s is SortDirection {
  return ["ASC", "DESC"].includes(s);
}
