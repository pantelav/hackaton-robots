<template>
  <div class="info__card" @click="getRoute" :class="{ selected }">
    <p class="name">{{ props.data.name }}</p>
    <div class="info">
      <p>{{ props.data.desc }}</p>
      <q-spinner-ball color="secondary" size="1.5em" v-if="loading" />
      <div class="status" v-if="props.data.isActive">
        <q-icon name="radio_button_checked" />
        <p>Онлайн</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from "vue";
import { api } from "src/boot/axios";
import { IApiPoint, IRoute, IWebRoute } from "./models";
import { useMapStore } from "src/stores/mapStore";
import { storeToRefs } from "pinia";
import L from "leaflet";
import { EventBus } from "quasar";
import { baseURL } from 'src/boot/axios';

const props = defineProps<{
  data: IRoute;
}>();

const bus = inject<EventBus>("bus") as EventBus;
const mapStore = useMapStore();
const { polylines } = storeToRefs(mapStore);
const loading = ref(false);
const selected = ref(false);
let ws: WebSocket | null = null;

onMounted(() => {
  const matches = polylines.value.find((el) => el.id == props.data.id);
  if (matches) selected.value = true;
});

async function getRoute() {
  selected.value = !selected.value;
  if (!selected.value) {
    const idx = polylines.value.findIndex((el) => {
      return el.id == props.data.id;
    });
    if (idx !== -1) {
      bus.emit("deletePoly", polylines.value[idx].polyline);
      polylines.value.splice(idx, 1);
      if (ws) {
        ws.close()
        ws = null
      }
    }
    return;
  }
  try {
    loading.value = true;
    const data = await api("/routes/data/" + props.data.id);

    const apiPoint: IApiPoint[] = data.data;
    const points: [number, number][] = [];
    apiPoint.forEach((point) => {
      points.push([point.latitude, point.longitude]);
    });
    const newPolyline = L.polyline(points, { color: "red" });
    polylines.value.push({ id: props.data.id, polyline: newPolyline });
    bus.emit("addPoly", newPolyline);

    if (props.data.isActive && !ws) {
      ws = new WebSocket('ws' + baseURL + '/ws')
      ws.onmessage = e => {

        const data: IWebRoute[] = JSON.parse(e.data)
        if (data[0].routeId == props.data.id) {
          console.log('match');
          bus.emit('repaint', data[0])
        }
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.info__card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s;
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.name {
  font-weight: 600;
  font-size: 20px;
}

.selected {
  background: $primary;
  color: white;
}

.status {
  display: flex;
  gap: 10px;
  align-items: center;
  color: $positive;
}
</style>
