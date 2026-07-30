import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  minMagnitude: number;
  notificationsEnabled: boolean;
  setMinMagnitude: (mag: number) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      minMagnitude: 4.5,
      notificationsEnabled: false,
      setMinMagnitude: (mag) => set({ minMagnitude: mag }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
    }),
    {
      name: "weather-quake-storage", // Guarda las preferencias en el navegador
    }
  )
);