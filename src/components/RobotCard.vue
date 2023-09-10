<template>
  <div class="info__card" @click="getRoutes">
    <img :src="robot" alt="robot" class="robot">
    <div class="flex">
      <div class="info">
        <p>{{ props.data.name }}</p>
        <q-spinner-ball color="secondary" v-if="loading"/>
        <p class="desc">{{ props.data.desc }}</p>
      </div>
      <div
        class="status"
        :class="{ positive: props.data.isActive, negative: !props.data.isActive }"
      >
        <q-icon name="radio_button_checked" />
        <p>{{ props.data.isActive ? "Онлайн" : "Офлайн" }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from "src/boot/axios";
import { IRobot, IRoute } from "./models";
import {useUiStore} from 'src/stores/uiStore'
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { robot } from 'src/assets';

const props = defineProps<{
  data: IRobot;
}>();

const uiStore = useUiStore()
const {routes, robotsMenu, routesMenu} = storeToRefs(uiStore)
const loading = ref(false)

async function getRoutes() {
  try {
    loading.value = true
    const data = await api("/routes/" + props.data.id);
    const routesData: IRoute[] = data.data
    routes.value = routesData
    routesMenu.value = true
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false
  }

}
</script>

<style scoped lang="scss">

.info__card {
  height: 100px;
  display: flex;
  gap: 5px;
}
.info {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  align-items: start;
  font-size: 24px;
  .desc {
    color: $accent;
    font-size: 20px;
  }
}

.flex {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.status {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.positive {
  color: $positive;
}

.negative {
  color: $negative;
}

.robot {
  max-width: 100px;
  height: 100%;
  object-fit: cover;
}
</style>
