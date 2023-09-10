<template>
  <q-page class="row items-center justify-evenly">
    <TheMap/>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TheMap from 'src/components/TheMap.vue';


onMounted( async () => {

  // const ws = new WebSocket('ws://25.5.221.55:8000/ws')
  // ws.onmessage = (e) => {
  //   console.log(e);
  // }
})
</script>
