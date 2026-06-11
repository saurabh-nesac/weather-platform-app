// frontend-react/src/components/atmos/MapView.tsx
import { loadManifest } from "@/services/raster";
import maplibregl from "maplibre-gl";
import { BASINS, basinFeatureCollection, type BasinId } from "./basins";
import { loadTemperatureFrame } from "@/services/raster";
import { useEffect, useRef, useState } from "react";
import { useDatasetStore } from "../../core/state/datasetStore";
import { loadDatasetManifest } from "../../services/raster";
import { loadFrame } from "../../core/datasets/frameLoader";
import { useFrame, useSelectedDatasetId, useVariable } from "../../core/state/selectors";
import {
  getFrame,
} from "../../core/datasets/frameManager";


interface Props {
  opacity: number;
  showTemp: boolean;
  selectedBasin: BasinId | null;
  onSelectBasin: (id: BasinId) => void;
  visibleOverlays: Record<string, boolean>;
}



export function MapView({ selectedBasin, onSelectBasin, visibleOverlays }: Props) {
  const [manifestLoaded, setManifestLoaded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const onSelectRef = useRef(onSelectBasin);
  onSelectRef.current = onSelectBasin;
  const manifestRef = useRef<any>(null);
  const frame = useFrame();

  const datasetId = useSelectedDatasetId();

  const variable = useVariable();

  async function drawTemperatureFrame(
    frame: number,
    datasetId: string,
    variable: string
  ) {
    const canvas = overlayRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const manifest = manifestRef.current;
    if (!manifest) return;

    const width = manifest.width;
    const height = manifest.height;

    // const data = await loadTemperatureFrame(frame);
    // const loadedFrame =
    //   await loadFrame({
    //     datasetId,
    //     variable,
    //     frame
    //   });
    
    const raster =
      await getFrame({
        datasetId,
        variable,
        frame,
      });
    const data = raster.data

    console.log(
      data[0],
      data[1000]
    );

    let min = Infinity;
    let max = -Infinity;

    for (const v of data) {
      if (v < min) min = v;
      if (v > max) max = v;
    }

    const image = new ImageData(width, height);

    for (let i = 0; i < data.length; i++) {
      const value = data[i];

      const n =
        (value - min) /
        (max - min);

      const c = Math.floor(n * 255);

      image.data[i * 4 + 0] = c;
      image.data[i * 4 + 1] = c;
      image.data[i * 4 + 2] = c;
      image.data[i * 4 + 3] = 180;
    }

    const tmp = document.createElement("canvas");

    tmp.width = width;
    tmp.height = height;

    const tctx = tmp.getContext("2d");
    if (!tctx) return;

    tctx.putImageData(image, 0, 0);

    console.log('clientHeight: ', canvas.clientHeight)
    canvas.width = canvas.clientWidth;
    console.log('clientWidth: ', canvas.clientWidth)
    canvas.height = canvas.clientHeight;


    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    console.log('bbox', manifestRef.current.bbox);
    const bbox = manifestRef.current.bbox;

    const map = mapRef.current;
    console.log(map)
    const nw = map.project([
      bbox[0],
      bbox[3]
    ]);

    const se = map.project([
      bbox[2],
      bbox[1]
    ]);
    ctx.drawImage(
      tmp,
      nw.x,
      nw.y,
      se.x - nw.x,
      se.y - nw.y
    );


    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;

    ctx.strokeRect(
      nw.x,
      nw.y,
      se.x - nw.x,
      se.y - nw.y
    );

    console.log(nw);
    console.log(se);

    console.log("Rendered frame", frame);
  }

  useEffect(() => {
    async function init() {
      const manifest = await loadDatasetManifest();

      manifestRef.current = manifest;
      setManifestLoaded(true);
      console.log("Manifest loaded", manifest);
    }

    init();
  }, []);

  useEffect(() => {
    if (!mapLoaded)
      return;

    if (!manifestLoaded)
      return;

    drawTemperatureFrame(frame,
      datasetId,variable
      );

  }, [
    mapLoaded,
    manifestLoaded,
    frame,
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
            tiles: ["https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap, © CARTO",
          },
          labels: {
            type: "raster",
            tiles: ["https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png"],
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



  // return (
  //   <div className="relative h-full w-full overflow-hidden rounded-lg">
  return (
    <div
      className="relative h-full w-full"
    >
      <div ref={ref} className="absolute inset-0 z-10 border-blue" />
      <canvas
        ref={overlayRef}
        className="pointer-events-none absolute inset-0  z-10 border-green w-full h-full "
      />
      <div className="absolute left-3 top-3 z-10 flex gap-2">
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
      <div className="absolute bottom-3 right-3 z-10 rounded bg-black/40 px-2 py-1 text-[10px] text-muted">
        200 km
      </div>
    </div>
  );
}



function ColorBar() {
  return (
    <div className="absolute bottom-3 left-3 z-10 w-64 rounded bg-black/40 p-2 backdrop-blur-sm">
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
