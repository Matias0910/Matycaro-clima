import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  minMagnitude: number;
  notificationsEnabled: boolean;
  weatherData?: {
    current?: {
      weather_code?: number;
    };
  };
  setMinMagnitude: (mag: number) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setWeatherData: (data: any) => void; // Opcional, por si guardas los datos aquí
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      minMagnitude: 4.5,
      notificationsEnabled: false,
      weatherData: undefined,
      setMinMagnitude: (mag) => set({ minMagnitude: mag }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setWeatherData: (data) => set({ weatherData: data }),
    }),
    {
      name: "weather-quake-storage", // Guarda las preferencias en el navegador
    }
  )
);