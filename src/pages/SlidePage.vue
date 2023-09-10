<template>
  <q-page class="row items-center justify-evenly slide">
    <img :src="activeSlide.url" alt="slide" class="img" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSlideStore } from "src/stores/uiStore";
import { storeToRefs } from "pinia";

const slideStore = useSlideStore();
const { activeSlide } = storeToRefs(slideStore);
</script>

<style scoped lang="scss">
.slide {
  background: rgb(4, 21, 13);
  background: linear-gradient(
    180deg,
    rgba(4, 21, 13, 1) 0%,
    rgba(1, 68, 57, 1) 53%,
    rgba(57, 0, 115, 1) 100%
  );
}

.img {
  width: 90%;
  object-fit: contain;
}
</style>
