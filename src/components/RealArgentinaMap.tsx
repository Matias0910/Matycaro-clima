"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polygon = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polygon),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const getDaysList = () => {
  const daysList = [];
  const today = new Date();
  for (let i = 0; i < 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'long' });
    const dayNum = d.getDate();
    daysList.push({ id: i, label: `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNum}` });
  }
  return daysList;
};

const getAlertPolygons = (layer: string) => {
  switch (layer) {
    case "storm":
      return [
        {
          positions: [[-22, -65], [-22, -58], [-28, -58], [-28, -65]],
          color: "#22c55e",
          level: "Sin Alerta / Verde",
          desc: "Condiciones estables sin alertas meteorológicas vigentes."
        },
        {
          positions: [[-30, -65], [-30, -60], [-38, -60], [-38, -65]],
          color: "#eab308",
          level: "Alerta Amarilla",
          desc: "Tormentas de variada intensidad, algunas localmente fuertes."
        },
        {
          positions: [[-34, -60], [-34, -57], [-39, -57], [-39, -60]],
          color: "#f97316",
          level: "Alerta Naranja",
          desc: "Tormentas fuertes a severas. Ráfagas > 90 km/h y granizo."
        }
      ];
    case "rain":
      return [
        {
          positions: [[-28, -60], [-28, -55], [-35, -55], [-35, -60]],
          color: "#3b82f6",
          level: "Lluvias Intensas",
          desc: "Acumulados importantes de precipitación continuos."
        },
        {
          positions: [[-51, -61], [-51, -57], [-54, -57], [-54, -61]],
          color: "#3b82f6",
          level: "Lluvias en Islas Malvinas y Sector Insular",
          desc: "Precipitaciones y vientos persistentes en la región insular."
        }
      ];
    case "wind":
      return [
        {
          positions: [[-40, -70], [-40, -63], [-55, -63], [-55, -70]],
          color: "#06b6d4",
          level: "Vientos Fuertes (Patagonia e Islas Malvinas)",
          desc: "Ráfagas intensas en todo el sector sur y zona insular."
        }
      ];
    case "snow":
      return [
        {
          positions: [[-32, -70.5], [-32, -69], [-42, -69], [-42, -72]],
          color: "#6366f1",
          level: "Nevadas Cordilleranas",
          desc: "Acumulación de nieve y baja visibilidad en alta montaña."
        }
      ];
    default:
      return [];
  }
};

export function RealArgentinaMap() {
  const days = getDaysList();
  const [selectedDay, setSelectedDay] = useState(days[0].label);
  const [activeLayer, setActiveLayer] = useState("storm");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const container = document.getElementById("map-container");
    if (container && (container as any)._leaflet_id) {
      (container as any)._leaflet_id = null;
    }
  }, []);

  const polygons = getAlertPolygons(activeLayer);

  if (!isMounted) {
    return <div className="w-full h-80 bg-slate-950 rounded-2xl flex items-center justify-center text-xs text-slate-400">Cargando mapa...</div>;
  }

  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-4 shadow-2xl backdrop-blur-xl mt-4 space-y-3 text-white">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xs flex items-center gap-1.5">
          <span>🗺️</span> Mapa Estilo Google Maps
        </h2>
        <span className="text-[10px] bg-blue-500/25 text-blue-300 px-2.5 py-0.5 rounded-full font-bold border border-blue-500/40">
          Islas Malvinas 🇦🇷
        </span>
      </div>

      {/* Días */}
      <div className="flex bg-slate-950 p-1 rounded-2xl gap-1 border border-slate-800">
        {days.map((day) => (
          <button
            key={day.id}
            onClick={() => setSelectedDay(day.label)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              selectedDay === day.label
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Botones de capas */}
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { id: "storm", icon: "⛈️", label: "Tormentas" },
          { id: "rain", icon: "🌧️", label: "Lluvias" },
          { id: "wind", icon: "💨", label: "Vientos" },
          { id: "snow", icon: "❄️", label: "Nieve" },
        ].map((layer) => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`py-2 px-1 rounded-xl border text-[11px] flex flex-col items-center justify-center gap-1 transition font-medium ${
              activeLayer === layer.id
                ? "bg-amber-500/20 border-amber-500/80 text-amber-300 font-bold shadow-lg"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <span className="text-base">{layer.icon}</span>
            <span>{layer.label}</span>
          </button>
        ))}
      </div>

      {/* MAPA CON CAPA GOOGLE MAPS ROADMAP */}
      <div id="map-container" className="relative w-full h-80 rounded-2xl border border-slate-800 overflow-hidden z-0">
        <MapContainer
          center={[-40.4161, -63.6167]}
          zoom={4}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%", background: "#e2e8f0" }}
          attributionControl={false}
        >
          {/* Capa de Google Maps standard en español */}
          <TileLayer 
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=es"
            maxZoom={20}
          />

          {polygons.map((poly, index) => (
            <Polygon
              key={index}
              positions={poly.positions as any}
              pathOptions={{
                color: "#ffffff",
                weight: 1.5,
                fillColor: poly.color,
                fillOpacity: 0.70,
              }}
            >
              <Popup>
                <div className="text-slate-900 text-xs font-sans p-1">
                  <p className="font-bold text-sm mb-0.5" style={{ color: poly.color }}>{poly.level}</p>
                  <p className="text-slate-700">{poly.desc}</p>
                  <p className="text-[9px] text-slate-400 mt-2 border-t pt-1">📅 {selectedDay}</p>
                </div>
              </Popup>
            </Polygon>
          ))}
        </MapContainer>

        <div className="absolute bottom-2 left-2 z-[400] text-[10px] text-slate-800 bg-white/95 px-3 py-1.5 rounded-xl border border-slate-300 backdrop-blur font-medium shadow-lg">
          🇦🇷 <strong>ARGENTINA</strong> • <span className="uppercase text-blue-600">{activeLayer}</span> ({selectedDay})
        </div>
      </div>
    </div>
  );
}