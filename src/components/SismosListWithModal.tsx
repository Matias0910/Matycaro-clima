"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Carga dinámica de Leaflet para evitar errores con SSR en Next.js
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
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

const sampleSismos: Sismo[] = [
  {
    id: "1",
    magnitude: 5.2,
    date: "31/7/2026",
    location: "85 km SW of El Arenal, Mexico",
    depth: 10,
    lat: 19.5,
    lng: -105.2,
  },
  {
    id: "2",
    magnitude: 4.7,
    date: "31/7/2026",
    location: "260 km NNW of Puerto Ayora, Ecuador",
    depth: 10,
    lat: -0.6,
    lng: -91.5,
  },
  {
    id: "3",
    magnitude: 4.6,
    date: "31/7/2026",
    location: "95 km WNW of Amagi, Japan",
    depth: 10,
    lat: 34.5,
    lng: 138.5,
  },
  {
    id: "4",
    magnitude: 4.5,
    date: "31/7/2026",
    location: "31 km WNW of Titahi Bay, New Zealand",
    depth: 56,
    lat: -41.1,
    lng: 174.8,
  },
];

export function SismosListWithModal() {
  const [selectedSismo, setSelectedSismo] = useState<Sismo | null>(null);

  return (
    <div className="space-y-4 font-sans text-white">
      
      {/* Alerta de Criterio Activo */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 space-y-1">
        <div className="flex items-center gap-2 font-bold">
          <span>⚠️</span>
          <span>Criterio de Alerta Activo:</span>
        </div>
        <p className="text-slate-300 pl-5">
          Se vigilan sismos mayores o iguales a 4.5 mag dentro de todo el territorio de la Argentina y el mundo.
        </p>
      </div>

      {/* Lista de Sismos con el botón interactivo de mapa */}
      <div className="space-y-3">
        {sampleSismos.map((sismo) => (
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
        ))}
      </div>

      {/* MODAL DEL SISMO SELECCIONADO (Se abre al hacer clic en cualquier tarjeta) */}
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

            {/* Mapa interactivo dentro del Modal */}
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
                <Marker position={[selectedSismo.lat, selectedSismo.lng]}>
                  <Popup>
                    <div className="text-slate-900 text-xs font-sans">
                      <strong>{selectedSismo.location}</strong>
                      <p>Mag: {selectedSismo.magnitude}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
              <span>Coordenadas: {selectedSismo.lat}, {selectedSismo.lng}</span>
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