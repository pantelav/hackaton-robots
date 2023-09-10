<template>
  <section class="drawer">
    <div class="drawer__head">
      <img :src="logo" alt="logo" />
    </div>

    <div class="drawer__section">
      <div class="section__title">Главная</div>
      <div class="sections__items">
        <NavItem
          v-for="(item, idx) in mainNavItems"
          :title="item.title"
          :icon="item.icon"
          :class="{
            active: idx == 0 && $route.path == '/',
            toggle: item.toggle,
          }"
          @click="toggleItem(item)"
        />
      </div>
    </div>

    <div class="drawer__section">
      <div class="section__title">Презентация</div>
      <div class="sections__items">
        <NavItem
          v-for="(item, idx) in funcNavItems"
          :title="item.title"
          :icon="item.icon"
          :class="{ active: activeSlide.id == item.id }"
          @click="changeSlide(item)"
        />
      </div>
    </div>
    <input type="file" class="file" name="file" id="" ref="inputFile" />
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import NavItem from "./NavItem.vue";
import { logo } from "src/assets";
import { INavItem } from "./models";
import { useUiStore, useSlideStore } from "src/stores/uiStore";
import { storeToRefs } from "pinia";
import {
  slideAi,
  bf,
  example1,
  example2,
  microservice,
  team,
  economy,
} from "src/assets";

const uiStore = useUiStore();
const slideStore = useSlideStore();
const router = useRouter();
const route = useRoute();
const inputFile = ref<HTMLInputElement | null>(null);

const { deffectsMenu, robotsMenu, routesMenu } = storeToRefs(uiStore);
const { activeSlide } = storeToRefs(slideStore);

const mainNavItems = ref<INavItem[]>([
  {
    title: "Карта",
    icon: "explore",
  },
  {
    title: "Дефекты",
    icon: "list",
    action: toggleDeffects,
    toggle: false,
  },
  {
    title: "Техника",
    icon: "videocam",
    action: toggleRobots,
    toggle: false,
  },
  {
    title: "Загрузить данные",
    icon: "upload",
    toggle: false,
    id: 10,
  },
]);

const funcNavItems: INavItem[] = [
  { title: "Система микросервисов", icon: "hub", id: 1, slide: microservice },
  { title: "AI/Computer vision", icon: "computer", slide: slideAi, id: 2 },
  { title: "Backend/Frontend", icon: "databse", id: 3, slide: bf },
  { title: "Экономический анализ", icon: "trending_up", id: 4, slide: economy },
  {
    title: "Пример работы модели",
    icon: "psychology",
    id: 5,
    slide: [example1, example2],
  },
  { title: "Наша команда", icon: "groups", id: 6, slide: team },
];

function toggleItem(item: INavItem) {
  if (item.action && route.path == "/") {
    item.toggle = !item.toggle;
    item.action();
  }
  if (item.title == "Карта") {
    router.push("/");
    activeSlide.value.id = 0;
  }
  if (item.id == 10 && inputFile.value) {
    inputFile.value.click();
  }
}

function toggleDeffects(): void {
  mainNavItems.value[2].toggle = false;
  robotsMenu.value = false;
  // routesMenu.value = false
  deffectsMenu.value = !deffectsMenu.value;
}

function toggleRobots(): void {
  mainNavItems.value[1].toggle = false;
  deffectsMenu.value = false;
  robotsMenu.value = !robotsMenu.value;
}

function changeSlide(item: INavItem) {
  if (activeSlide.value.id == item.id) {
    return (activeSlide.value.id = 0);
  }
  activeSlide.value.id = item.id || 0;
  activeSlide.value.url = item.slide || "";
}
</script>

<style scoped lang="scss">
.drawer {
  padding: 10px 20px;
}
.drawer__head {
  text-align: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid $accent;
}
.drawer__section {
  margin-bottom: 15px;
  &:not(:last-child) {
    border-bottom: 1px solid $accent;
  }
}
.section__title {
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: 500;
  color: $accent;
}
.sections__items {
  font-size: 1.1rem;
}

.active {
  background: $primary;
  color: white;
}

.toggle,
.toggle:hover {
  color: $info !important;
}

.file {
  display: none;
}
</style>
