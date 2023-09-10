<template>
  <div class="card__container">
    <RouteCard v-for="route in routes" :key="route.id" :data="route" v-if="routes?.length && routes.length > 0"/>
    <div class="card" v-else>Маршрутов пока нет</div>
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import RouteCard from './RouteCard.vue';
import { useUiStore } from 'src/stores/uiStore';

const uiStore = useUiStore()
const {routes} = storeToRefs(uiStore)
</script>

<style scoped lang='scss'>
.card {
  padding: 10px;
  background: #fff;
}
</style>
