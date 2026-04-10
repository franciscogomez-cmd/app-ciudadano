import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = { size?: number; color: string };

export function ActivaNotificacionesIcon({ size = 174, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 174 174" fill="none">
      <Path
        d="M74.4434 152.25C75.716 154.454 77.5465 156.284 79.7507 157.557C81.9549 158.829 84.4552 159.499 87.0004 159.499C89.5455 159.499 92.0458 158.829 94.25 157.557C96.4542 156.284 98.2847 154.454 99.5574 152.25"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M159.5 58C159.5 41.325 153.7 26.825 145 14.5"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M23.6491 111.114C22.702 112.152 22.077 113.443 21.85 114.829C21.6231 116.216 21.8041 117.639 22.371 118.925C22.9378 120.21 23.8661 121.304 25.0429 122.072C26.2198 122.84 27.5944 123.249 28.9996 123.25H145C146.405 123.251 147.78 122.843 148.957 122.076C150.135 121.31 151.064 120.218 151.633 118.933C152.201 117.648 152.384 116.225 152.159 114.838C151.933 113.452 151.31 112.16 150.365 111.121C140.722 101.181 130.5 90.6178 130.5 58C130.5 46.4631 125.917 35.3987 117.759 27.2409C109.601 19.083 98.5365 14.5 86.9996 14.5C75.4627 14.5 64.3983 19.083 56.2404 27.2409C48.0826 35.3987 43.4996 46.4631 43.4996 58C43.4996 90.6178 33.2698 101.181 23.6491 111.114Z"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M29 14.5C20.3 26.825 14.5 41.325 14.5 58"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
