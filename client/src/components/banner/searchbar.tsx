import React from "react";

type SearchbarProps = {
  placeholder: string;
};

export default function Searchbar({
  placeholder,
}: SearchbarProps): React.ReactElement {
  return (
    <>
      <label htmlFor="searchbar" className="hidden"></label>
      <input
        id="searchbar"
        className="w-full md:w-2/6"
        type="text"
        placeholder={placeholder}
      />
    </>
  );
}
