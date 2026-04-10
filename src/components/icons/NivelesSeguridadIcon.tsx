import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = { size?: number; color: string };

export function NivelesSeguridadIcon({ size = 174, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 174 174" fill="none">
      <Path
        d="M36.25 152.25V108.75"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M87 152.25V65.25"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M137.75 152.25V21.75"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
