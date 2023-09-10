import { defineStore } from 'pinia';
import { IStreet } from 'src/components/models';
import { ref, computed } from 'vue';
import L from 'leaflet'

const enum Colors {
  red = "#B15151",
  green = "#21BA45",
  blue = "#1B22DC",
}
function getColor (type: IStreet['type']) {
  if (type == 'done') return Colors.green
  if (type == 'unresolved') return Colors.red
  if (type == 'working') return Colors.blue
  return Colors.blue
}

export const useStreetStore = defineStore('street', () => {
  const tempData: IStreet[] = [
    {
      id: 1,
      street: "ул. Пушкина, д.5",
      date: "1 сентября 2023 г.",
      type: "done",
      problem: "я",
      coords: [56.322, 43.992],
      marker: null
    },
    {
      id: 2,
      street: "ул. Пушкина, д.5",
      date: "1 сентября 2023 г.",
      type: "working",
      problem: "я",
      coords: [56.322, 43.993],
      marker: null
    },
    {
      id: 3,
      street: "ул. Пушкина, д.5",
      date: "1 сентября 2023 г.",
      type: "unresolved",
      problem: "я",
      coords: [56.323, 43.993],
      marker: null
    },
    {
      id: 4,
      street: "ул. Пушкина, д.5",
      date: "1 сентября 2023 г.",
      type: "done",
      problem: "я",
      coords: [56.323, 43.98],
      marker: null
    },
    {
      id: 5,
      street: "ул. Пушкина, д.5",
      date: "1 сентября 2023 г.",
      type: "working",
      problem: "я",
      coords: [56.323, 43.85],
      marker: null
    },
    {
      id: 6,
      street: "ул. Пушкина, д.5",
      date: "1 сентября 2023 г.",
      type: "unresolved",
      problem: "я",
      coords: [56.321, 43.85],
      marker: null
    },
  ]
  tempData.forEach((el, i) => {
    tempData[i].marker = L.circleMarker(tempData[i].coords, { color: getColor(tempData[i].type), radius: 15 })
  })
  const done = ref(true);
  const working = ref(true);
  const unresolved = ref(true);
  const streets = ref<IStreet[]>(tempData)

  const filteredStreets = computed(() => {
    return streets.value.filter(el => {
      if (el.type == 'done' && done.value) return true
      if (el.type == 'unresolved' && unresolved.value) return true
      if (el.type == 'working' && working.value) return true
    })
  })

  const streetCount = computed(() => {
    return {
      done: streets.value.filter(el => el.type == 'done').length,
      unresolved: streets.value.filter(el => el.type == 'unresolved').length,
      working: streets.value.filter(el => el.type == 'working').length
    }
  })

  return { done, working, unresolved, streets, filteredStreets, streetCount }
});
