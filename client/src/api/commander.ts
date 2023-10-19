import { AxiosResponse } from "axios";

import api from "@/api/api";
import * as TFilters from "@/types/filters";
import * as TCommanders from "@/types/commanders";

export async function getCommanders(filters: TFilters.AllFiltersType) {
  // Validate the filters using schema
  console.log(filters);
  const v = TFilters.schemas.allFilters.safeParse(filters);
  if (!v.success) throw "Invalid filters";

  let res: AxiosResponse<TCommanders.CommandersType>;
  try {
    res = await api.post<TFilters.AllFiltersType>(
      "http://localhost:8000/api/commanders",
      filters,
      {},
      10000,
    );

    // Validate the response using schema
    // const v = TCommanders.schemas.commanders.safeParse(res.data);
    // if (!v.success) throw new Error("Invalid response");
  } catch (e) {
    // Do something with the error
  }

  return res;
}
