"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-around bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs backdrop-blur-md">
      <Link href="/" className={`transition ${pathname === "/" ? "text-blue-400 font-bold" : "text-slate-400 hover:text-white"}`}>
        Clima
      </Link>
      <Link href="/quakes" className={`transition ${pathname === "/quakes" ? "text-blue-400 font-bold" : "text-slate-400 hover:text-white"}`}>
        Sismos
      </Link>
      <Link href="/alerts" className={`transition ${pathname === "/alerts" ? "text-blue-400 font-bold" : "text-slate-400 hover:text-white"}`}>
        Alertas
      </Link>
    </nav>
  );
}