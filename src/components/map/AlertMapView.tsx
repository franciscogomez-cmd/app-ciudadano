import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
} from "@maplibre/maplibre-react-native";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

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
    ? Math.max(8, 13.5 - Math.log2(radiusKm))
    : 14;

  function openInMaps() {
    void Linking.openURL(
      `https://maps.google.com/maps?q=${latitude},${longitude}`,
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <Map
        mapStyle={OPENFREEMAP_STYLE}
        style={styles.map}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <Camera
          center={[longitude, latitude]}
          zoom={zoomLevel}
          duration={0}
        />

        {zoneGeoJSON && (
          <GeoJSONSource id="zone" data={zoneGeoJSON}>
            <Layer
              id="zone-fill"
              type="fill"
              paint={{
                "fill-color": hexToRgba(colorHex, 0.18),
                "fill-outline-color": "transparent",
              }}
            />
            <Layer
              id="zone-border"
              type="line"
              paint={{
                "line-color": colorHex,
                "line-width": 2,
                "line-opacity": 0.9,
              }}
            />
          </GeoJSONSource>
        )}

        <GeoJSONSource id="center" data={centerGeoJSON}>
          <Layer
            id="center-pin"
            type="circle"
            paint={{
              "circle-radius": 7,
              "circle-color": colorHex,
              "circle-stroke-width": 2,
              "circle-stroke-color": "#FFFFFF",
            }}
          />
        </GeoJSONSource>
      </Map>

      {/* Overlay transparente — al tocar abre Google Maps */}
      <Pressable onPress={openInMaps} style={StyleSheet.absoluteFillObject}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>📍 Ver en Google Maps</Text>
        </View>
      </Pressable>
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
  badge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.52)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "Ubuntu_500Medium",
  },
});
