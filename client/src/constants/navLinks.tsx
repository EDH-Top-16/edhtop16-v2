import React from "react";

import { AboutIcon, BracketIcon, DeckIcon } from "@/assets/icons";

// navlink typing
type NavLink = {
  href: string;
  label: string;
  icon: React.ReactElement;
};

const NavLinks: NavLink[] = [
  { href: "/commanders", label: "commanders", icon: <DeckIcon /> },
  { href: "/tournaments", label: "tournaments", icon: <BracketIcon /> },
  { href: "/about", label: "about", icon: <AboutIcon /> },
];

export default NavLinks;
