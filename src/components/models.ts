import L from 'leaflet'

export interface INavItem {
  id?: number,
  title: string,
  icon?: string,
  action?: () => void,
  toggle?: boolean,
  slide?: string
}

export interface IStreetCard {
  id: number,
  street: string,
  date: string,
  img?: string
  type?: 'done' | 'working' | 'unresolved',
  problem?: 'я' | 'т' | 'в' | 'з',
  marker?: L.CircleMarker | null
}

export interface IStreet extends IStreetCard {
  coords: L.LatLngTuple,
}

export interface IRobot {
  id: string,
  name: string,
  desc: string,
  isActive: boolean
}

export interface IRoute {
  id: string,
  desc: string,
  length: string | null,
  name: string,
  robotId: string,
  timeDuration: string | null
  isActive: boolean
}

export interface IApiPoint {
  id: number,
  latitude: number,
  longitude: number,
  roborId: string,
  routeId: string,
  timestamp: number,
}

export interface IPolyline {
  id: string,
  polyline: L.Polyline
}

export interface IApiDefect {
  id: string,
  latitude: number,
  longitude: number,
  timestamp: number,
  imageUrl: string,
  type: 'u' | 'd' | 'w',
  routeId: string,
  robotId: string
}

export interface IMarker {
  id: string,
  marker: L.CircleMarker
}

export interface IWebRoute {
  robotId: number,
  latitude: number,
  longitude: number,
  timestamp: number,
  routeId: string,
}
