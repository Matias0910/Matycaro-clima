"use client";

import "./WeatherScene.css";
import React, { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";

interface WeatherSceneProps {
  weather: "sunny" | "rain" | "night" | "storm" | "snow";
}

/**
 * Escenas animadas interactivas según el clima.
 * Cada escena muestra personajes/objetos animados con SVG y CSS puro.
 */
export default function WeatherScene({ weather }: WeatherSceneProps) {
  return (
    <div className="weather-scene" aria-label={`Escena de clima: ${weather}`}>
      {weather === "rain" && <RainScene />}
      {weather === "sunny" && <SunnyScene />}
      {weather === "night" && <NightScene />}
      {weather === "storm" && <StormScene />}
      {weather === "snow" && <SnowScene />}
    </div>
  );
}

/* ---------- helpers: valores pseudo-aleatorios estables ---------- */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function round(num: number, precision: number = 4): number {
  return parseFloat(num.toFixed(precision));
}

function useDropStyles(count: number, opts?: { speedRange?: [number, number]; delayRange?: [number, number] }) {
  const [minSpeed, maxSpeed] = opts?.speedRange ?? [0.4, 1.0];
  const [minDelay, maxDelay] = opts?.delayRange ?? [0, 3];
  return useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      left: `${seededRandom(i * 3) * 100}%`,
      animationDelay: `${round(seededRandom(i * 7 + 1) * (maxDelay - minDelay) + minDelay)}s`,
      animationDuration: `${round(seededRandom(i * 5 + 2) * (maxSpeed - minSpeed) + minSpeed)}s`,
    })),
  [count, minSpeed, maxSpeed, minDelay, maxDelay]);
}

function useSnowflakeStyles(count: number) {
  return useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      left: `${seededRandom(i * 7) * 100}%`,
      fontSize: `${round(8 + seededRandom(i * 13 + 3) * 14)}px`,
      animationDelay: `${round(seededRandom(i * 11 + 5) * 6)}s`,
      animationDuration: `${round(4 + seededRandom(i * 17 + 7) * 6)}s`,
      opacity: round(0.5 + seededRandom(i * 19 + 9) * 0.5),
    })),
  [count]);
}

function useStarStyles(count: number) {
  return useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      top: `${round(seededRandom(i * 23) * 70)}%`,
      left: `${round(seededRandom(i * 29 + 3) * 100)}%`,
      animationDelay: `${round(seededRandom(i * 31 + 7) * 4)}s`,
      animationDuration: `${round(2 + seededRandom(i * 37 + 11) * 3)}s`,
    })),
  [count]);
}

