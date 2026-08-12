"use client";

import { useState, useEffect } from "react";
import { MapPin, Search, Loader2, Sun, CloudRain, Moon, Cloud, CloudLightning, Snowflake } from "lucide-react";
import Navigation from "@/components/Navigation";
import WeatherForecast from "@/components/WeatherForecast";
import ExtendedForecast from "@/components/ExtendedForecast";
import WeatherDetails from "@/components/WeatherDetails";
import { AnimatedMascot } from "@/components/AnimatedMascot";
import { RealArgentinaMap } from "@/components/RealArgentinaMap";
import { SismosListWithModal } from "@/components/SismosListWithModal";
import WeatherScene from "@/components/WeatherScene";
import { useAppStore } from "@/store/useAppStore";

export default function Home() {
  const { minMagnitude } = useAppStore();
  
  const CASTELAR_COORDS = { lat: -34.6565, lng: -58.6493 };
  
  const [coords, setCoords] = useState(CASTELAR_COORDS);
  const [cityName, setCityName] = useState("Castelar, Buenos Aires");
  const [searchQuery, setSearchQuery] = useState("");
  const [cityResults, setCityResults] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Estado para controlar qué pestaña se muestra (Clima o Sismos)
  const [activeTab, setActiveTab] = useState<"weather" | "earthquakes">("weather");
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchWeather = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,weather_code,precipitation_probability&timezone=auto`
      );
      const data = await res.json();
      if (data && data.current) {
        setWeatherData(data);
      }
    } catch (err) {
      setError("No se pudo cargar el clima.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCity = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setCityResults([]);
      return;
    }
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=es&format=json`);
      const data = await res.json();
      setCityResults(data.results || []);
    } catch (err) {
      console.error("Error buscando ciudad", err);
    }
  };

  const selectCity = (city: any) => {
    setCoords({ lat: city.latitude, lng: city.longitude });
    setCityName(`${city.name}, ${city.admin1 || city.country || ""}`);
    setSearchQuery("");
    setCityResults([]);
    fetchWeather(city.latitude, city.longitude);
  };

  const handleResetToCastelar = () => {
    setCoords(CASTELAR_COORDS);
    setCityName("Castelar, Buenos Aires");
    setSearchQuery("");
    setCityResults([]);
    fetchWeather(CASTELAR_COORDS.lat, CASTELAR_COORDS.lng);
  };

  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLat = position.coords.latitude;
        const newLng = position.coords.longitude;
        setCoords({ lat: newLat, lng: newLng });
        setCityName("Mi Ubicación GPS");
        fetchWeather(newLat, newLng);
      },
      () => {
        setLoading(false);
        alert("No se pudo obtener la ubicación GPS.");
        fetchWeather(coords.lat, coords.lng);
      }
    );
  };

  useEffect(() => {
    fetchWeather(coords.lat, coords.lng);
  }, []);

  const weatherCode = weatherData?.current?.weather_code ?? 0;
  const isSunny = weatherCode <= 2;
  const isRainy = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 99);
  
  const currentHour = new Date().getHours();
  const isNight = currentHour < 6 || currentHour > 20;

  const getWeatherType = () => {
    if (weatherCode >= 71 && weatherCode < 80) return "snow";
    if (isRainy) return "rain";
    if (isNight) return "night";
    return "sunny";
  };

  const getWeatherDescription = () => {
    if (weatherCode >= 95) return "Tormenta eléctrica";
    if (weatherCode >= 71 && weatherCode <= 77) return "Nieve";
    return isSunny ? "Despejado" : isRainy ? "Lluvia" : isNight ? "Noche despejada" : "Nublado";
  };

  return (
    <main className="relative w-screen h-screen text-white overflow-hidden flex justify-center items-center">
      
      {/* 1. FONDO DINÁMICO ANIMADO */}
      <WeatherScene weather={getWeatherType()} />

      {/* 2. TARJETA CENTRAL FLOTANTE */}
      <div className="relative z-10 w-full max-w-lg h-[92vh] rounded-[32px] bg-slate-950/40 backdrop-blur-md border border-white/10 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        
        <div>
          {/* Selector de Pestañas para cambiar entre Clima y Sismos */}
          <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-white/10 mb-4">
            <button
              onClick={() => setActiveTab("weather")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
                activeTab === "weather" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              🌤️ Clima y Alertas
            </button>
            <button
              onClick={() => setActiveTab("earthquakes")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
                activeTab === "earthquakes" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              🌍 Sismos del Mundo
            </button>
          </div>

          {activeTab === "weather" ? (
            /* VISTA DE CLIMA */
            <>
              {/* Barra Superior */}
              <header className="flex justify-between items-center mb-4 pt-2">
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
                  <MapPin className="text-blue-400 shrink-0" size={14} />
                  <span className="font-semibold text-xs truncate max-w-[140px] text-slate-100">{cityName}</span>
                </div>
                <div className="flex gap-1.5">
                  {cityName !== "Castelar, Buenos Aires" && (
                    <button 
                      onClick={handleResetToCastelar}
                      className="text-[10px] bg-blue-600/95 hover:bg-blue-500 px-3 py-1.5 rounded-full transition font-medium shadow-md cursor-pointer backdrop-blur-md"
                    >
                      🏠 Castelar
                    </button>
                  )}
                  <button 
                    onClick={handleGetGPS}
                    className="text-[10px] bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-full transition font-medium shadow-md cursor-pointer backdrop-blur-md"
                  >
                    GPS
                  </button>
                </div>
              </header>

              {/* Buscador */}
              <div className="relative mb-4">
                <div className="flex items-center bg-slate-900/60 border border-white/15 rounded-2xl px-3 py-2 shadow-inner backdrop-blur-md">
                  <Search size={15} className="text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Buscar otra ciudad..."
                    value={searchQuery}
                    onChange={(e) => handleSearchCity(e.target.value)}
                    className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
                  />
                </div>

                {cityResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
                    {cityResults.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => selectCity(city)}
                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-800 transition border-b border-slate-800/50 last:border-none flex justify-between items-center cursor-pointer"
                      >
                        <span className="font-medium text-slate-200">{city.name}</span>
                        <span className="text-[10px] text-slate-400">{city.admin1}, {city.country}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bloque Principal de Temperatura Dinámico con Icono */}
              <div className="text-center my-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Loader2 className="animate-spin mb-2 text-blue-400" size={28} />
                    <p className="text-xs text-slate-400">Actualizando clima...</p>
                  </div>
                ) : error ? (
                  <p className="text-red-400 text-center text-xs">{error}</p>
                ) : weatherData && weatherData.current ? (
                  <div>
                    <div className="flex justify-center items-center gap-3">
                      <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-lg">
                        {weatherCode >= 95 ? (
                          <CloudLightning className="text-yellow-400 animate-pulse" size={34} />
                        ) : weatherCode >= 71 && weatherCode <= 77 ? (
                          <Snowflake className="text-blue-200 animate-spin" size={34} />
                        ) : isRainy ? (
                          <CloudRain className="text-cyan-400 animate-bounce" size={34} />
                        ) : isNight ? (
                          <Moon className="text-indigo-300" size={34} />
                        ) : isSunny ? (
                          <Sun className="text-yellow-400 animate-spin" size={34} />
                        ) : (
                          <Cloud className="text-slate-300" size={34} />
                        )}
                      </div>

                      <div className="flex items-start">
                        <span className="text-7xl font-light tracking-tighter text-white drop-shadow-md">
                          {Math.round(weatherData.current.temperature_2m)}
                        </span>
                        <span className="text-3xl font-light text-blue-300 mt-1">°C</span>
                      </div>
                    </div>

                    <p className="text-slate-200 font-medium text-sm mt-2 drop-shadow">
                      {getWeatherDescription()}
                    </p>
                    <p className="text-xs text-slate-300 mt-1 drop-shadow">
                      Mín: {Math.round(weatherData.daily?.temperature_2m_min?.[0] ?? 0)}°C | Máx: {Math.round(weatherData.daily?.temperature_2m_max?.[0] ?? 0)}°C
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Sensación térmica: {Math.round(weatherData.current.apparent_temperature)}°C
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Mascota Animada */}
              <AnimatedMascot condition={getWeatherDescription()} />

              {/* Pronóstico por Horas */}
              <WeatherForecast hourly={weatherData?.hourly || null} />

              {/* Pronóstico Extendido a 7 Días (Con Hourly incorporado) */}
              <ExtendedForecast 
                daily={weatherData?.daily || null} 
                hourly={weatherData?.hourly || null} 
              />

              {/* Detalles del Clima (Viento, Humedad, etc.) */}
              <WeatherDetails current={weatherData?.current || null} />

              {/* MAPA DE ALERTAS OFICIAL (Argentina) */}
              <RealArgentinaMap />
            </>
          ) : (
            /* VISTA DE SISMOS INTEGRADA */
            <SismosListWithModal />
          )}

        </div>

        {/* Navegación Inferior */}
        <div className="pt-4 pb-2">
          <Navigation />
        </div>
        
      </div>
    </main>
  );
}