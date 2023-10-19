import React from "react";
import Image from "next/image";

import Searchbar from "@/components/banner/searchbar";
import Filter from "@/components/banner/filter";
import { BannerMask } from "@/assets/images";

type BannerProps = {
  title: string;
};

export default function Banner({ title }: BannerProps): React.ReactElement {
  return (
    <div className="relative h-fit w-full bg-primary p-6">
      <span className="relative z-10 flex flex-col space-y-4">
        <h1 className="text-tertiary">{title}</h1>
        <Searchbar placeholder="Find Commander..." />
        <Filter />
      </span>
      <Image
        className="absolute right-0 top-0 z-0 float-right h-full w-full md:w-1/2"
        style={{ objectFit: "cover", objectPosition: "left" }}
        src={BannerMask}
        alt={"eminence gaming logo"}
      />
    </div>
  );
}
