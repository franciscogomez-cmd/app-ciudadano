import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

type Props = {
  size?: number;
  fillColor: string;
  strokeColor: string;
};

export function AlertaMeteorologicaIcon({
  size = 40,
  fillColor,
  strokeColor,
}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Circle cx={20} cy={20} r={20} fill={fillColor} fillOpacity={0.5} />
      <Circle cx={20.0005} cy={20} r={13.75} fill={fillColor} />
      <Path
        d="M16.2498 22.7035C15.5912 22.3908 15.0212 21.9184 14.5916 21.3294C14.162 20.7403 13.8865 20.0532 13.79 19.3305C13.6935 18.6079 13.7791 17.8725 14.0391 17.1914C14.2991 16.5102 14.7252 15.9048 15.2786 15.4302C15.8321 14.9557 16.4954 14.6269 17.2083 14.4739C17.9211 14.3209 18.6609 14.3484 19.3604 14.5541C20.0599 14.7597 20.6969 15.1369 21.2135 15.6513C21.7301 16.1658 22.11 16.8012 22.3186 17.4998H23.4373C24.157 17.4985 24.8498 17.7732 25.3731 18.2673C25.8964 18.7614 26.2104 19.4372 26.2504 20.1558C26.2904 20.8744 26.0535 21.581 25.5883 22.1301C25.1232 22.6793 24.4652 23.0292 23.7498 23.1079"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.6245 20L18.7495 23.125H21.2495L19.3745 26.25"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
