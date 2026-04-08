import React from "react";
import Svg, { Path } from "react-native-svg";

export function UltimasNoticiasIcon({
  size = 72,
  color = "#79142A",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <Path
        d="M33 18C42.1241 18.235 51.0417 15.2625 58.2 9.6C58.6457 9.26572 59.1757 9.06216 59.7306 9.01212C60.2855 8.96209 60.8433 9.06756 61.3416 9.31672C61.84 9.56588 62.259 9.94888 62.552 10.4228C62.8449 10.8967 63 11.4429 63 12V48C63 48.5571 62.8449 49.1033 62.552 49.5772C62.259 50.0511 61.84 50.4341 61.3416 50.6833C60.8433 50.9324 60.2855 51.0379 59.7306 50.9879C59.1757 50.9379 58.6457 50.7343 58.2 50.4C51.0417 44.7375 42.1241 41.765 33 42H15C13.4087 42 11.8826 41.3679 10.7574 40.2426C9.63214 39.1174 9 37.5913 9 36V24C9 22.4087 9.63214 20.8826 10.7574 19.7574C11.8826 18.6321 13.4087 18 15 18H33Z"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 42C18 49.7893 20.5264 57.3685 25.2 63.6C26.1548 64.873 27.5762 65.7147 29.1515 65.9397C30.7268 66.1647 32.327 65.7548 33.6 64.8C34.873 63.8452 35.7147 62.4238 35.9397 60.8485C36.1647 59.2732 35.7548 57.673 34.8 56.4C31.6843 52.2457 30 47.1929 30 42"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M24 18V42"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
