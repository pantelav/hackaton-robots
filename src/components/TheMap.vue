<template>
  <div class="wrapper">
    <div class="coords">{{ mouseLat }}, {{ mouseLon }}</div>
    <div id="map"></div>
    <Transition name="slide" mode="out-in">
      <StreetCardContainer class="card__container" v-if="deffectsMenu" />
      <RobotsCardContainer
        class="card__container"
        v-else-if="robotsMenu && !routesMenu"
      />
      <div class="routes__container" v-else-if="routesMenu && robotsMenu">
        <q-btn
          round
          icon="arrow_back"
          color="primary"
          @click="routesMenu = false"
          class="btn-back"
        />
        <RoutesCardContainer class="card__container" />
      </div>
    </Transition>
    <Transition name="fade">
      <DetailsCard v-if="detailsMenu" class="details" />
    </Transition>
    <div class="filter">
      <FilterMenu class="filter" />
    </div>
    <Transition name="fade">
      <SlideCard class="slide" v-if="activeSlide.id"/>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, inject, ref } from "vue";
import L from "leaflet";
import FilterMenu from "./FilterMenu.vue";
import StreetCardContainer from "./StreetCardContainer.vue";
import RobotsCardContainer from "./RobotsCardContainer.vue";
import RoutesCardContainer from "./RoutesCardContainer.vue";
import SlideCard from "./SlideCard.vue";
import DetailsCard from "./DetailsCard.vue";
import { useUiStore } from "src/stores/uiStore";
import { useMapStore } from "src/stores/mapStore";
import { useSlideStore } from "src/stores/uiStore";
import { storeToRefs } from "pinia";
import { layer, attribution } from "src/constants/map";
import "leaflet/dist/leaflet.css";
import { EventBus } from "quasar";
import { api } from "src/boot/axios";
import { IWebRoute } from "./models";

const bus = inject<EventBus>("bus") as EventBus;
const uiStore = useUiStore();
const mapStore = useMapStore();
const slideStore = useSlideStore();

const mouseLat = ref("0");
const mouseLon = ref("0");

const { activeSlide } = storeToRefs(slideStore);
const { deffectsMenu, robotsMenu, routesMenu, detailsMenu, filter } =
  storeToRefs(uiStore);
const { defects, circleMarkers, activeDefect, polylines } =
  storeToRefs(mapStore);
let map: L.Map | null = null;
const redLayer = L.layerGroup();
const greenLayer = L.layerGroup();
const blueLayer = L.layerGroup();

uiStore.$subscribe((mutation, state) => {
  // @ts-ignore
  const key = mutation.events?.key;
  if (!(key == "d" || key == "w" || key == "u")) return;
  toggleLayer(redLayer, filter.value.u);
  toggleLayer(greenLayer, filter.value.d);
  toggleLayer(blueLayer, filter.value.w);
});

function toggleLayer(layer: L.LayerGroup, filter: boolean) {
  const hasLayer = map?.hasLayer(layer);
  if (!hasLayer && filter) map?.addLayer(layer);
  if (hasLayer && !filter) map?.removeLayer(layer);
}

bus.on("addPoly", (data: L.Polyline) => {
  if (map) {
    data.addTo(map);
    map.fitBounds(data.getBounds());
  }
});
bus.on("deletePoly", (data: L.Polyline) => {
  data.remove();
});
bus.on("zoom", (id: string) => {
  const marker = circleMarkers.value.find((el) => el.id == id);
  if (!marker || !map) return;
  map.setView(marker.marker.getLatLng(), 17);
});
bus.on("change-type", (data: { id: string; type: "d" | "u" | "w" }) => {
  const color = data.type == "u" ? "red" : data.type == "d" ? "green" : "blue";
  const circle = circleMarkers.value.find((el) => el.id == data.id);
  if (!circle) return;
  circle.marker.setStyle({ color });
});
bus.on("repaint", (data: IWebRoute) => {
  const currentLine = polylines.value.find((el) => el.id == data.routeId);
  if (!currentLine) return;
  currentLine.polyline
    .addLatLng([data.latitude, data.longitude])
    .setStyle({ color: "green" });
});

onMounted(async () => {
  renderMap();

  const data = await api("/defects");
  defects.value = data.data;

  if (map != null) addMarkers(map);
});

function addMarkers(map: L.Map) {
  defects.value.forEach((defect) => {
    const color =
      defect.type == "u" ? "red" : defect.type == "d" ? "green" : "blue";
    const marker = L.circleMarker([defect.latitude, defect.longitude], {
      radius: 10,
      color,
      weight: 1,
    });
    if (defect.type == "u") redLayer.addLayer(marker);
    if (defect.type == "d") greenLayer.addLayer(marker);
    if (defect.type == "w") blueLayer.addLayer(marker);

    marker.on("click", () => {
      map.setView(marker.getLatLng(), 17);
      activeDefect.value = defect;
      detailsMenu.value = true;
    });
    circleMarkers.value.push({ id: defect.id, marker });
  });
  redLayer.addTo(map);
  greenLayer.addTo(map);
  blueLayer.addTo(map);
}

function renderMap() {
  map = L.map("map", {
    center: [55.7476, 37.6237],
    zoom: 11,
  });
  map.zoomControl.remove();
  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.tileLayer(layer, {
    attribution: attribution,
    maxZoom: 19,
    minZoom: 5,
  }).addTo(map);
  const a = document.querySelector(".leaflet-control-attribution");
  if (a) a.remove();
  map.on("mousemove", (e) => {
    mouseLat.value = e.latlng.lat.toFixed(4);
    mouseLon.value = e.latlng.lng.toFixed(4);
  });
}
</script>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100vh;
  position: relative;
}
#map {
  width: 100%;
  height: 100%;
  z-index: 50;
}

.card__container {
  padding-right: 5px;
  position: absolute;
  top: 20%;
  left: 50px;
  max-height: 75vh;
  overflow-y: scroll;
  z-index: 100;
}

.filter {
  position: absolute;
  top: 25px;
  right: 25px;
  z-index: 50;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(100px);
}

.details {
  position: absolute;
  bottom: 30px;
  right: 50px;
  z-index: 100;
}

.btn-back {
  z-index: 50;
  position: absolute;
  top: 10%;
  left: 50px;
}

.coords {
  padding: 10px;
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  background-color: rgba(128, 128, 128, 0.418);
  border-radius: 8px;
  color: white;
  z-index: 100;
}

.slide {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>
