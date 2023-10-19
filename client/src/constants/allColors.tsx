import React from "react";

import {
  WhiteIcon,
  BlueIcon,
  BlackIcon,
  RedIcon,
  GreenIcon,
  ColorlessIcon,
} from "@/assets/icons";

type Color = {
  [key: string]: React.ReactElement;
};

const allColors: Color = {
  W: <WhiteIcon />,
  U: <BlueIcon />,
  B: <BlackIcon />,
  R: <RedIcon />,
  G: <GreenIcon />,
  C: <ColorlessIcon />,
};

export default allColors;