// 1. ESCENA DE LLUVIA
// ----------------------------------------------------
export function RainScene() {
  const { weatherData } = useAppStore();
  const isStorm = (weatherData?.current?.weather_code ?? 0) >= 95;

  const currentHour = new Date().getHours();
  const isDayTime = currentHour >= 6 && currentHour <= 20;
  const dropStyles = useDropStyles(isStorm ? 60 : 40, { speedRange: [0.3, 0.9], delayRange: [0, 4] });

  return (
    <div className={`scene ${isDayTime ? 'scene-rain-day' : 'scene-rain-night'}`}>
      {/* Nubes de lluvia animadas */}
      <div className="rain-clouds">
        {[
          { class: 'r-cloud-1', w: 250, h: 100 },
          { class: 'r-cloud-2', w: 180, h: 80 },
          { class: 'r-cloud-3', w: 220, h: 90 },
          { class: 'r-cloud-4', w: 150, h: 70 },
        ].map((c) => (
          <div key={c.class} className={`rain-cloud ${c.class}`}>
            <svg viewBox="0 0 200 80" width={c.w} height={c.h}>
              <ellipse cx="50" cy="50" rx="45" ry="25" fill={isDayTime ? '#94a3b8' : '#334155'} />
              <ellipse cx="100" cy="40" rx="55" ry="35" fill={isDayTime ? '#94a3b8' : '#334155'} />
              <ellipse cx="150" cy="50" rx="40" ry="20" fill={isDayTime ? '#94a3b8' : '#334155'} />
              <ellipse cx="80" cy="55" rx="60" ry="28" fill={isDayTime ? '#a1aab8' : '#475569'} />
            </svg>
          </div>
        ))}
      </div>

      {isStorm && (
        <div className="lightning-bolts">
          <div className="bolt bolt-1" />
          <div className="bolt bolt-2" />
        </div>
      )}

      <div className="rain-drops">
        {dropStyles.map((s, i) => <div key={i} className="rain-drop" style={s} />)}
      </div>

      <div className="character umbrella-person">
        <svg viewBox="0 0 120 140" className="umbrella-svg" width="90" height="110">
          <line x1="60" y1="55" x2="60" y2="130" stroke="#6b4226" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 130 Q60 140 52 140" stroke="#6b4226" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M20 60 Q35 15 60 15 Q85 15 100 60" fill="#e74c3c" stroke="#c0392b" strokeWidth="2" />
          <line x1="60" y1="15" x2="60" y2="60" stroke="#c0392b" strokeWidth="1.5" />
          <circle cx="60" cy="14" r="2.5" fill="#c0392b" />
        </svg>

        <div className="person-walking">
          <div className="legs">
            <div className="leg leg-left" />
            <div className="leg leg-right" />
          </div>
          <div className="boots">
            <div className="boot boot-left" />
            <div className="boot boot-right" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== ESCENA SOLEADA ==================== */
function SunnyScene() {
  const { weatherData } = useAppStore();
  const weatherCode = weatherData?.current?.weather_code ?? 0;
  const currentHour = new Date().getHours();
  const isDayTimeAndSunny = currentHour >= 6 && currentHour < 21 && weatherCode <= 2;

  return (
    <div className="scene scene-sunny">
      {isDayTimeAndSunny && (
        <div className="sun-character">
          <svg viewBox="0 0 160 160" width="160" height="160">
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={round(80 + Math.cos(angle) * 35)}
                  y1={round(80 + Math.sin(angle) * 35)}
                  x2={round(80 + Math.cos(angle) * 55)}
                  y2={round(80 + Math.sin(angle) * 55)}
                  stroke="#fbbf24"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="sun-ray-line"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              );
            })}
            <circle cx="80" cy="80" r="30" fill="#fbbf24" stroke="#f59e0b" strokeWidth="3" />
            <circle cx="70" cy="75" r="4" fill="#92400e" />
            <circle cx="90" cy="75" r="4" fill="#92400e" />
            <circle cx="71" cy="74" r="1.5" fill="white" />
            <circle cx="91" cy="74" r="1.5" fill="white" />
            <path d="M68 88 Q80 100 92 88" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="62" cy="85" r="5" fill="#fcd34d" opacity="0.6" />
            <circle cx="98" cy="85" r="5" fill="#fcd34d" opacity="0.6" />
          </svg>
        </div>
      )}

      <div className="clouds">
        {[
          { class: "cloud-1", w: 80, h: 40 },
          { class: "cloud-2", w: 60, h: 30 },
          { class: "cloud-3", w: 70, h: 35 },
        ].map((c) => (
          <div key={c.class} className={`fluffy-cloud ${c.class}`}>
            <svg viewBox="0 0 100 50" width={c.w} height={c.h}>
              <ellipse cx="35" cy="30" rx="25" ry="15" fill="white" opacity="0.85" />
              <ellipse cx="60" cy="25" rx="30" ry="18" fill="white" opacity="0.85" />
              <ellipse cx="50" cy="30" rx="35" ry="16" fill="white" opacity="0.9" />
            </svg>
          </div>
        ))}
      </div>

      <div className="birds">
        <svg viewBox="0 0 40 20" width="30" height="15" className="bird bird-1">
          <path d="M5 15 Q15 2 20 10 Q25 2 35 15" stroke="#475569" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 40 20" width="24" height="12" className="bird bird-2">
          <path d="M5 15 Q15 2 20 10 Q25 2 35 15" stroke="#475569" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/* ==================== ESCENA DE NOCHE ==================== */
