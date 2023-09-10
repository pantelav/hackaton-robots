<template>
  <div class="card" @click="zoomMap">
    <img class="img" :src="imgUrl" alt="street" />
    <div class="grid">
      <div class="id">ID: {{ props.data.id }}</div>
      <div class="info">
        <p>{{ formatDate(props.data.timestamp) }}</p>
      </div>
      <div class="status__container">
        <div class="status">{{ statusText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import { colors } from "../constants/colors";
import { street } from "src/assets";
import { IApiDefect } from './models';
import { EventBus } from 'quasar';
import {formatDate} from 'src/helpers/formatDate'

const emit = defineEmits(['show-info'])
const props = defineProps<{
  data: IApiDefect
}>()
const bus = inject<EventBus>('bus') as EventBus
bus.on('change-type', chageStatus)
const mainColor = ref(colors.negative);
const statusText = ref("Не решено");
const imgUrl = ref(props.data.imageUrl || street);

onMounted(() => {
  chageStatus()
});


function chageStatus() {
  switch (props.data.type) {
    case "d":
      mainColor.value = colors.positive;
      statusText.value = "Завершено";
      break;
    case "w":
      mainColor.value = colors.info;
      statusText.value = "В работе";
      break;
    case "u":
      mainColor.value = colors.negative;
      statusText.value = "Не решено";
      break;
  }
}

function zoomMap() {
  emit('show-info', props.data)
  bus.emit('zoom', props.data.id)
}
</script>

<style scoped lang="scss">
.card {
  padding: 10px;
  width: 350px;
  height: 120px;
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  border-radius: 8px;
  border-bottom: 5px solid v-bind(mainColor);
  cursor: pointer;
}
.img {
  width: 85px;
  height: 85px;
  object-fit: cover;
}
.grid {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.id {
  font-weight: 600;
}
.info {
  text-align: right;
}
.circle__container {
}
.circle {
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid v-bind(mainColor);
  border-radius: 50%;
  font-weight: 700;
}
.status__container {
  text-align: right;
  margin-top: 5px;
}
.status {
  position: relative;
  display: inline-block;
  padding: 2px 10px;
  border: 1px solid v-bind(mainColor);
  border-radius: 8px;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: v-bind(mainColor);
    opacity: 0.1;
  }
}
</style>
