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

// Función modificada para cruzar con los datos reales de Open-Meteo
const getAlertPolygons = (layer: string, selectedDay: string, daily?: any) => {
  if (!daily || !daily.time) return [];

  // Buscamos el índice del día seleccionado en el array diario de la API
  // Como el label es ej: "Martes 11", extraemos el número o matcheamos de forma robusta
  const dayIndex = daily.time.findIndex((dateStr: string) => {
    const apiDate = new Date(dateStr + "T00:00:00");
    const apiDayNum = apiDate.getDate();
    return selectedDay.includes(apiDayNum.toString());
  });

  const targetIndex = dayIndex !== -1 ? dayIndex : 0;

  const maxRainProb = daily.precipitation_probability_max?.[targetIndex] ?? 0;
  const weatherCode = daily.weather_code?.[targetIndex] ?? 0;

  // Verificaciones reales de cada fenómeno
  const hasRain = maxRainProb >= 30 || (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
  const hasStorm = weatherCode >= 95;
  const hasSnow = weatherCode >= 71 && weatherCode <= 77;
  const hasWind = false; // Open-Meteo básico diario no siempre manda ráfagas máximas, se puede ajustar si usas hourly

  switch (layer) {
    case "storm":
      if (!hasStorm) return [];
      return [
        {
          positions: [[-30, -65], [-30, -60], [-38, -60], [-38, -65]],
          color: "#eab308",
          level: "Alerta Amarilla de Tormentas",
          desc: `Tormentas registradas para ${selectedDay} (Probabilidad / Código ${weatherCode}).`
        }
      ];
    case "rain":
      if (!hasRain) return [];
      return [
        {
          positions: [[-28, -60], [-28, -55], [-35, -55], [-35, -60]],
          color: "#3b82f6",
          level: "Lluvias Intensas",
          desc: `Precipitaciones continuas previstas para el día ${selectedDay} (${maxRainProb}% de probabilidad).`
        }
      ];
    case "wind":
      if (!hasWind) return [];
      return [
        {
          positions: [[-40, -70], [-40, -63], [-55, -63], [-55, -70]],
          color: "#06b6d4",
          level: "Vientos Fuertes (Patagonia)",
          desc: `Corredor de ráfagas intensas actualizado al ${selectedDay}.`
        }
      ];
    case "snow":
      if (!hasSnow) return [];
      return [
        {
          positions: [[-32, -70.5], [-32, -69], [-42, -69], [-42, -72]],
          color: "#6366f1",
          level: "Nevadas Cordilleranas",
          desc: `Acumulación de nieve esperada para ${selectedDay}.`
        }
      ];
    default:
      return [];
  }
};

interface RealArgentinaMapProps {
  daily?: {
    time: string[];
    precipitation_probability_max?: number[];
    weather_code?: number[];
  } | null;
}

export function RealArgentinaMap({ daily }: RealArgentinaMapProps) {
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

  // Evaluamos disponibilidad real para cada botón según el día seleccionado y los datos de la API
  const getDayIndex = (dayLabel: string) => {
    if (!daily || !daily.time) return 0;
    const idx = daily.time.findIndex((dateStr: string) => {
      const apiDate = new Date(dateStr + "T00:00:00");
      return dayLabel.includes(apiDate.getDate().toString());
    });
    return idx !== -1 ? idx : 0;
  };

  const currentIndex = getDayIndex(selectedDay);
  const currentRainProb = daily?.precipitation_probability_max?.[currentIndex] ?? 0;
  const currentWeatherCode = daily?.weather_code?.[currentIndex] ?? 0;

  const hasStormData = currentWeatherCode >= 95;
  const hasRainData = currentRainProb >= 30 || (currentWeatherCode >= 51 && currentWeatherCode <= 67) || (currentWeatherCode >= 80 && currentWeatherCode <= 82);
  const hasWindData = false;
  const hasSnowData = currentWeatherCode >= 71 && currentWeatherCode <= 77;

  // Polígonos filtrados estrictamente por la realidad de la API
  const polygons = getAlertPolygons(activeLayer, selectedDay, daily);

  if (!isMounted) {
    return <div className="w-full h-80 bg-slate-950 rounded-2xl flex items-center justify-center text-xs text-slate-400">Cargando mapa...</div>;
  }

  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-4 shadow-2xl backdrop-blur-xl mt-4 space-y-3 text-white">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xs flex items-center gap-1.5">
          <span>🗺️</span> Mapa Estilo Google Maps (Datos Reales)
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
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              selectedDay === day.label
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Botones de capas (Dinámicos: Se deshabilitan si no hay fenómeno real) */}
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { id: "storm", icon: "⛈️", label: "Tormentas", available: hasStormData },
          { id: "rain", icon: "🌧️", label: "Lluvias", available: hasRainData },
          { id: "wind", icon: "💨", label: "Vientos", available: hasWindData },
          { id: "snow", icon: "❄️", label: "Nieve", available: hasSnowData },
        ].map((layer) => (
          <button
            key={layer.id}
            onClick={() => {
              if (layer.available) setActiveLayer(layer.id);
            }}
            disabled={!layer.available}
            className={`py-2 px-1 rounded-xl border text-[11px] flex flex-col items-center justify-center gap-1 transition font-medium ${
              !layer.available
                ? "opacity-30 cursor-not-allowed bg-slate-950 border-slate-900 text-slate-600"
                : activeLayer === layer.id
                ? "bg-amber-500/20 border-amber-500/80 text-amber-300 font-bold shadow-lg cursor-pointer"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 cursor-pointer"
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
          <TileLayer 
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=es"
            maxZoom={20}
          />

          {polygons.map((poly, index) => (
            <Polygon
              key={`${activeLayer}-${selectedDay}-${index}`}
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

        <div className="absolute bottom-2 left-2 z-[400] text-[10px] text-slate-800 bg-white/95 px-3 py-1.5 rounded-xl border border-slate-300 backdrop-blur font-medium shadow-lg pointer-events-none">
          🇦🇷 <strong>ARGENTINA</strong> • <span className="uppercase text-blue-600">{activeLayer}</span> ({selectedDay})
          {polygons.length === 0 && <span className="block text-[9px] text-emerald-600 font-bold mt-0.5">✨ Sin alertas reales para este filtro</span>}
        </div>
      </div>
    </div>
  );
}