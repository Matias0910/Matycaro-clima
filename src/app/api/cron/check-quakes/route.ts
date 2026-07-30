import { NextResponse } from "next/server";

// Función para verificar si un sismo está dentro de Argentina
function isInsideArgentina(lat: number, lng: number): boolean {
  const minLat = -55.0;
  const maxLat = -21.0;
  const minLng = -73.5;
  const maxLng = -53.0;
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
}

export async function GET(request: Request) {
  try {
    // 1. Consultar el feed público y gratuito de la USGS
    const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson");
    const data = await res.json();

    const quakes = data.features.map((item: any) => ({
      id: item.id,
      magnitude: item.properties.mag,
      place: item.properties.place,
      time: item.properties.time,
      depth: item.geometry.coordinates[2],
      lng: item.geometry.coordinates[0],
      lat: item.geometry.coordinates[1],
    }));

    // 2. Filtrar los que cumplen la regla: Magnitud >= 4.5 y ocurren en Argentina
    const argQuakes = quakes.filter((q: any) => q.magnitude >= 4.5 && isInsideArgentina(q.lat, q.lng));

    // Aquí es donde posteriormente conectarás el envío de la notificación push (Service Worker)
    return NextResponse.json({
      success: true,
      message: "Revisión de sismos completada",
      totalChecked: quakes.length,
      quakes: quakes, // Devolvemos todos los sismos
    });
  } catch (error) {
    console.error("Error en cron de sismos:", error);
    return NextResponse.json({ success: false, error: "Error al procesar sismos" }, { status: 500 });
  }
}