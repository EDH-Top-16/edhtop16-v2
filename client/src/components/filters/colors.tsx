import React from "react";
import { useContext } from "react";

import { FilterContext } from "@/context/filter";
import BaseFilter, { HandleFilter } from "@/components/filters/base";
import allColors from "@/constants/allColors";
import { WUBRGify } from "@/utils/wubrgify";

export default function Colors(): React.ReactElement {
  const { filters } = useContext(FilterContext);

  // If filter has colorID, check which colors are enabled
  const enabled = filters.colorID?.split("");

  const handleColorID = (color: string, handleFilter: HandleFilter) => {
    let colorID: string = filters.colorID || "";

    // Check if colorID string already has color
    const colorExists: Boolean = !!filters.colorID?.includes(color);
    if (colorExists) {
      // If color exists, remove color from string
      colorID = colorID.replace(color, "");
    } else {
      // Check if color is colorless
      if (color === "C") {
        // If color is colorless, set colorID to colorless
        colorID = "C";
      } else {
        // Otherwise, add color to string
        colorID = WUBRGify(colorID + color);
      }
    }

    // If the colorID string is empty, remove colorID from filters
    let _colorID: string | undefined = colorID || undefined;

    // Pass into handleFilter
    handleFilter(_colorID, false);
  };

  return (
    <BaseFilter title={"Colors"} tag={"colorID"}>
      {({ handleFilter }: any) => (
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(allColors).map((color) => (
            <button
              onClick={() => handleColorID(color[0], handleFilter)}
              key={color[0]}
              className={
                "[&>svg]:w-10 " +
                (enabled?.includes(color[0])
                  ? "filter-btn-active"
                  : "filter-btn-inactive")
              }
            >
              {color[1]}
            </button>
          ))}
        </div>
      )}
    </BaseFilter>
  );
}
