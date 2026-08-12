"use client";

import { useState } from "react";
import { Sun, Cloud, CloudRain, CloudLightning, Snowflake } from "lucide-react";

interface ExtendedForecastProps {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max?: number[];
  } | null;
  hourly?: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability?: number[];
  } | null;
}

export default function ExtendedForecast({ daily, hourly }: ExtendedForecastProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  if (!daily || !daily.time) return null;

  // Función para obtener el icono y descripción según el código de clima de Open-Meteo
  const getWeatherInfo = (code: number) => {
    if (code >= 95) return { icon: <CloudLightning className="text-yellow-400" size={18} />, label: "Tormenta" };
    if (code >= 71 && code <= 77) return { icon: <Snowflake className="text-blue-200" size={18} />, label: "Nieve" };
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 99)) return { icon: <CloudRain className="text-cyan-400" size={18} />, label: "Lluvia" };
    if (code <= 2) return { icon: <Sun className="text-yellow-400" size={18} />, label: "Despejado" };
    return { icon: <Cloud className="text-slate-300" size={18} />, label: "Nublado" };
  };

  // Formatear el día de la semana (ej: "Hoy", "Lun", "Mar", etc.)
  const formatDayName = (dateStr: string, index: number) => {
    if (index === 0) return "Hoy";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-AR", { weekday: "short" });
  };

  const selectedDateStr = selectedDayIndex !== null ? daily.time[selectedDayIndex] : null;

  // Cálculo seguro por bloques de 24 horas exactas por cada día de la API
  const filteredHourly = hourly && hourly.time && selectedDayIndex !== null ? (() => {
    const startIndex = selectedDayIndex * 24;
    const endIndex = startIndex + 24;
    
    if (hourly.time.length < endIndex && hourly.time.length <= startIndex) return [];

    return hourly.time.slice(startIndex, endIndex).map((t, i) => {
      const globalIdx = startIndex + i;
      return {
        time: t,
        temp: hourly.temperature_2m && hourly.temperature_2m[globalIdx] !== undefined ? Math.round(hourly.temperature_2m[globalIdx]) : 0,
        code: hourly.weather_code && hourly.weather_code[globalIdx] !== undefined ? hourly.weather_code[globalIdx] : 0,
        precip: hourly.precipitation_probability && hourly.precipitation_probability[globalIdx] !== undefined ? hourly.precipitation_probability[globalIdx] : 0,
        hourFormatted: new Date(t).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
      };
    });
  })() : [];

  const selectedDay = selectedDayIndex !== null ? {
    date: selectedDateStr,
    max: Math.round(daily.temperature_2m_max[selectedDayIndex]),
    min: Math.round(daily.temperature_2m_min[selectedDayIndex]),
    code: daily.weather_code[selectedDayIndex],
    precip: daily.precipitation_probability_max?.[selectedDayIndex] ?? 0,
    name: formatDayName(selectedDateStr!, selectedDayIndex)
  } : null;

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-4 my-4 backdrop-blur-xl shadow-2xl text-white space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <span>📅</span> Pronóstico Semanal (Hacé clic en un día)
        </h3>
        {selectedDayIndex !== null && (
          <button 
            onClick={() => setSelectedDayIndex(null)}
            className="text-[10px] text-blue-400 hover:underline cursor-pointer font-semibold"
          >
            Ver todos los días ✕
          </button>
        )}
      </div>

      {/* Si hay un día seleccionado, mostramos detalle ampliado y tira hora por hora */}
      {selectedDay ? (
        <div className="space-y-3 animate-fadeIn">
          <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-950 rounded-xl border border-white/10">
                {getWeatherInfo(selectedDay.code).icon}
              </div>
              <div>
                <p className="text-xs font-bold text-white capitalize">{selectedDay.name} ({selectedDay.date})</p>
                <p className="text-[11px] text-slate-300">{getWeatherInfo(selectedDay.code).label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">{selectedDay.max}° / <span className="text-slate-400 font-normal">{selectedDay.min}°</span></p>
              <p className="text-[10px] text-cyan-300">💧 {selectedDay.precip}% máx. lluvia</p>
            </div>
          </div>

          {/* Tira Hora por Hora */}
          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] font-semibold text-slate-400 px-1">⏰ Detalle hora por hora:</p>
            <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {filteredHourly.length > 0 ? (
                filteredHourly.map((h, i) => {
                  const hInfo = getWeatherInfo(h.code);
                  return (
                    <div 
                      key={i} 
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-2.5 min-w-[75px] flex flex-col items-center justify-between text-center shrink-0 shadow-md"
                    >
                      <span className="text-[10px] font-bold text-slate-400">{h.hourFormatted}</span>
                      <div className="my-1.5">
                        {hInfo.icon}
                      </div>
                      <span className="text-xs font-bold text-white">{h.temp}°</span>
                      <span className="text-[9px] text-cyan-400 mt-0.5">💧{h.precip}%</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 py-3 text-center w-full">Cargando o sin datos por hora disponibles...</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Lista horizontal de los días de la semana */
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {daily.time.map((timeStr, idx) => {
            const maxTemp = Math.round(daily.temperature_2m_max[idx]);
            const minTemp = Math.round(daily.temperature_2m_min[idx]);
            const info = getWeatherInfo(daily.weather_code[idx]);
            const dayName = formatDayName(timeStr, idx);

            return (
              <button
                key={timeStr}
                onClick={() => setSelectedDayIndex(idx)}
                className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-2.5 flex flex-col items-center justify-between transition cursor-pointer group shadow-lg"
              >
                <span className="text-[10px] font-bold text-slate-300 uppercase">{dayName}</span>
                <div className="my-1.5 group-hover:scale-110 transition">
                  {info.icon}
                </div>
                <div className="text-[10px] space-y-0.5">
                  <p className="font-bold text-white">{maxTemp}°</p>
                  <p className="text-slate-400">{minTemp}°</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}