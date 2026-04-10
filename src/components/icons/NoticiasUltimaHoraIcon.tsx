import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

type Props = {
  size?: number;
  fillColor: string;
  strokeColor: string;
};

export function NoticiasUltimaHoraIcon({
  size = 40,
  fillColor,
  strokeColor,
}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Circle cx={20} cy={20} r={20} fill={fillColor} fillOpacity={0.5} />
      <Circle cx={20.0005} cy={20} r={13.75} fill={fillColor} />
      <Path
        d="M19.3765 16.25C21.2773 16.299 23.1352 15.6797 24.6265 14.5C24.7193 14.4304 24.8297 14.3879 24.9453 14.3775C25.0609 14.3671 25.1772 14.3891 25.281 14.441C25.3848 14.4929 25.4721 14.5727 25.5331 14.6714C25.5941 14.7702 25.6265 14.8839 25.6265 15V22.5C25.6265 22.6161 25.5941 22.7298 25.5331 22.8286C25.4721 22.9273 25.3848 23.0071 25.281 23.059C25.1772 23.1109 25.0609 23.1329 24.9453 23.1225C24.8297 23.1121 24.7193 23.0696 24.6265 23C23.1352 21.8203 21.2773 21.201 19.3765 21.25H15.6265C15.2949 21.25 14.977 21.1183 14.7426 20.8839C14.5082 20.6495 14.3765 20.3315 14.3765 20V17.5C14.3765 17.1685 14.5082 16.8505 14.7426 16.6161C14.977 16.3817 15.2949 16.25 15.6265 16.25H19.3765Z"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.2515 21.25C16.2515 22.8728 16.7778 24.4518 17.7515 25.75C17.9504 26.0152 18.2465 26.1906 18.5747 26.2374C18.9029 26.2843 19.2362 26.1989 19.5015 26C19.7667 25.8011 19.942 25.505 19.9889 25.1768C20.0358 24.8486 19.9504 24.5152 19.7515 24.25C19.1024 23.3845 18.7515 22.3319 18.7515 21.25"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.5015 16.25V21.25"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
