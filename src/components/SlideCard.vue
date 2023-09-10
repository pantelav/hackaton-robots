<template>
  <div class="card">
    <img :src="activeSlide.url || ''" alt="slide">
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useSlideStore } from 'src/stores/uiStore';
const slideStore = useSlideStore()

const {activeSlide} = storeToRefs(slideStore)
</script>

<style scoped lang='scss'>

</style>
