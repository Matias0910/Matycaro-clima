"use client";

import { useState, useEffect } from "react";
import { Activity, AlertTriangle, ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Carga dinámica de Leaflet para evitar errores de SSR en Next.js
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface Quake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  depth: number;
  lat: number;
  lng: number;
}

export default function QuakesPage() {
  const [quakes, setQuakes] = useState<Quake[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuake, setSelectedQuake] = useState<Quake | null>(null);

  // Función para verificar si un sismo ocurrió dentro de los límites de Argentina
  const isInsideArgentina = (lat: number, lng: number): boolean => {
    const minLat = -55.0;
    const maxLat = -21.0;
    const minLng = -73.5;
    const maxLng = -53.0;
    return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
  };

  const fetchQuakes = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson");
      if (!res.ok) throw new Error("Error al conectar con el servidor de la USGS");
      
      const data = await res.json();

      const formatted = data.features.map((item: any) => ({
        id: item.id,
        magnitude: item.properties.mag,
        place: item.properties.place,
        time: item.properties.time,
        depth: item.geometry.coordinates[2],
        lng: item.geometry.coordinates[0],
        lat: item.geometry.coordinates[1],
      }));

      setQuakes(formatted);
    } catch (err) {
      console.error("Error al cargar sismos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuakes();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 max-w-md mx-auto flex flex-col justify-between">
      <div>
        {/* Cabecera */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="p-2 bg-slate-900 rounded-full hover:bg-slate-800 transition border border-slate-800">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-bold text-sm">Sismos (Argentina y Mundo)</h1>
          </div>
          <button 
            onClick={fetchQuakes}
            className="p-2 bg-slate-900 rounded-full hover:bg-slate-800 transition text-blue-400 border border-slate-800 cursor-pointer"
            title="Actualizar"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </header>

        {/* Banner de regla de alerta */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={20} />
          <div className="text-xs text-amber-200">
            <p className="font-semibold mb-1">Criterio de Alerta Activo:</p>
            <p>Se vigilan sismos mayores o iguales a 4.5 mag dentro de todo el territorio de la <strong>Argentina</strong>.</p>
          </div>
        </div>

        {/* Lista de Sismos */}
        <div className="space-y-3 mb-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
              <p className="text-xs text-slate-400">Consultando red sísmica global...</p>
            </div>
          ) : quakes.length === 0 ? (
            <p className="text-center text-slate-400 py-10 text-xs">No hay sismos recientes registrados.</p>
          ) : (
            quakes.map((q) => {
              const inArg = isInsideArgentina(q.lat, q.lng);
              return (
                <div 
                  key={q.id} 
                  onClick={() => setSelectedQuake(q)}
                  className={`p-4 rounded-2xl border flex justify-between items-center cursor-pointer transition hover:border-slate-600 ${inArg ? 'bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/5' : 'bg-slate-900/60 border-slate-800'}`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${q.magnitude >= 6 ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"}`}>
                        Mag {q.magnitude.toFixed(1)}
                      </span>
                      {inArg && (
                        <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          🇦🇷 Argentina
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {q.time ? new Date(q.time).toLocaleDateString("es-ES") : "Fecha no disponible"}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 line-clamp-1">{q.place}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2 flex flex-col items-end">
                    <Activity size={18} className={`mb-1 ${inArg ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="text-[10px] text-slate-400">{q.depth.toFixed(0)} km prof.</span>
                    <span className="text-[10px] text-blue-400 mt-1 font-medium">📍 Ver mapa</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL DEL SISMO SELECCIONADO CON MAPA INTERACTIVO */}
      {selectedQuake && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-lg space-y-4 shadow-2xl">
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                  Magnitud {selectedQuake.magnitude.toFixed(1)}
                </span>
                <h3 className="font-bold text-white text-sm mt-1">{selectedQuake.place}</h3>
                <p className="text-xs text-slate-400">
                  Profundidad: {selectedQuake.depth.toFixed(0)} km • {new Date(selectedQuake.time).toLocaleDateString("es-ES")}
                </p>
              </div>
              <button 
                onClick={() => setSelectedQuake(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition text-xs font-bold cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Mapa interactivo con círculo rojo */}
            <div className="relative w-full h-72 rounded-2xl border border-slate-800 overflow-hidden z-0">
              <MapContainer
                center={[selectedQuake.lat, selectedQuake.lng]}
                zoom={6}
                scrollWheelZoom={true}
                style={{ width: "100%", height: "100%", background: "#0f172a" }}
                attributionControl={false}
              >
                <TileLayer 
                  url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=es"
                  maxZoom={20}
                />
                <CircleMarker 
                  center={[selectedQuake.lat, selectedQuake.lng]} 
                  radius={8}
                  pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.9 }}
                >
                  <Popup>
                    <div className="text-slate-900 text-xs font-sans">
                      <strong>{selectedQuake.place}</strong>
                      <p>Mag: {selectedQuake.magnitude.toFixed(1)}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              </MapContainer>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
              <span>Coordenadas: {selectedQuake.lat.toFixed(2)}, {selectedQuake.lng.toFixed(2)}</span>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${selectedQuake.lat},${selectedQuake.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                Abrir en Google Maps externo ↗
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Navegación rápida inferior */}
      <nav className="flex justify-around bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs backdrop-blur-md">
        <Link href="/" className="text-slate-400 hover:text-white transition">Clima</Link>
        <span className="text-blue-400 font-bold">Sismos</span>
        <Link href="/alerts" className="text-slate-400 hover:text-white transition">Alertas</Link>
      </nav>
    </main>
  );
}