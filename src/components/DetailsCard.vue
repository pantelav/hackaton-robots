<template>
  <div class="details">
    <div class="details__wrapper">
      <div class="title">
        <h2>ID: {{ activeDefect?.id }}</h2>
        <q-btn icon="close" round dense @click="close" />
      </div>
      <div class="data__conatiner">
        <div class="left">
          <div class="left__info">
            <div><b>Адрес:</b> ул. Лермонтова, д.52</div>
            <div><b>Тип объекта:</b> Дорожная яма</div>
            <div>
              <b>Время добавления:</b>
              {{
                activeDefect?.timestamp
                  ? formatDate(activeDefect?.timestamp)
                  : "Не определено"
              }}
            </div>
            <div><b>Текущее состояние:</b> {{ getState() }}</div>
            <div><b>Маршрут:</b> Маршрут №2</div>
            <div>
              <b>Координаты:</b> {{ activeDefect?.latitude }},
              {{ activeDefect?.longitude }}
            </div>
            <div><b>ID Робота:</b> {{ activeDefect?.robotId }}</div>
          </div>
          <div class="left__details">
            <div><b>Длина:</b> 1 м</div>
            <div><b>Ширина:</b> 0.5 м</div>
            <div><b>Глубина:</b> 0.2 м</div>
          </div>
        </div>
        <div class="right">
          <img
            class="img"
            :src="activeDefect?.imageUrl || street"
            alt="street"
          />
          <div class="chat">
            <span class="marked"
              >[{{ formatDate(activeDefect?.timestamp as number) }}]</span
            >
            обнаружена яма в районе Маршрут №2, объекту присвоен id
            {{ activeDefect?.id }}, статус "Не решено".<br />
            <span class="marked"
              >[{{ formatDate(activeDefect?.timestamp as number) }}]</span
            >
            объект добавлен в план для решения на 2023 год.
          </div>
          <q-input
            dense
            v-model="input"
            outlined
            type="text"
            class="chat-input"
            placeholder="Введите текст.."
          />
        </div>
      </div>
      <div class="actions">
        <div class="time">{{ getTimeDiff() }}</div>
        <div class="buttons">
          <q-btn
            class="btn-action"
            dense
            :color="activeDefect?.type == 'u' ? 'negative' : ''"
            :text-color="activeDefect?.type != 'u' ? 'black' : 'white'"
            rounded
            label="Не решено"
            no-caps
            @click="changeType('u')"
          />
          <q-btn
            class="btn-action"
            dense
            :color="activeDefect?.type == 'w' ? 'info' : ''"
            :text-color="activeDefect?.type != 'w' ? 'black' : 'white'"
            rounded
            label="В работе"
            no-caps
            @click="changeType('w')"
          />
          <q-btn
            class="btn-action"
            dense
            :color="activeDefect?.type == 'd' ? 'positive' : ''"
            :text-color="activeDefect?.type != 'd' ? 'black' : 'white'"
            rounded
            label="Завершено"
            no-caps
            @click="changeType('d')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed } from "vue";
import { storeToRefs } from "pinia";
import { useMapStore } from "src/stores/mapStore";
import { useUiStore } from "src/stores/uiStore";
import { formatDate } from "src/helpers/formatDate";
import { street } from "src/assets";
import { api } from "src/boot/axios";
import dayjs from 'dayjs'
import relativeTime  from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ru'
import { EventBus } from 'quasar';

const bus = inject<EventBus>('bus') as EventBus
const input = ref("");
const mapStore = useMapStore();
const uiStore = useUiStore();
const { activeDefect, defects } = storeToRefs(mapStore);
const { detailsMenu } = storeToRefs(uiStore);

function getState() {
  if (activeDefect.value?.type == "d") return "Завершено";
  if (activeDefect.value?.type == "u") return "Не решено";
  if (activeDefect.value?.type == "w") return "В работе";
}

function close() {
  detailsMenu.value = false;
}

function getTimeDiff() {
  dayjs.locale('ru')
  dayjs.extend(relativeTime)
  const now = Date.now()
  const date1 = dayjs(activeDefect.value?.timestamp as number * 1000)
  const date2 = dayjs(now)

  return date1.from(date2)
}

const borderColor = computed(() => {
  if (activeDefect.value?.type == "d") return '#21BA45';
  if (activeDefect.value?.type == "u") return '#B15151';
  if (activeDefect.value?.type == "w") return '#1B22DC';
})

async function changeType(type: "u" | "d" | "w") {
  if (activeDefect.value?.type == type) return;
  // @ts-ignore
  activeDefect.value.type = type;
  const defectIdx = defects.value.findIndex(
    (el) => el.id == activeDefect.value?.id
  );
  if (defectIdx == -1) return;
  defects.value[defectIdx].type = type;
  try {
    bus.emit('change-type', {id: activeDefect.value?.id, type})
    await api.post("/defects/change_status", {
      id: activeDefect.value?.id,
      type: type,
    });
  } catch (error) {
    console.log(error);
  }
}
</script>

<style scoped lang="scss">
.details {
  width: 650px;
  height: 490px;
  background: #fff;
  border-radius: 8px;
  border-left: 8px solid v-bind(borderColor);
}
.details__wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
}
.data__conatiner {
  width: 100%;
  display: flex;
  gap: 10px;
  flex-grow: 1;
}
.left {
  width: 50%;
  display: flex;
  flex-direction: column;
  .left__info,
  .left__details {
    margin-bottom: 10px;
    padding: 8px;
    border: 2px solid $accent;
    border-radius: 8px;
  }

  .left__details {
    flex-grow: 1;
  }
}
.right {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.img {
  width: 100%;
  max-height: 167px;
  object-fit: cover;
  border-radius: 8px;
}

.chat {
  padding: 10px;
  border: 2px solid $accent;
  border-radius: 8px;
  flex-grow: 1;
  font-size: 12px;
  overflow-y: scroll;
  .marked {
    color: #ff9900;
    font-weight: 600;
  }
}
.chat-input {
  margin-bottom: 10px;
}
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.time {
  font-weight: 600;
  font-size: 18px;
  color: $info;
}
.buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  .btn-action {
    padding: 0 10px;
  }
}
</style>
