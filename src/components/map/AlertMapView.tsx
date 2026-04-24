import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
} from "@maplibre/maplibre-react-native";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

const OPENFREEMAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

type AlertMapViewProps = {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  colorHex?: string;
  height?: number;
};

export function AlertMapView({
  latitude,
  longitude,
  radiusKm,
  colorHex = "#EF4444",
  height = 200,
}: AlertMapViewProps) {

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
