import React from "react";
import { useContext } from "react";

import { FilterContext } from "@/context/filter";
import BaseFilter, { HandleFilter } from "@/components/filters/base";
import Select from "@/components/common/inputs/select";

export default function Standing(): React.ReactElement {
  const { filters } = useContext(FilterContext);

  const handleStanding = (value: any, handleFilter: HandleFilter) => {
    const standing = Number(value.target.value);

    handleFilter({ $lte: standing }, false);
  };

  return (
    <BaseFilter title={"Tournament Size"} tag={"size"}>
      {({ handleFilter }: any) => (
        <div className="">
          <Select
            name="standing"
            id="standing"
            value={filters.standing?.$lte || -1}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleStanding(e, handleFilter)
            }
          >
            <option value="-1" disabled>
              Filter by Top X
            </option>
            <option value="1">Top 1</option>
            <option value="4">Top 4</option>
            <option value="16">Top 16</option>
            <option value="32">Top 32</option>
            <option value="64">Top 64</option>
          </Select>
        </div>
      )}
    </BaseFilter>
  );
}
