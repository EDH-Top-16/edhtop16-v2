"use client";
import _ from "lodash";
import { useEffect, useContext } from "react";

import { enabledFilters, defaultFilters } from "@/constants/filters";
import { FilterContext } from "@/context/filter";
import { useGetCommandersQuery } from "@/store/services/edhtop16";
import { useDebounce } from "@/utils/useDebounce";

export default function CommandersPage(): {} {
  // Get the filters from the context
  const { filters, setFilters, setEnabled } = useContext(FilterContext);

  // Set the default filters for the commanders view
  useEffect(() => {
    setEnabled(enabledFilters.commanders);
    setFilters(defaultFilters.commanders);
  }, []);

  const debouncedFilters = useDebounce(filters);

  const { data: commanders, isFetching, isLoading} = useGetCommandersQuery(defaultFilters.commanders);

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
            <tr key={name}>
              <td>{i + 1}</td>
              <td>{name}</td>
              <td>{commanders[name]?.topCuts}</td>
              <td>{commanders[name]?.count}</td>
              <td>{Number((commanders[name]?.conversionRate || 0) * 100).toPrecision(3)}</td>
              <td>{commanders[name]?.colorID}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
