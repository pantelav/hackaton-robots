<template>
  <div class="card__container">
    <div class="spinner" v-if="loading">
      <q-spinner-ball color="secondary" size="4em" />
    </div>
    <RobotCard v-for="robot in robots" :key="robot.id" :data="robot" />
  </div>
</template>

<script setup lang="ts">
import RobotCard from "./RobotCard.vue";
import { IRobot } from "./models";
import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";

const loading = ref(false)

const robots = ref<IRobot[]>();
onMounted(async () => {
  try {
    loading.value = true
    const data = await api("/robots");
    robots.value = data.data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false
  }
});

function getRoutes(id: string) {
  
}
</script>

<style scoped lang="scss">
.spinner {
  width: 100%;
  text-align: center;
}
</style>
