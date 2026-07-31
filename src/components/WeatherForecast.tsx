"use client";

import { useState } from "react";
import { Sun, Moon, Cloud, CloudRain, Droplets, X, Thermometer, Wind } from "lucide-react";

interface WeatherForecastProps {
  hourly?: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability?: number[];
    relative_humidity_2m?: number[];
    wind_speed_10m?: number[];
  } | null;
}

export default function WeatherForecast({ hourly }: WeatherForecastProps) {
  const [showModal, setShowModal] = useState(false);

  if (!hourly || !hourly.time) return null;

  const now = new Date();
  const currentHourIndex = hourly.time.findIndex(timeStr => new Date(timeStr) >= now);
  const startIndex = currentHourIndex === -1 ? hourly.time.length - 6 : currentHourIndex;

  const nextHours = hourly.time.slice(startIndex, startIndex + 6).map((timeStr, index) => {
    const date = new Date(timeStr);
    const hourFormatted = index === 0 ? "Ahora" : `${date.getHours().toString().padStart(2, '0')}:00`;
    const temp = Math.round(hourly.temperature_2m[startIndex + index]);
    const code = hourly.weather_code[startIndex + index];
    const precip = hourly.precipitation_probability ? hourly.precipitation_probability[startIndex + index] : 0;

    let IconComponent = Sun;
    let iconColor = "text-amber-300";
    
    if (code >= 1 && code <= 3) {
      IconComponent = Cloud;
      iconColor = "text-slate-200";
    } else if (code >= 51) {
      IconComponent = CloudRain;
      iconColor = "text-cyan-400";
    } else if (date.getHours() < 6 || date.getHours() > 20) {
      IconComponent = Moon;
      iconColor = "text-blue-200";
    }

    return {
      time: hourFormatted,
      temp,
      precip,
      Icon: IconComponent,
      iconColor,
    };
  });

  const extendedHours = hourly.time.slice(0, 24).map((timeStr, index) => {
    const date = new Date(timeStr);
    const hourFormatted = `${date.getHours().toString().padStart(2, '0')}:00`;
    const temp = Math.round(hourly.temperature_2m[index]);
    const code = hourly.weather_code[index];
    const precip = hourly.precipitation_probability ? hourly.precipitation_probability[index] : 0;
    const humidity = hourly.relative_humidity_2m ? hourly.relative_humidity_2m[index] : 0;
    const wind = hourly.wind_speed_10m ? hourly.wind_speed_10m[index] : 0;

    let IconComponent = Sun;
    let iconColor = "text-amber-300";
    
    if (code >= 1 && code <= 3) {
      IconComponent = Cloud;
      iconColor = "text-slate-200";
    } else if (code >= 51) {
      IconComponent = CloudRain;
      iconColor = "text-cyan-400";
    } else if (date.getHours() < 6 || date.getHours() > 20) {
      IconComponent = Moon;
      iconColor = "text-blue-200";
    }

    return {
      time: hourFormatted,
      temp,
      precip,
      humidity,
      wind,
      Icon: IconComponent,
      iconColor,
    };
  });

  const temps = nextHours.map(h => h.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  return (
    <>
      <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[28px] p-4 shadow-2xl mb-4 text-white">
        <div className="flex justify-between items-center mb-4 px-1">
          <span className="text-xs font-semibold text-slate-200 tracking-wide">Pronóstico por horas</span>
          <button 
            onClick={() => setShowModal(true)}
            className="text-[11px] text-blue-400 font-medium cursor-pointer hover:underline bg-transparent border-none p-0"
          >
            Detalles &gt;
          </button>
        </div>

        <div className="grid grid-cols-6 gap-1 text-center mb-1">
          {nextHours.map((item, idx) => {
            const { Icon, iconColor } = item;
            return (
              <div key={idx} className="flex flex-col items-center justify-between">
                <span className="text-[11px] text-slate-300 font-medium mb-2">{item.time}</span>
                <div className="my-1 p-1 bg-white/5 rounded-xl border border-white/5 shadow-inner">
                  <Icon size={18} className={iconColor} />
                </div>
                <span className="text-xs font-bold text-white mt-2">{item.temp}°</span>
              </div>
            );
          })}
        </div>

        <div className="relative h-12 px-1 my-1">
          <svg width="100%" height="100%" viewBox="0 0 250 50" preserveAspectRatio="none">
            <path 
              d={
                "M " + temps.map((temp, i) => {
                  const x = i * (250 / 5);
                  const y = 45 - ((temp - minTemp) / ((maxTemp - minTemp) || 1)) * 40;
                  return `${x} ${y}`;
                }).join(" L ")
              }
              fill="none"
              stroke="rgba(56, 189, 248, 0.5)"
              strokeWidth="2"
            />
          </svg>
          <div className="absolute inset-0 flex justify-between items-center">
            {temps.map((temp, idx) => {
              const yPercent = 100 - ((temp - minTemp) / ((maxTemp - minTemp) || 1)) * 80;
              return <div 
                key={idx}
                className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] border border-slate-900"
                style={{ position: 'absolute', left: `calc(${idx * (100/5.5)}% + 8px)`, top: `calc(${yPercent}% - 4px)` }}
              />})}
          </div>
        </div>

        <div className="grid grid-cols-6 gap-1 text-center pt-1 border-t border-white/5">
          {nextHours.map((item, idx) => (
            <div key={idx} className="flex items-center justify-center gap-0.5 pt-1">
              <Droplets size={10} className="text-cyan-400 shrink-0" />
              <span className="text-[10px] text-slate-300 font-medium">{item.precip}%</span>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-slate-950 border border-white/15 w-full max-w-md max-h-[85vh] rounded-[32px] p-5 flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Thermometer size={16} className="text-blue-400" /> Detalle por Horas (24h)
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {extendedHours.map((hour, index) => {
                const { Icon, iconColor } = hour;
                return (
                  <div key={index} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-200 w-12">{hour.time}</span>
                      <div className="p-1.5 bg-white/5 rounded-xl border border-white/10">
                        <Icon size={16} className={iconColor} />
                      </div>
                      <span className="font-bold text-white text-sm">{hour.temp}°C</span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-300 text-[11px]">
                      <div className="flex items-center gap-1" title="Probabilidad de lluvia">
                        <Droplets size={12} className="text-cyan-400" />
                        <span>{hour.precip}%</span>
                      </div>
                      <div className="flex items-center gap-1" title="Viento">
                        <Wind size={12} className="text-blue-400" />
                        <span>{hour.wind} km/h</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xs font-semibold transition shadow-lg cursor-pointer"
            >
              Cerrar
            </button>

          </div>
        </div>
      )}
    </>
  );
}