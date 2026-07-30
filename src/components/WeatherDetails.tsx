// src/app/components/WeatherDetails.tsx
import { Wind, Droplets, Thermometer, Eye, Compass, Activity } from "lucide-react";

interface WeatherDetailsProps {
  current: any;
}

export default function WeatherDetails({ current }: WeatherDetailsProps) {
  if (!current) return null;

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {/* Viento */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md shadow-lg flex items-center gap-3">
        <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
          <Wind size={20} />
        </div>
        <div>
          <p className="text-[10px] uppercase font-medium text-slate-400">Viento</p>
          <p className="text-sm font-semibold text-white">{current.wind_speed_10m} <span className="text-xs font-normal text-slate-300">km/h</span></p>
        </div>
      </div>

      {/* Humedad */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md shadow-lg flex items-center gap-3">
        <div className="p-2.5 bg-cyan-500/20 rounded-xl text-cyan-400">
          <Droplets size={20} />
        </div>
        <div>
          <p className="text-[10px] uppercase font-medium text-slate-400">Humedad</p>
          <p className="text-sm font-semibold text-white">{current.relative_humidity_2m}<span className="text-xs font-normal text-slate-300">%</span></p>
        </div>
      </div>

      {/* Sensación Térmica */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md shadow-lg flex items-center gap-3">
        <div className="p-2.5 bg-yellow-500/20 rounded-xl text-yellow-400">
          <Thermometer size={20} />
        </div>
        <div>
          <p className="text-[10px] uppercase font-medium text-slate-400">Sensación</p>
          <p className="text-sm font-semibold text-white">{Math.round(current.apparent_temperature)}<span className="text-xs font-normal text-slate-300">°C</span></p>
        </div>
      </div>

      {/* Código del Tiempo / Estado */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md shadow-lg flex items-center gap-3">
        <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400">
          <Activity size={20} />
        </div>
        <div>
          <p className="text-[10px] uppercase font-medium text-slate-400">Código WMO</p>
          <p className="text-sm font-semibold text-white">{current.weather_code}</p>
        </div>
      </div>
    </div>
  );
}