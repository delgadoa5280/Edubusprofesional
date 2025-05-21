import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Dashboard() {
  const paradas = [
    { nombre: "Terminal UANL", coords: [25.7271, -100.3113] },
    { nombre: "Estación Universidad", coords: [25.7310, -100.3090] },
    { nombre: "Av. Nogalar", coords: [25.7350, -100.3070] },
    { nombre: "Av. Manuel L. Barragán", coords: [25.7415, -100.3140] },
    { nombre: "Plaza Sendero Lincoln", coords: [25.7480, -100.3580] },
    { nombre: "Av. Lincoln / Ruiz Cortines", coords: [25.7565, -100.3750] },
    { nombre: "Preparatoria Pablo Livas Poniente", coords: [25.7650, -100.3845] }
  ];

  const [map, setMap] = useState(null);
  const [paradaActual, setParadaActual] = useState(0);
  const [pasajeros, setPasajeros] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [tiempoTotal, setTiempoTotal] = useState(0);

  useEffect(() => {
    const newMap = L.map("map").setView(paradas[0].coords, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(newMap);

    const busIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61231.png",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const marker = L.marker(paradas[0].coords, { icon: busIcon }).addTo(newMap);
    const routeLine = L.polyline([paradas[0].coords], { color: "#22c55e" }).addTo(newMap);
    setMap({ instance: newMap, marker, routeLine });

    return () => newMap.remove();
  }, []);

  useEffect(() => {
    if (!map) return;

    const avanzar = () => {
      const next = (paradaActual + 1) % paradas.length;
      const origen = paradas[paradaActual].coords;
      const destino = paradas[next].coords;

      let steps = 30;
      let delay = 100;
      let step = 0;
      let latStep = (destino[0] - origen[0]) / steps;
      let lngStep = (destino[1] - origen[1]) / steps;

      const mover = setInterval(() => {
        const newLat = origen[0] + latStep * step;
        const newLng = origen[1] + lngStep * step;
        const pos = [newLat, newLng];
        map.marker.setLatLng(pos);
        map.instance.panTo(pos);
        step++;
        if (step > steps) {
          clearInterval(mover);
          setParadaActual(next);
          setPasajeros((prev) => Math.min(prev + Math.floor(Math.random() * 5 + 1), 30));
          setHistorial((prev) => [...prev, paradas[paradaActual].nombre]);
          setTiempoTotal((prev) => prev + 4 + Math.floor(Math.random() * 3));
          map.routeLine.addLatLng(destino);
        }
      }, delay);
    };

    const timer = setTimeout(avanzar, 5000);
    return () => clearTimeout(timer);
  }, [paradaActual, map]);

  const proximaParada = paradas[(paradaActual + 1) % paradas.length].nombre;
  const horaEstimada = new Date(Date.now() + 60000 * 5).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const asientosDisponibles = 30 - pasajeros;

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="bg-green-700 text-white p-4 text-center shadow-md">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Bungee', sans-serif" }}>
          EduBus Smart PRO
        </h1>
        <p className="text-sm">Simulador de transporte escolar en tiempo real</p>
      </header>

      <div className="p-4">
        <div id="map" className="h-96 rounded-xl border-4 border-green-500 shadow-lg mb-6"></div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-100 p-4 rounded-md shadow">
            <p><strong>🚏 Parada actual:</strong> {paradas[paradaActual].nombre}</p>
            <p><strong>➡️ Próxima parada:</strong> {proximaParada}</p>
            <p><strong>🕓 Hora estimada:</strong> {horaEstimada}</p>
            <p><strong>⏳ Tiempo total:</strong> {tiempoTotal} min</p>
          </div>
          <div className="bg-green-100 p-4 rounded-md shadow">
            <p><strong>🧍‍♂️ Pasajeros a bordo:</strong> {pasajeros} / 30</p>
            <p><strong>💺 Asientos disponibles:</strong> {asientosDisponibles > 0 ? asientosDisponibles : "Ninguno"}</p>
            <p className="text-green-700 font-bold mt-2">🟢 En ruta hacia {proximaParada}</p>
          </div>
        </div>

        <div className="mt-6 bg-white border border-green-300 p-4 rounded-md">
          <h3 className="text-green-800 font-semibold mb-2">📜 Historial de paradas:</h3>
          <ul className="list-disc list-inside text-sm">
            {historial.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
