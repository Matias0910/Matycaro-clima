"use client";

import { useState } from "react";

export function AlertsSection() {
  const [selectedDay, setSelectedDay] = useState("Viernes 31");
  const [activeLayer, setActiveLayer] = useState("storm"); // storm, rain, wind, etc.

  const days = ["Jueves 30", "Viernes 31", "Sábado 1"];

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/50 text-white shadow-xl">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        ⚠️ Alertas Meteorológicas
      </h2>

      {/* Solapas de días */}
      <div className="flex bg-slate-800/80 p-1 rounded-xl mb-4 gap-1">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              selectedDay === day
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Botones de capas (Tipo de fenómeno) */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveLayer("storm")}
          className={`p-3 rounded-xl border transition-all flex items-center justify-center ${
            activeLayer === "storm"
              ? "bg-amber-500/20 border-amber-500 text-amber-400"
              : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
          }`}
          title="Tormentas"
        >
          ⛈️
        </button>
        <button
          onClick={() => setActiveLayer("rain")}
          className={`p-3 rounded-xl border transition-all flex items-center justify-center ${
            activeLayer === "rain"
              ? "bg-blue-500/20 border-blue-500 text-blue-400"
              : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
          }`}
          title="Lluvia"
        >
          🌧️
        </button>
        <button
          onClick={() => setActiveLayer("wind")}
          className={`p-3 rounded-xl border transition-all flex items-center justify-center ${
            activeLayer === "wind"
              ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
              : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
          }`}
          title="Viento"
        >
          💨
        </button>
      </div>

      {/* Panel de detalles de la alerta según el día seleccionado */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-amber-400">Alerta Amarilla / Naranja</h3>
            <p className="text-xs text-slate-300 mt-1">
              {selectedDay}: Tormentas de variada intensidad, algunas fuertes o localmente severas. Posible caída de granizo y ráfagas intensas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}