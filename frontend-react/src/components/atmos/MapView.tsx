// frontend-react/src/components/atmos/MapView.tsx

import maplibregl from "maplibre-gl";
import { BASINS, basinFeatureCollection, type BasinId } from "./basins";

import { useEffect, useRef, useState } from "react";

import { loadDatasetManifest } from "@/core/datasets/datasetLoader";

import { useBasemap, useFrame, useSelectedDatasetId, useSelectedPoint, useVariable } from "../../core/state/selectors";
import {
  getFrame
} from "../../core/datasets/frameManager";
import { RasterRenderer } from "../../rendering/raster/RasterRenderer";
import {
  useSetSelectedPoint,
} from "../../core/state/selectors";


interface Props {
  opacity: number;
  showTemp: boolean;
  selectedBasin: BasinId | null;
  onSelectBasin: (id: BasinId) => void;
  visibleOverlays: Record<string, boolean>;
}



export function MapView({ selectedBasin, onSelectBasin, visibleOverlays }: Props) {
  const setSelectedPoint =
    useSetSelectedPoint();
  const markerRef =
    useRef<
      maplibregl.Marker | null
    >(null);
  const basemap =    useBasemap();
  const [manifestLoaded, setManifestLoaded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const onSelectRef = useRef(onSelectBasin);
  onSelectRef.current = onSelectBasin;
  const manifestRef = useRef<any>(null);
  const rendererRef = useRef<RasterRenderer | null>(null);

  const [rendererReady,
    setRendererReady] =
    useState(false);
  const datasetId = useSelectedDatasetId();


  const frame = useFrame();

  const variable = useVariable();


  useEffect(() => {
    async function init() {
      
      const manifest = await loadDatasetManifest(variable);

      manifestRef.current = manifest;
      setManifestLoaded(true);
      console.log("Manifest loaded", manifest);
    }

    init();
  }, [variable]);

  useEffect(() => {

    if (!datasetId)
      return;

    if (!rendererRef.current)
      return;
    const currentDatasetId = datasetId;

    async function update() {

      const rasterFrame = await getFrame({
        datasetId: currentDatasetId,
        variable,
        frame,
      });

      rendererRef.current!
        .renderFrame(rasterFrame);
    }

    update();

  }, [
    datasetId,
    variable,
    frame,
    rendererReady,
  ]);
  useEffect(() => {

    if (
      !mapLoaded ||
      !manifestLoaded
    ) {
      return;
    }

    if (
      !mapRef.current ||
      !overlayRef.current ||
      !manifestRef.current
    ) {
      return;
    }

    rendererRef.current =
      new RasterRenderer(
        mapRef.current,
        overlayRef.current,
        manifestRef.current
      );

    const renderer =
      rendererRef.current;

    const bbox =
      manifestRef.current.bbox;

    mapRef.current.fitBounds(
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      {
        padding: 20,
        duration: 0,
      }
    );

    const padLon =
      (bbox[2] - bbox[0]) * 0;

    const padLat =
      (bbox[3] - bbox[1]) * 0;

    mapRef.current.setMaxBounds([
      [
        bbox[0] - padLon,
        bbox[1] - padLat,
      ],
      [
        bbox[2] + padLon,
        bbox[3] + padLat,
      ],
    ]);

    mapRef.current.on("move", () => {
      renderer.draw();
    });

    mapRef.current.on("zoom", () => {
      renderer.draw();
    });

    mapRef.current.on("resize", () => {
      renderer.draw();
    });

    mapRef.current.on("moveend", () => {
      renderer.draw();
    });

    setRendererReady(true);

  }, [
    mapLoaded,
    manifestLoaded,
  ]);

  // Mount map once
  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap, © CARTO",
          },
          labels: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
          },
        },
        layers: [
          { id: "osm", type: "raster", source: "osm" },
          { id: "labels", type: "raster", source: "labels" },
        ],
      },
      center: [93.5, 26.8],
      zoom: 5.6,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-left");

    mapRef.current = map;

    map.on("load", () => {

      console.log(
        "map div",
        ref.current?.clientWidth,
        ref.current?.clientHeight
      );
      map.on(
        "click",
        (e) => {

          const point = {
            lat: e.lngLat.lat,
            lon: e.lngLat.lng,
          };

          setSelectedPoint(point);

          if (!markerRef.current) {

            markerRef.current =
              new maplibregl.Marker({
                color: "#ff4444",
              });

          }

          markerRef.current
            .setLngLat([
              point.lon,
              point.lat,
            ])
            .addTo(map);

          console.log(
            "Selected point",
            point
          );
        }
      );

      

      map.addSource("basins", { type: "geojson", data: basinFeatureCollection as never });

      map.addLayer({
        id: "basins-fill",
        type: "fill",
        source: "basins",
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "id"], ["literal", selectedBasin ?? ""]],
            "#a78bfa",
            "#60a5fa",
          ],
          "fill-opacity": [
            "case",
            ["==", ["get", "id"], ["literal", selectedBasin ?? ""]],
            0.45,
            0.18,
          ],
        },
      });

      map.addLayer({
        id: "basins-outline",
        type: "line",
        source: "basins",
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "id"], ["literal", selectedBasin ?? ""]],
            "#c4b5fd",
            "#93c5fd",
          ],
          "line-width": [
            "case",
            ["==", ["get", "id"], ["literal", selectedBasin ?? ""]],
            2.5,
            1.2,
          ],
        },
      });

      map.addLayer({
        id: "basins-labels",
        type: "symbol",
        source: "basins",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 11,
          "text-offset": [0, 0.6],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#e2e8f0",
          "text-halo-color": "#0b0f1a",
          "text-halo-width": 1.2,
        },
      });

      map.on("click", "basins-fill", (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const id = (f.properties as { id: BasinId }).id;
        onSelectRef.current(id);
      });

      map.on("mouseenter", "basins-fill", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "basins-fill", () => (map.getCanvas().style.cursor = ""));

      setMapLoaded(true);

    });
  }, []);




  // Update selection styling + fly to basin
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    if (!map.getLayer("basins-fill")) return;
    map.setPaintProperty("basins-fill", "fill-color", [
      "case",
      ["==", ["get", "id"], ["literal", selectedBasin ?? ""]],
      "#a78bfa",
      "#60a5fa",
    ]);
    map.setPaintProperty("basins-fill", "fill-opacity", [
      "case",
      ["==", ["get", "id"], ["literal", selectedBasin ?? ""]],
      0.45,
      0.18,
    ]);
    map.setPaintProperty("basins-outline", "line-color", [
      "case",
      ["==", ["get", "id"], ["literal", selectedBasin ?? ""]],
      "#c4b5fd",
      "#93c5fd",
    ]);
    map.setPaintProperty("basins-outline", "line-width", [
      "case",
      ["==", ["get", "id"], ["literal", selectedBasin ?? ""]],
      2.5,
      1.2,
    ]);

    if (selectedBasin) {
      const b = BASINS.find((x) => x.id === selectedBasin);
      if (b) map.flyTo({ center: b.center, zoom: 7.4, duration: 800 });
    }
  }, [selectedBasin]);

  const point =
    useSelectedPoint();

  useEffect(() => {

    console.log(
      "Selected point changed",
      point
    );

  }, [point]);

  // return (
  //   <div className="relative h-full w-full overflow-hidden rounded-lg">
  return (
    <div
      className="relative h-full w-full"
    >
      <div ref={ref} className="absolute inset-0 z-10 border-blue h-full" />
      <canvas
        ref={overlayRef}
        className="pointer-events-none absolute inset-0  z-20 w-full h-full "
      />
      <div className="absolute left-3 top-3 z-20 flex gap-2">
        <span className="chip bg-accent/20 border-accent/40 text-accent-foreground">
          FOCUS: NE INDIA — BASINS
        </span>
        {selectedBasin && (
          <span className="chip bg-[color:var(--accent-2)]/20 border-[color:var(--accent-2)]/40 z-20">
            {BASINS.find((b) => b.id === selectedBasin)?.name}
          </span>
        )}
      </div>
      <ColorBar />
      <div className="absolute bottom-3 right-3 z-10 rounded bg-black/90 px-2 py-1 text-[10px] text-muted">
        200 km
      </div>
    </div>
  );
}



function ColorBar() {
  return (
    <div className="absolute bottom-3 left-3 z-30 w-64 rounded bg-black p-2 ">
      <div className="mb-1 text-[10px] text-muted">°C</div>
      <div
        className="h-3 w-full rounded"
        style={{
          background:
            "linear-gradient(90deg,#0c063c,#281e82,#1e5aa0,#28a096,#b4c85a,#f0b43c,#e65a28,#aa1e1e)",
        }}
      />
      <div className="mt-1 flex justify-between text-[10px] text-muted">
        <span>-20</span><span>-10</span><span>0</span><span>10</span><span>20</span><span>30</span><span>40</span>
      </div>
    </div>
  );
}
