"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2, RefreshCw } from "lucide-react";
import "leaflet/dist/leaflet.css";

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

interface Sismo {
  id: string;
  magnitude: number;
  date: string;
  location: string;
  depth: number;
  lat: number;
  lng: number;
}

export function SismosListWithModal() {
  const [selectedSismo, setSelectedSismo] = useState<Sismo | null>(null);
  const [sismos, setSismos] = useState<Sismo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSismos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"
      );
      const data = await res.json();

      if (data && data.features) {
        const formatted: Sismo[] = data.features.map((item: any) => {
          const dateObj = new Date(item.properties.time);
          return {
            id: item.id,
            magnitude: Number(item.properties.mag.toFixed(1)),
            date: dateObj.toLocaleString("es-AR", {
              timeZone: "America/Argentina/Buenos_Aires",
              dateStyle: "short",
              timeStyle: "short",
            }),
            location: item.properties.place || "Ubicación desconocida",
            depth: Math.round(item.geometry.coordinates[2]),
            lat: item.geometry.coordinates[1],
            lng: item.geometry.coordinates[0],
          };
        });
        setSismos(formatted);
      }
    } catch (err) {
      setError("No se pudieron cargar los sismos en tiempo real.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSismos();
  }, []);

  return (
    <div className="space-y-4 font-sans text-white">
      
      {/* Alerta de Criterio Activo y Botón de Recarga */}
      <div className="flex items-center justify-between gap-2 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <span>⚠️</span>
            <span>Criterio de Alerta Activo:</span>
          </div>
          <p className="text-slate-300 pl-5">
            Se vigilan sismos mayores o iguales a 4.5 mag en todo el mundo en tiempo real.
          </p>
        </div>
        <button
          onClick={fetchSismos}
          disabled={loading}
          className="p-2 bg-amber-500/25 hover:bg-amber-500/35 border border-amber-500/40 rounded-xl transition text-amber-300 shrink-0 cursor-pointer"
          title="Actualizar sismos"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Lista de Sismos */}
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-400 mb-2" size={28} />
            <p className="text-xs text-slate-400">Consultando red sísmica global...</p>
          </div>
        ) : error ? (
          <p className="text-red-400 text-center text-xs py-6">{error}</p>
        ) : sismos.length === 0 ? (
          <p className="text-slate-400 text-center text-xs py-6">No hay sismos recientes registrados.</p>
        ) : (
          sismos.map((sismo) => (
            <div
              key={sismo.id}
              onClick={() => setSelectedSismo(sismo)}
              className="p-4 bg-slate-900 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition flex items-center justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/20 text-amber-400 font-bold text-xs px-2 py-0.5 rounded-md border border-amber-500/30">
                    Mag {sismo.magnitude}
                  </span>
                  <span className="text-[11px] text-slate-400">{sismo.date}</span>
                </div>
                <h3 className="text-white font-medium text-sm mt-2">{sismo.location}</h3>
                <p className="text-slate-400 text-xs mt-1">{sismo.depth} km prof.</p>
              </div>

              <button className="flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-xl group-hover:bg-blue-500/20 transition shrink-0">
                📍 Ver mapa
              </button>
            </div>
          ))
        )}
      </div>

      {/* MODAL DEL SISMO SELECCIONADO */}
      {selectedSismo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-lg space-y-4 shadow-2xl">
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                  Magnitud {selectedSismo.magnitude}
                </span>
                <h3 className="font-bold text-white text-sm mt-1">{selectedSismo.location}</h3>
                <p className="text-xs text-slate-400">Profundidad: {selectedSismo.depth} km • {selectedSismo.date}</p>
              </div>
              <button 
                onClick={() => setSelectedSismo(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition text-xs font-bold cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Mapa interactivo con círculo rojo */}
            <div className="relative w-full h-72 rounded-2xl border border-slate-800 overflow-hidden z-0">
              <MapContainer
                center={[selectedSismo.lat, selectedSismo.lng]}
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
                  center={[selectedSismo.lat, selectedSismo.lng]} 
                  radius={8}
                  pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.9 }}
                >
                  <Popup>
                    <div className="text-slate-900 text-xs font-sans">
                      <strong>{selectedSismo.location}</strong>
                      <p>Mag: {selectedSismo.magnitude}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              </MapContainer>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
              <span>Coordenadas: {selectedSismo.lat.toFixed(2)}, {selectedSismo.lng.toFixed(2)}</span>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${selectedSismo.lat},${selectedSismo.lng}`}
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

    </div>
  );
}