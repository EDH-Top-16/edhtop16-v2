"use client";
import React from "react";

export default function Error({
  code,
  msg,
}: {
  code: number;
  msg: string;
}): React.ReactElement {
  return (
    <div>
      <h1>Error {code}</h1>
      <p>{msg}</p>
    </div>
  );
}
