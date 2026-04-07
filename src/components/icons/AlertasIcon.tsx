import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = { size?: number; color?: string };

export function AlertasIcon({ size = 174, color = "#FFFFFF" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 174 174" fill="none">
      <Path
        d="M50.75 130.5V87C50.75 77.3859 54.5692 68.1656 61.3674 61.3674C68.1656 54.5692 77.3859 50.75 87 50.75C96.6141 50.75 105.834 54.5692 112.633 61.3674C119.431 68.1656 123.25 77.3859 123.25 87V130.5"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M36.25 152.25C36.25 154.173 37.0138 156.017 38.3735 157.377C39.7331 158.736 41.5772 159.5 43.5 159.5H130.5C132.423 159.5 134.267 158.736 135.627 157.377C136.986 156.017 137.75 154.173 137.75 152.25V145C137.75 141.154 136.222 137.466 133.503 134.747C130.784 132.028 127.096 130.5 123.25 130.5H50.75C46.9044 130.5 43.2162 132.028 40.497 134.747C37.7777 137.466 36.25 141.154 36.25 145V152.25Z"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M152.25 87H159.5"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M134.125 32.625L130.5 36.25"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.5 87H21.75"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M87 14.5V21.75"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M35.7354 35.7354L40.8611 40.8611"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M87 87V130.5"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
