import { IApiDefect } from './../components/models';
import { defineStore } from 'pinia';
import { IApiPoint, IPolyline, IMarker } from 'src/components/models';
import { ref } from 'vue';
import L from 'leaflet'

export const useMapStore = defineStore('map', () => {
  const points = ref<IApiPoint[]>()
  const polylines = ref<IPolyline[]>([])
  const defects = ref<IApiDefect[]>([])
  const circleMarkers = ref<IMarker[]>([])
  const activeDefect= ref<IApiDefect>()

  return {points, polylines, defects, circleMarkers, activeDefect}
})


