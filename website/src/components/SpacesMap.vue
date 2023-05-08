<template>
  <div ref="map" class="w-full h-full mb-2 rounded-md overflow-hidden" />
</template>

<script lang="ts" setup>
import "maplibre-gl/dist/maplibre-gl.css";

import { computed, ref } from "vue";
import type { FeatureCollection, Point, Position } from "geojson";

import { useMap } from "~/compositions/useMap";

type Space = {
  _id: string;
  coordinates: { lng: number; lat: number };
};

const spaces = ref<Space[]>([]);

const geojson = computed<FeatureCollection>(() => ({
  type: "FeatureCollection",
  features: spaces.value.map((space) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [space.coordinates?.lng, space.coordinates?.lat] as Position,
    },
    properties: {
      id: space._id,
    },
  })),
}));

const selectedMarkerId = ref<string>();

const map = ref<HTMLElement>();
useMap({
  selectedMarkerId,
  geojson,
  clickHandler: (e) => {
    const features = e.target.queryRenderedFeatures(e.point, {
      layers: ["spaces"],
    });
  },
  container: map,
});
</script>
