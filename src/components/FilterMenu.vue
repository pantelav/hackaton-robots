<template>
  <q-fab color="info" round icon="filter_alt" direction="left">
    <div class="filter__container">
      <div
        class="filter__item"
        :class="{ positive: filter.d }"
        @click="filter.d = !filter.d"
      >
        Завершенные: <b>{{ getCount.d }}</b>
      </div>
      <div
        class="filter__item"
        :class="{ info: filter.w }"
        @click="filter.w = !filter.w"
      >
        В работе: <b>{{ getCount.w }}</b>
      </div>
      <div
        class="filter__item"
        :class="{ negative: filter.u }"
        @click="filter.u = !filter.u"
      >
        Не решенные: <b>{{ getCount.u }}</b>
      </div>
    </div>
  </q-fab>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUiStore } from "src/stores/uiStore";
import { useMapStore } from "src/stores/mapStore";
import { storeToRefs } from "pinia";

const uiStore = useUiStore();
const mapStore = useMapStore();

const { defects } = storeToRefs(mapStore);
const { filter } = storeToRefs(uiStore);

const getCount = computed(() => {
  const w = defects.value.filter(el => el.type == 'w').length
  const d = defects.value.filter(el => el.type == 'd').length
  const u = defects.value.filter(el => el.type == 'u').length

  return {
    w,
    d,
    u
  }
})
</script>

<style scoped lang="scss">
.menu {
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.filter__container {
  display: flex;
  gap: 20px;
}

.filter__item {
  width: 150px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 8px;
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
  border-bottom: 5px solid rgb(178, 178, 178);
  cursor: pointer;
  transition: all 0.2s;
}

.positive {
  border-color: $positive;
}
.info {
  border-color: $info;
}
.negative {
  border-color: $negative;
}
b {
  padding-left: 10px;
}
</style>
