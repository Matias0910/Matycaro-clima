"use client";

import { useState } from "react";

const getDaysList = () => {
  const daysList = [];
  const today = new Date(); // Viernes 31 de Julio de 2026
  for (let i = 0; i < 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'long' });
    const dayNum = d.getDate();
    daysList.push({ id: i, label: `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNum}` });
  }
  return daysList;
};

export function WeatherAlertsCard() {
  const days = getDaysList();
  const [selectedDay, setSelectedDay] = useState(days[0].label);
  const [activeCategory, setActiveCategory] = useState("storm"); // storm, rain, wind, snow

  // Contenido de alertas oficiales según el botón presionado
  const alertContent: Record<string, { title: string; badge: string; desc: string; color: string }> = {
    storm: {
      title: "Alerta por Tormentas Severas",
      badge: "Amarilla / Naranja",
      desc: "Tormentas de variada intensidad, algunas localmente fuertes o severas. Ráfagas de viento intensas, posible caída de granizo y fuerte actividad eléctrica.",
      color: "border-amber-500/40 bg-amber-500/10 text-amber-300"
    },
    rain: {
      title: "Aviso por Lluvias Intensas",
      badge: "Precipitaciones Continuas",
      desc: "Acumulados importantes de precipitación en cortos períodos. Posibles anegamientos temporarios en zonas urbanas.",
      color: "border-blue-500/40 bg-blue-500/10 text-blue-300"
    },
    wind: {
      title: "Alerta por Vientos Fuertes",
      badge: "Ráfagas Intensas",
      desc: "Vientos sector cordillerano y llanuras con ráfagas que podrían superar los 75-90 km/h.",
      color: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
    },
    snow: {
      title: "Aviso por Nevadas Persistentes",
      badge: "Acumulación Nival",
      desc: "Nevadas de variada intensidad con reducción significativa de la visibilidad en rutas y caminos.",
      color: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
    }
  };

  const currentAlert = alertContent[activeCategory];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl mt-6 space-y-4 text-white">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xs text-slate-200">⚠️ Alertas Meteorológicas Oficiales</h2>
        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">Actualizado</span>
      </div>

      {/* Solapas de días (Jueves 30, Viernes 31, etc.) */}
      <div className="flex bg-slate-950 p-1 rounded-2xl gap-1 border border-slate-800">
        {days.map((day) => (
          <button
            key={day.id}
            onClick={() => setSelectedDay(day.label)}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              selectedDay === day.label
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Botones de filtros (Tormentas, Lluvias, Vientos, Nieve) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: "storm", icon: "⛈️", label: "Tormentas" },
          { id: "rain", icon: "🌧️", label: "Lluvias" },
          { id: "wind", icon: "💨", label: "Vientos" },
          { id: "snow", icon: "❄️", label: "Nieve" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition ${
              activeCategory === cat.id
                ? "bg-amber-500/20 border-amber-500/80 text-amber-300 font-bold"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 font-medium"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Tarjeta de información detallada según el filtro y día elegido */}
      <div className={`border rounded-2xl p-4 transition-all ${currentAlert.color}`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="space-y-1">
            <h3 className="font-bold text-xs">{currentAlert.title}</h3>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/30">
              {currentAlert.badge}
            </span>
            <p className="text-[11px] opacity-90 leading-relaxed pt-1">
              <span className="font-semibold">{selectedDay}:</span> {currentAlert.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}