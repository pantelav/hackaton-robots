<template>
  <div class="card__container">
    <StreetCard
      v-for="defect in filterdDefects"
      :key="defect.id"
      :data="defect"
      @show-info="showInfo"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import StreetCard from "./StreetCard.vue";
import { useMapStore } from "src/stores/mapStore";
import { useUiStore } from "src/stores/uiStore";
import { storeToRefs } from "pinia";
import { IApiDefect } from "./models";

const mapStore = useMapStore();
const uiStore = useUiStore();
const { defects, activeDefect } = storeToRefs(mapStore);
const { detailsMenu, filter } = storeToRefs(uiStore);

const filterdDefects = computed(() => {
  return defects.value.filter(obj => filter.value[obj.type])
})

function showInfo(data: IApiDefect) {
  activeDefect.value = data;
  detailsMenu.value = true;
}
</script>

<style scoped lang="scss"></style>
