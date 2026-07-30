"use client";

import React from "react";
import { Sparkles, CloudRain, Sun, Cloud } from "lucide-react";

interface AnimatedMascotProps {
  condition: string;
}

export const AnimatedMascot: React.FC<AnimatedMascotProps> = ({ condition }) => {
  const isRainy = condition === "Lluvia";
  const isSunny = condition === "Despejado";

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-slate-900/70 border border-white/10 p-4 shadow-xl backdrop-blur-2xl text-white">
      {/* Destello de fondo dinámico */}
      <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-30 ${
        isRainy ? "bg-cyan-500" : isSunny ? "bg-amber-500" : "bg-blue-500"
      }`} />

      <div className="relative z-10 flex items-center justify-between">
        
        {/* Textos descriptivos */}
        <div className="space-y-1 pr-2">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-medium text-slate-300">
            <Sparkles size={10} className={isRainy ? "text-cyan-400" : isSunny ? "text-amber-400" : "text-blue-400"} />
            <span>Asistente Activo</span>
          </div>

          <h3 className="text-xs font-bold tracking-tight text-white">
            {isRainy ? "Precaución por Lluvia" : isSunny ? "Ambiente Despejado" : "Cielo Nublado"}
          </h3>

          <p className="text-[10px] text-slate-400 leading-snug max-w-[190px]">
            {isRainy 
              ? "Se pronostican precipitaciones. Lleva paraguas si sales." 
              : isSunny 
              ? "Disfruta de un día radiante con total estabilidad." 
              : "Condiciones estables en la atmósfera local."}
          </p>
        </div>

        {/* Contenedor de la Animación SVG Integrada */}
        <div className="relative flex items-center justify-center shrink-0">
          {/* Anillo de pulso fluido */}
          <div className={`absolute w-14 h-14 rounded-full animate-ping opacity-25 ${
            isRainy ? "bg-cyan-400" : isSunny ? "bg-amber-400" : "bg-blue-400"
          }`} />

          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-950 to-slate-900 border border-white/15 flex items-center justify-center shadow-inner">
            {isRainy ? (
              <div className="animate-bounce">
                <CloudRain size={26} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              </div>
            ) : isSunny ? (
              <div className="animate-spin" style={{ animationDuration: '10s' }}>
                <Sun size={26} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              </div>
            ) : (
              <div className="animate-pulse">
                <Cloud size={26} className="text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]" />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};