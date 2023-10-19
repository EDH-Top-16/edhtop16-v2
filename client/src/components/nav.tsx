import React from "react";
import Link from "next/link";
import Image from "next/image";

import { EGLogo } from "@/assets/images";
import NavLinks from "@/constants/navLinks";

// navitem typing
type NavItem = {
  href: string;
  label: string;
  icon: React.ReactElement;
};

export default function Navigation(): React.ReactElement {
  return (
    <nav className="fixed left-[-400px] flex h-screen w-nav flex-col items-center space-y-16 bg-purple-400 md:relative md:left-0">
      <Link className="mt-24" href="/">
        <div className="relative h-12 w-12">
          <Image
            fill
            style={{ objectFit: "cover" }}
            src={EGLogo}
            alt={"eminence gaming logo"}
          />
        </div>
      </Link>

      {NavLinks.map((props: NavItem, i: number) => (
        <NavItem key={i} {...props} />
      ))}
    </nav>
  );
}

const NavItem: React.FC<NavItem> = ({ href, label, icon }) => {
  return (
    <Link href={href} legacyBehavior passHref={true}>
      <a className="w-fit [&>svg]:w-8 [&>svg]:text-white" aria-label={label}>
        {icon}
      </a>
    </Link>
  );
};
