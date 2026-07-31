"use client";

import { Bell, BellOff, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";

export default function AlertsPage() {
  const { minMagnitude, notificationsEnabled, setMinMagnitude, setNotificationsEnabled } = useAppStore();

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
    <main className="min-h-screen bg-slate-950 text-white p-6 max-w-md mx-auto flex flex-col justify-between">
      <div>
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="p-2 bg-slate-900 rounded-full hover:bg-slate-800 transition border border-slate-800">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-bold text-sm">Configuración Pro de Alertas</h1>
          </div>
        </header>

        {/* Tarjeta de Notificaciones */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-5 shadow-xl">
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
                <p className="text-[10px] text-slate-400">Estado persistente en la nube/local</p>
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

        {/* Ajustes de Umbral con Zustand */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <h2 className="font-semibold text-xs mb-3">Filtros de Sismos (Argentina)</h2>
          
          <div className="mb-4">
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

          <div className="text-[11px] bg-slate-950 p-3 rounded-2xl border border-slate-800 text-slate-300">
            <p>ℹ️ Tu configuración de umbral se almacena automáticamente en el estado global de la aplicación.</p>
          </div>
        </div>
      </div>

      <nav className="flex justify-around bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs backdrop-blur-md">
        <Link href="/" className="text-slate-400 hover:text-white transition">Clima</Link>
        <Link href="/quakes" className="text-slate-400 hover:text-white transition">Sismos</Link>
        <span className="text-blue-400 font-bold">Alertas</span>
      </nav>
    </main>
  );
}