"use client";
import _ from "lodash";
import { useEffect, useContext, useState } from "react";
import { getCommanders } from "@/api/commander";

import { enabledFilters, defaultFilters } from "@/constants/filters";
import { CommanderType, CommandersType, schemas } from "@/types/commanders";
import { FilterContext } from "@/context/filter";

export default function CommandersPage(): {} {
  // Get the filters from the context
  const { filters, setFilters, setEnabled } = useContext(FilterContext);

  const [commanders, setCommanders] = useState<CommandersType>();

  // Set the default filters for the commanders view
  useEffect(() => {
    setEnabled(enabledFilters.commanders);
    setFilters(defaultFilters.commanders);
  }, []);

  // Fetch the commanders
  useEffect(() => {
    if (_.isEmpty(filters)) return; // If filters is empty, don't fetch

    (async () => {
      const { data }: { data: CommandersType } = await getCommanders(filters);
      if (data) setCommanders(data);
      else setCommanders(undefined);
    })();
  }, [filters]);

  return (
    <table className="w-full">
      <thead>
        <tr>
          <td>#</td>
          <td>Name</td>
          <td>Top 16s</td>
          <td>Entries</td>
          <td>Conversion</td>
          <td>Colors</td>
        </tr>
      </thead>
      <tbody>
        {/* Commanders is an object with key being commander name */}
        {commanders &&
          Object.keys(commanders).map((name: string, i: number) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{name}</td>
              <td>{commanders[name]?.topCuts}</td>
              <td>{commanders[name]?.count}</td>
              <td>{commanders[name]?.conversion}</td>
              <td>{commanders[name]?.colors}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
