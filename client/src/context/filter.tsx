import React, { createContext, useState } from "react";
import { z } from "zod";

import * as TFilters from "@/types/filters";

type FiltersType = TFilters.AllFiltersType;

type TFilterContext = {
  filters: FiltersType;
  setFilters: (value: FiltersType) => void;
  enabled: string[];
  setEnabled: React.Dispatch<React.SetStateAction<string[]>>;
};

export const FilterContext = createContext<TFilterContext>({
  filters: {},
  setFilters: () => {},
  enabled: [],
  setEnabled: () => {},
});

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, _setFilters] = useState<FiltersType>({});
  const [enabled, setEnabled] = useState<string[]>([]);

  const setFilters = (value: FiltersType) => {
    try {
      TFilters.schemas.allFilters.parse(value);
      _setFilters(value);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <FilterContext.Provider
      value={{ filters, setFilters, enabled, setEnabled }}
    >
      {children}
    </FilterContext.Provider>
  );
};
