import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (map.current) return // initialize map only once

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      setError("Mapbox token is missing")
      return
    }

    try {
      mapboxgl.accessToken = token

      if (mapContainer.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/light-v10",
          center: [-74.5, 40], // starting position
          zoom: 9,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize map")
    }
  }, [])

  if (error) {
    return <div className="h-full w-full rounded-md bg-red-50 p-4 text-red-600">{error}</div>
  }

  return <div ref={mapContainer} className="h-full w-full rounded-md" />
}
