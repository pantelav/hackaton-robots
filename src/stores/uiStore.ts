import { defineStore } from 'pinia';
import { IRoute } from 'src/components/models';
import { ref, computed } from 'vue';


export const useUiStore = defineStore('ui', () => {
  const deffectsMenu = ref(false)
  const robotsMenu = ref(false)
  const routesMenu = ref(false)
  const routes = ref<IRoute[]>()
  const selectedRobot = ref<string | null>(null)
  const detailsMenu = ref(false)
  const filter = ref({
    d: true,
    w: true,
    u: true
  })

  return { deffectsMenu, robotsMenu, routesMenu, routes, selectedRobot, detailsMenu, filter }
})

export const useSlideStore = defineStore('slide', () => {
  const activeSlide = ref({
    id: 0,
    url: ''
  })
  return { activeSlide }
})
