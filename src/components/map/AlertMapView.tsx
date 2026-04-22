import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
} from "@maplibre/maplibre-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

const OPENFREEMAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

type GeoJSONPolygon = {
  type: "Polygon";
  coordinates: [number, number][][];
};

type AlertMapViewProps = {
  latitude: number;
  longitude: number;
  /** Radio en km — dibuja un círculo sobre el mapa */
  radiusKm?: number;
  /** Polígono GeoJSON custom — tiene prioridad sobre radiusKm */
  polygon?: GeoJSONPolygon;
  /** Color hex de la zona (#FF0000) */
  colorHex?: string;
  height?: number;
};

function buildCirclePolygon(
  lat: number,
  lng: number,
  radiusKm: number,
  points = 64,
): GeoJSONPolygon {
  const coords: [number, number][] = [];
  const distX = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  const distY = radiusKm / 110.574;

  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    coords.push([lng + distX * Math.cos(angle), lat + distY * Math.sin(angle)]);
  }

  return { type: "Polygon", coordinates: [coords] };
}

function hexToRgba(hex: string, opacity: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

export function AlertMapView({
  latitude,
  longitude,
  radiusKm,
  polygon,
  colorHex = "#EF4444",
  height = 200,
}: AlertMapViewProps) {
  const zonePolygon =
    polygon ?? (radiusKm ? buildCirclePolygon(latitude, longitude, radiusKm) : null);

  const zoneGeoJSON = zonePolygon
    ? {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            geometry: zonePolygon,
            properties: {},
          },
        ],
      }
    : null;

  const centerGeoJSON = {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [longitude, latitude],
        },
        properties: {},
      },
    ],
  };

  const zoomLevel = radiusKm
    ? Math.max(8, 13 - Math.log2(radiusKm))
    : 13;

  return (
    <View style={[styles.container, { height }]}>
      <Map mapStyle={OPENFREEMAP_STYLE} style={styles.map} pitchEnabled={false} rotateEnabled={false}>
        <Camera
          centerCoordinate={[longitude, latitude]}
          zoomLevel={zoomLevel}
          animationDuration={0}
        />

        {zoneGeoJSON && (
          <GeoJSONSource id="zone" data={zoneGeoJSON}>
            <Layer
              id="zone-fill"
              type="fill"
              style={{
                fillColor: hexToRgba(colorHex, 0.18),
                fillOutlineColor: "transparent",
              }}
            />
            <Layer
              id="zone-border"
              type="line"
              style={{
                lineColor: colorHex,
                lineWidth: 2,
                lineOpacity: 0.9,
              }}
            />
          </GeoJSONSource>
        )}

        <GeoJSONSource id="center" data={centerGeoJSON}>
          <Layer
            id="center-pin"
            type="circle"
            style={{
              circleRadius: 7,
              circleColor: colorHex,
              circleStrokeWidth: 2,
              circleStrokeColor: "#FFFFFF",
            }}
          />
        </GeoJSONSource>
      </Map>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: "hidden",
    width: "100%",
  },
  map: {
    flex: 1,
  },
});
