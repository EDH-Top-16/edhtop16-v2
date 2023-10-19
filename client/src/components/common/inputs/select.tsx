import React from "react";

export default function Select({
  children,
  ...props
}: any): React.ReactElement {
  return (
    <select {...props} className="p-4">
      {children}
    </select>
  );
}
