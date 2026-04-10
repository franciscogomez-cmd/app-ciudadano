import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = { size?: number; color: string };

export function HistorialAlertasIcon({ size = 174, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 174 174" fill="none">
      <Path
        d="M116 159.5H130.5C134.346 159.5 138.034 157.972 140.753 155.253C143.472 152.534 145 148.846 145 145V58.0001C145.006 55.7026 144.556 53.4268 143.678 51.3039C142.799 49.1811 141.509 47.2532 139.881 45.6316L113.868 19.6186C112.247 17.9911 110.319 16.7009 108.196 15.8223C106.073 14.9438 103.797 14.4944 101.5 14.5001H43.5C39.6544 14.5001 35.9662 16.0277 33.2469 18.747C30.5277 21.4663 29 25.1544 29 29.0001V49.6626"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M101.5 14.5V50.75C101.5 52.6728 102.264 54.5169 103.623 55.8765C104.983 57.2362 106.827 58 108.75 58H145"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M58 101.5V117.45L69.6 124.7"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M58 159.5C82.0244 159.5 101.5 140.024 101.5 116C101.5 91.9756 82.0244 72.5 58 72.5C33.9756 72.5 14.5 91.9756 14.5 116C14.5 140.024 33.9756 159.5 58 159.5Z"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
