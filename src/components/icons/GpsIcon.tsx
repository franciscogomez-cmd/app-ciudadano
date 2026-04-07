import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = { size?: number; color?: string };

export function GpsIcon({ size = 174, color = "#FFFFFF" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 174 174" fill="none">
      <Path
        d="M145 72.5C145 108.699 104.842 146.399 91.3572 158.043C90.101 158.987 88.5718 159.498 87 159.498C85.4282 159.498 83.899 158.987 82.6428 158.043C69.1578 146.399 29 108.699 29 72.5C29 57.1174 35.1107 42.3649 45.9878 31.4878C56.8649 20.6107 71.6174 14.5 87 14.5C102.383 14.5 117.135 20.6107 128.012 31.4878C138.889 42.3649 145 57.1174 145 72.5Z"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M87 94.25C99.0122 94.25 108.75 84.5122 108.75 72.5C108.75 60.4878 99.0122 50.75 87 50.75C74.9878 50.75 65.25 60.4878 65.25 72.5C65.25 84.5122 74.9878 94.25 87 94.25Z"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
