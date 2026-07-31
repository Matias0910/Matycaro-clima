"use client";

import { useState } from "react";
import { Bell, BellOff, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";

// Generador dinámico de días
const getDaysList = () => {
  const daysList = [];
  const today = new Date();
  
  for (let i = 0; i < 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'long' });
    const dayNum = d.getDate();
    const formatted = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNum}`;
    daysList.push({ id: i, label: formatted });
  }
  return daysList;
};

export default function AlertsPage() {
  const { minMagnitude, notificationsEnabled, setMinMagnitude, setNotificationsEnabled } = useAppStore();
  
  const days = getDaysList();
  const [selectedDay, setSelectedDay] = useState(days[0].label);
  const [activeLayer, setActiveLayer] = useState("storm"); // storm, rain, wind, snow

  const alertDetails: Record<string, { title: string; type: string; color: string; desc: string }> = {
    storm: {
      title: "Alerta por Tormentas Severas",
      type: "Tormentas de variada intensidad",
      color: "border-amber-500/50 bg-amber-500/10 text-amber-300",
      desc: "Tormentas fuertes o localmente severas. Ráfagas de viento, posible caída de granizo y fuerte actividad eléctrica."
    },
    rain: {
      title: "Alerta por Lluvias Intensas",
      type: "Precipitaciones Continuas",
      color: "border-blue-500/50 bg-blue-500/10 text-blue-300",
      desc: "Lluvias persistentes de moderada a fuerte intensidad en cortos períodos."
    },
    wind: {
      title: "Alerta por Vientos Fuertes",
      type: "Ráfagas Intensas",
      color: "border-cyan-500/50 bg-cyan-500/10 text-cyan-300",
      desc: "Vientos con ráfagas que podrían superar los límites habituales en la región."
    },
    snow: {
      title: "Aviso por Nevadas",
      type: "Acumulación Nival",
      color: "border-indigo-500/50 bg-indigo-500/10 text-indigo-300",
      desc: "Nevadas de variada intensidad con reducción de visibilidad."
    }
  };

  const currentAlert = alertDetails[activeLayer];

  const handleToggleNotifications = async () => {
    if (!("Notification" in window)) {
      alert("Tu navegador no soporta notificaciones push.");
      return;
    }

    if (Notification.permission === "granted") {
      setNotificationsEnabled(!notificationsEnabled);
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        new Notification("¡Alertas activadas!", {
          body: "Te avisaremos cuando ocurra un sismo importante en Argentina.",
        });
      } else {
        alert("Has denegado los permisos de notificación.");
      }
    }
  };

  const handleTestNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("🚨 Alerta de Sismo de Prueba (Pro)", {
        body: `Simulación de sismo detectada con umbral ≥ ${minMagnitude} Mag.`,
      });
    } else {
      alert("Primero debes activar y permitir las notificaciones del navegador.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-6 max-w-md mx-auto flex flex-col justify-between">
      <div className="space-y-5">
        <header className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Link href="/" className="p-2 bg-slate-900 rounded-full hover:bg-slate-800 transition border border-slate-800">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-bold text-sm">Centro de Alertas (Clima y Sismos)</h1>
          </div>
        </header>

        {/* ==================== SECCIÓN DE ALERTAS METEOROLÓGICAS ==================== */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <h2 className="font-semibold text-xs text-slate-300">🗺️ Alertas Meteorológicas Oficiales</h2>

          {/* Solapas de días */}
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

          {/* Botones de capas */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: "storm", icon: "⛈️", label: "Tormentas" },
              { id: "rain", icon: "🌧️", label: "Lluvias" },
              { id: "wind", icon: "💨", label: "Vientos" },
              { id: "snow", icon: "❄️", label: "Nieve" },
            ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition ${
                  activeLayer === layer.id
                    ? "bg-amber-500/20 border-amber-500/80 text-amber-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span>{layer.icon}</span>
                <span>{layer.label}</span>
              </button>
            ))}
          </div>

          {/* Tarjeta de descripción de la alerta */}
          <div className={`border rounded-2xl p-3.5 ${currentAlert.color}`}>
            <div className="flex items-start gap-2.5">
              <span className="text-xl">⚠️</span>
              <div>
                <h3 className="font-bold text-xs">{currentAlert.title}</h3>
                <p className="text-[11px] mt-1 opacity-90 leading-tight">
                  <span className="font-semibold">{selectedDay}:</span> {currentAlert.desc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== TARJETA DE NOTIFICACIONES PUSH ==================== */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              {notificationsEnabled ? (
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                  <Bell size={20} />
                </div>
              ) : (
                <div className="p-2.5 bg-slate-800 text-slate-400 rounded-2xl border border-slate-700">
                  <BellOff size={20} />
                </div>
              )}
              <div>
                <h2 className="font-semibold text-xs">Notificaciones Push</h2>
                <p className="text-[10px] text-slate-400">Estado persistente</p>
              </div>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                notificationsEnabled
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20"
              }`}
            >
              {notificationsEnabled ? "Activadas" : "Activar"}
            </button>
          </div>

          <button
            onClick={handleTestNotification}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition border border-slate-700/60"
          >
            <Send size={14} /> Probar Notificación Pro
          </button>
        </div>

        {/* ==================== AJUSTES DE UMBRAL (ZUSTAND) ==================== */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <h2 className="font-semibold text-xs mb-3">Filtros de Sismos (Argentina)</h2>
          
          <div className="mb-3">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Umbral mínimo:</span>
              <span className="font-bold text-amber-400">≥ {minMagnitude} Mag</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="6.0"
              step="0.1"
              value={minMagnitude}
              onChange={(e) => setMinMagnitude(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <nav className="flex justify-around bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs backdrop-blur-md mt-6">
        <Link href="/" className="text-slate-400 hover:text-white transition">Clima</Link>
        <Link href="/quakes" className="text-slate-400 hover:text-white transition">Sismos</Link>
        <span className="text-blue-400 font-bold">Alertas</span>
      </nav>
    </main>
  );
}