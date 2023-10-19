import React from "react";
import { useContext, useRef, useState } from "react";
import _ from "lodash";

import { AiOutlineClose, AiOutlinePlusCircle } from "react-icons/ai";
import { FilterContext } from "@/context/filter";
import { useClickOutside } from "@/utils/useClickOutside";

type BaseFilterProps = {
  children: any;
  title: string;
  tag: string;
};

export type HandleFilter = {
  (value: any, isHTMLElement?: boolean): void;
};

export default function BaseFilter({
  children,
  title,
  tag,
}: BaseFilterProps): React.ReactElement {
  const { filters, setFilters } = useContext(FilterContext);
  const [popup, setPopup] = useState(false);

  /**
   * Function to handle filter
   * @param value
   * @param isHTMLElement
   */
  const handleFilter: HandleFilter = (value, isHTMLElement = true) => {
    const _value: any = isHTMLElement ? value?.target?.value : value;
    const path: string = _.has(filters, `tournament_filters.${tag}`)
      ? `tournament_filters.${tag}`
      : tag;

    // Check if the value being passed in is undefined
    if (value === undefined) {
      // If value is undefined, remove tag from filters
      setFilters(_.omit(filters, [path]));
    } else {
      // Otherwise, add tag to filters
      setFilters(_.set({ ...filters }, path, _value));
    }
  };

  return (
    <span>
      {Object.keys(filters).includes(tag) ? (
        <button onClick={() => setPopup(true)} className="filter-btn-active">
          <p>{title}</p>
          <AiOutlineClose onClick={() => handleFilter(undefined)} />
        </button>
      ) : (
        <button onClick={() => setPopup(true)} className="filter-btn-inactive">
          <AiOutlinePlusCircle />
          <p>{title}</p>
        </button>
      )}
      {popup && <Popup setPopup={setPopup}>{children({ handleFilter })}</Popup>}
    </span>
  );
}

type PopupProps = {
  children: React.ReactElement | string;
  setPopup: (value: boolean) => void;
};

function Popup({ children, setPopup }: PopupProps): React.ReactElement {
  const popupRef = useRef(null);

  useClickOutside(popupRef, () => setPopup(false));

  return (
    <div ref={popupRef} className="popup absolute">
      {children}
    </div>
  );
}