function NightScene() {
  const starStyles = useStarStyles(25);
  return (
    <div className="scene scene-night">
      <div className="stars-field">
        {starStyles.map((s, i) => (
          <div key={i} className="star-twinkle" style={s} />
        ))}
      </div>

      <div className="moon-character">
        <svg viewBox="0 0 120 120" width="100" height="100">
          <circle cx="55" cy="55" r="40" fill="#fde68a" />
          <circle cx="70" cy="45" r="32" fill="#0f172a" />
          <path d="M38 50 Q42 42 46 50" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M42 65 Q48 72 54 65" stroke="#92400e" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      <div className="night-clouds">
        <div className="night-cloud nc-1">
          <svg viewBox="0 0 120 40" width="100" height="35">
            <ellipse cx="30" cy="25" rx="20" ry="12" fill="#334155" opacity="0.4" />
            <ellipse cx="60" cy="20" rx="30" ry="15" fill="#334155" opacity="0.4" />
            <ellipse cx="50" cy="25" rx="35" ry="14" fill="#334155" opacity="0.45" />
          </svg>
        </div>
        <div className="night-cloud nc-2">
          <svg viewBox="0 0 120 40" width="80" height="30">
            <ellipse cx="25" cy="22" rx="18" ry="10" fill="#334155" opacity="0.3" />
            <ellipse cx="55" cy="18" rx="25" ry="13" fill="#334155" opacity="0.3" />
            <ellipse cx="45" cy="22" rx="30" ry="12" fill="#334155" opacity="0.35" />
          </svg>
        </div>
      </div>

      <div className="owl-character">
        <svg viewBox="0 0 80 90" width="70" height="80">
          <line x1="0" y1="78" x2="80" y2="75" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="40" cy="58" rx="20" ry="22" fill="#7c3aed" />
          <ellipse cx="40" cy="62" rx="12" ry="14" fill="#c4b5fd" />
          <circle cx="40" cy="32" r="18" fill="#7c3aed" />
          <polygon points="25,20 22,5 32,16" fill="#7c3aed" />
          <polygon points="55,20 58,5 48,16" fill="#7c3aed" />
          <circle cx="33" cy="30" r="8" fill="white" />
          <circle cx="47" cy="30" r="8" fill="white" />
          <circle cx="33" cy="30" r="4" fill="#1e1b4b" />
          <circle cx="47" cy="30" r="4" fill="#1e1b4b" />
          <circle cx="35" cy="28" r="1.5" fill="white" />
          <circle cx="49" cy="28" r="1.5" fill="white" />
          <polygon points="37,36 43,36 40,42" fill="#fbbf24" />
          <line x1="32" y1="76" x2="30" y2="82" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="76" x2="36" y2="82" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="44" y1="76" x2="44" y2="82" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="48" y1="76" x2="50" y2="82" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/* ==================== ESCENA DE NIEVE ==================== */
function SnowScene() {
  const flakeStyles = useSnowflakeStyles(35);
  return (
    <div className="scene scene-snow">
      <div className="snowflakes">
        {flakeStyles.map((s, i) => (
          <div key={i} className="snowflake" style={s}>
            ❄
          </div>
        ))}
      </div>

      <div className="snow-ground">
        <svg viewBox="0 0 400 60" preserveAspectRatio="none" width="100%" height="50">
          <path d="M0 40 Q30 20 80 35 Q130 10 180 30 Q230 15 280 32 Q330 8 400 35 L400 60 L0 60 Z" fill="white" opacity="0.9" />
          <path d="M0 50 Q50 35 100 45 Q160 30 220 44 Q280 28 340 42 Q370 30 400 45 L400 60 L0 60 Z" fill="#f1f5f9" opacity="0.7" />
        </svg>
      </div>

      <div className="snowman-character">
        <svg viewBox="0 0 100 140" width="80" height="112">
          <circle cx="50" cy="105" r="28" fill="white" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="50" cy="70" r="22" fill="white" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="50" cy="42" r="16" fill="white" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="38" y="22" width="24" height="5" rx="1" fill="#1e293b" />
          <rect x="42" y="4" width="16" height="20" rx="2" fill="#1e293b" />
          <circle cx="45" cy="40" r="2.5" fill="#1e293b" />
          <circle cx="55" cy="40" r="2.5" fill="#1e293b" />
          <polygon points="50,44 62,47 50,48" fill="#f97316" />
          <circle cx="42" cy="50" r="1.5" fill="#1e293b" />
          <circle cx="48" cy="53" r="1.5" fill="#1e293b" />
          <circle cx="54" cy="53" r="1.5" fill="#1e293b" />
          <circle cx="58" cy="50" r="1.5" fill="#1e293b" />
          <circle cx="50" cy="66" r="2" fill="#1e293b" />
          <circle cx="50" cy="78" r="2" fill="#1e293b" />
          <path d="M34 58 Q50 65 66 58" stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M52 60 L55 78" stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" />
          <line x1="28" y1="68" x2="8" y2="55" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          <line x1="72" y1="68" x2="92" y2="55" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          <line x1="8" y1="55" x2="2" y2="48" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="55" x2="8" y2="46" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <line x1="92" y1="55" x2="98" y2="48" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <line x1="92" y1="55" x2="92" y2="46" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="snowy-tree">
        <svg viewBox="0 0 80 120" width="70" height="105">
          <rect x="32" y="85" width="16" height="30" fill="#78350f" rx="2" />
          <polygon points="40,10 10,60 70,60" fill="#15803d" />
          <polygon points="40,30 15,75 65,75" fill="#166534" />
          <path d="M40 10 Q30 15 20 40 Q28 30 40 25 Q52 30 60 40 Q50 15 40 10 Z" fill="white" opacity="0.8" />
          <path d="M40 30 Q25 35 18 60 Q30 48 40 42 Q50 48 62 60 Q55 35 40 30 Z" fill="white" opacity="0.7" />
        </svg>
      </div>
    </div>
  );
}

/* Sub-componente de Tormenta para completar el switch */
function StormScene() {
  return <RainScene />;
}