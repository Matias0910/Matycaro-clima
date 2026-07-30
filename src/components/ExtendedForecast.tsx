// src/app/components/ExtendedForecast.tsx
import { Sun, CloudRain, Cloud, Snowflake, CloudLightning } from "lucide-react";

interface ExtendedForecastProps {
  daily: any;
}

export default function ExtendedForecast({ daily }: ExtendedForecastProps) {
  if (!daily || !daily.time) return null;

  const getWeatherIcon = (code: number) => {
    if (code >= 95) return <CloudLightning className="text-yellow-400" size={20} />;
    if (code >= 71 && code <= 77) return <Snowflake className="text-blue-200" size={20} />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 99)) return <CloudRain className="text-cyan-400" size={20} />;
    if (code <= 2) return <Sun className="text-yellow-400" size={20} />;
    return <Cloud className="text-slate-300" size={20} />;
  };

  const getWeatherDescription = (code: number) => {
    if (code >= 95) return "Tormenta";
    if (code >= 71 && code <= 77) return "Nieve";
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 99)) return "Lluvia";
    if (code <= 2) return "Soleado";
    return "Nublado";
  };

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 mt-4 backdrop-blur-md shadow-lg">
      <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Pronóstico a 7 días</h3>
      <div className="space-y-2.5">
        {daily.time.slice(0, 7).map((dateStr: string, index: number) => {
          const date = new Date(dateStr);
          const dayName = index === 0 ? "Hoy" : date.toLocaleDateString("es-ES", { weekday: 'short' });
          const code = daily.weather_code[index];
          const minTemp = Math.round(daily.temperature_2m_min[index]);
          const maxTemp = Math.round(daily.temperature_2m_max[index]);

          return (
            <div key={dateStr} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-none">
              <span className="w-16 font-medium capitalize text-slate-200">{dayName}</span>
              <div className="flex items-center gap-2">
                {getWeatherIcon(code)}
                <span className="text-slate-300 w-20 text-left">{getWeatherDescription(code)}</span>
              </div>
              <div className="flex items-center gap-3 w-24 justify-end">
                <span className="text-slate-400">{minTemp}°</span>
                {/* Barra de rango visual simple */}
                <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <span className="text-white font-semibold">{maxTemp}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}