"use client";

import { useState } from "react";

const getDaysList = () => {
  const daysList = [];
  const today = new Date(); // 31 de Julio de 2026
  for (let i = 0; i < 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'long' });
    const dayNum = d.getDate();
    daysList.push({ id: i, label: `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNum}` });
  }
  return daysList;
};

export function OfficialAlertsMap() {
  const days = getDaysList();
  const [selectedDay, setSelectedDay] = useState(days[0].label);
  const [activeLayer, setActiveLayer] = useState("storm"); // storm, rain, wind, snow

  // Datos dinámicos simulando el mapa oficial de alertas por región según la capa seleccionada
  const getRegionStatus = (regionId: string) => {
    // Simulador de estados según capa y día para que sea interactivo y realista
    if (activeLayer === "storm") {
      if (regionId === "centro") return { level: "Naranja", color: "bg-orange-500/90 border-orange-400 text-white shadow-orange-500/30" };
      if (regionId === "noa" || regionId === "litoral") return { level: "Amarilla", color: "bg-amber-500/80 border-amber-400 text-white shadow-amber-500/30" };
      return { level: "Sin Alerta", color: "bg-slate-900/60 border-slate-800 text-slate-400" };
    }
    if (activeLayer === "rain") {
      if (regionId === "litoral" || regionId === "centro") return { level: "Moderada", color: "bg-blue-600/80 border-blue-400 text-white shadow-blue-500/30" };
      return { level: "Normal", color: "bg-slate-900/60 border-slate-800 text-slate-400" };
    }
    if (activeLayer === "wind") {
      if (regionId === "patagonia" || regionId === "cuyo") return { level: "Alerta Fuerte", color: "bg-cyan-600/80 border-cyan-400 text-white shadow-cyan-500/30" };
      return { level: "Normal", color: "bg-slate-900/60 border-slate-800 text-slate-400" };
    }
    if (activeLayer === "snow") {
      if (regionId === "patagonia" || regionId === "cuyo") return { level: "Nival", color: "bg-indigo-600/80 border-indigo-400 text-white shadow-indigo-500/30" };
      return { level: "Sin Nieve", color: "bg-slate-900/60 border-slate-800 text-slate-400" };
    }
    return { level: "Normal", color: "bg-slate-900/60 border-slate-800 text-slate-400" };
  };

  const descriptions: Record<string, string> = {
    storm: "Tormentas de variada intensidad. Algunas pueden ser localmente fuertes, acompañadas de ráfagas intensas y ocasional caída de granizo.",
    rain: "Precipitaciones persistentes con acumulados importantes que pueden generar anegamientos locales temporarios.",
    wind: "Vientos intensos del sector oeste con ráfagas que pueden superar los 80-95 km/h en zonas cordilleranas y llanuras.",
    snow: "Nevadas persistentes y de variada intensidad, con reducción significativa de visibilidad por viento blanco."
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-2xl backdrop-blur-xl mt-4 space-y-3 text-white">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xs flex items-center gap-1.5">
          <span>🗺️</span> Mapa de Alertas Oficiales (Argentina)
        </h2>
        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-semibold border border-blue-500/30">
          SMN Style
        </span>
      </div>

      {/* Solapas de días */}
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
            className={`py-2 px-1 rounded-xl border text-[11px] flex flex-col sm:flex-row items-center justify-center gap-1 transition font-medium ${
              activeLayer === layer.id
                ? "bg-amber-500/20 border-amber-500/80 text-amber-300 font-bold shadow-lg"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <span>{layer.icon}</span>
            <span>{layer.label}</span>
          </button>
        ))}
      </div>

      {/* VISUALIZADOR DE MAPA POR REGIONES */}
      <div className="relative w-full h-48 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-2">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:14px_14px]"></div>

        {/* Simulador esquemático de las regiones de Argentina en forma de mapa visual */}
        <div className="relative w-36 h-44 flex flex-col gap-1 z-10 justify-center">
          
          {/* NOA */}
          <div className={`w-full py-1 px-2 rounded-md border text-center text-[10px] font-bold shadow transition-all ${getRegionStatus("noa").color}`}>
            NOA ({getRegionStatus("noa").level})
          </div>

          <div className="flex gap-1 w-full">
            {/* Cuyo */}
            <div className={`flex-1 py-1 px-1 rounded-md border text-center text-[9px] font-bold shadow transition-all ${getRegionStatus("cuyo").color}`}>
              Cuyo ({getRegionStatus("cuyo").level})
            </div>
            {/* Centro / Buenos Aires */}
            <div className={`flex-1 py-1 px-1 rounded-md border text-center text-[9px] font-bold shadow transition-all ${getRegionStatus("centro").color}`}>
              Centro/BA ({getRegionStatus("centro").level})
            </div>
          </div>

          <div className="flex gap-1 w-full">
            {/* Litoral */}
            <div className={`flex-1 py-1 px-1 rounded-md border text-center text-[9px] font-bold shadow transition-all ${getRegionStatus("litoral").color}`}>
              Litoral ({getRegionStatus("litoral").level})
            </div>
            {/* Patagonia */}
            <div className={`flex-1 py-1 px-1 rounded-md border text-center text-[9px] font-bold shadow transition-all ${getRegionStatus("patagonia").color}`}>
              Patagonia ({getRegionStatus("patagonia").level})
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 left-2 text-[9px] text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
          📍 {selectedDay} • Capa: <span className="uppercase text-amber-400 font-bold">{activeLayer}</span>
        </div>
      </div>

      {/* Descripción de la alerta activa */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-[11px] space-y-1">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <span>⚠️</span>
          <span>Reporte Oficial para {selectedDay}</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          {descriptions[activeLayer]}
        </p>
      </div>
    </div>
  );
}