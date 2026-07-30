// src/components/WeatherScreen.tsx
import "./WeatherScreen.css";

interface WeatherScreenProps {
  weather: "sunny" | "rain" | "night" | "storm" | "snow";
}

export default function WeatherScreen({ weather }: WeatherScreenProps) {
  return (
    <div className={`weather-container ${weather}`}>
      {/* Elemento dinámico según el clima */}
      {weather === "sunny" && <div className="sun-ray"></div>}
      {weather === "rain" && (
        <div className="rain-container">
          {[...Array(30)].map((_, i) => (
            <span key={i} className="raindrop" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: `${0.5 + Math.random() * 0.5}s` }}></span>
          ))}
        </div>
      )}
      {weather === "night" && (
        <div className="stars-container">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="star" style={{ top: `${Math.random() * 80}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s` }}></span>
          ))}
        </div>
      )}
    </div>
  );
}