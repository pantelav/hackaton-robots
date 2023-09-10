<template>
  <div class="card">
    <img :src="getImgUrl" alt="slide" class="img" @click="changeSlide">
  </div>
</template>

<script setup lang='ts'>
import {computed, ref} from 'vue'
import { storeToRefs } from 'pinia';
import { useSlideStore } from 'src/stores/uiStore';
const slideStore = useSlideStore()

const {activeSlide} = storeToRefs(slideStore)
const currentSlide = ref(0)
const isArray = computed(() => {
  return Array.isArray(activeSlide.value.url)
})

const getImgUrl = computed(() => {
  if (isArray.value) {
    return currentSlide.value == 0 ? activeSlide.value.url[0] : activeSlide.value.url[1]
  } else return activeSlide.value.url as string
})

function changeSlide() {
  if (!isArray.value) return
  currentSlide.value == 0 ? currentSlide.value = 1 : currentSlide.value = 0
}
</script>

<style scoped lang='scss'>
.card {
  max-height: 100vh;
}
</style>
