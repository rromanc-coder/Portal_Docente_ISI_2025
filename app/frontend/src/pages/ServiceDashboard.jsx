import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Server, Globe, Clock, AlertTriangle } from "lucide-react";

const REFRESH_INTERVAL = 10000; // 10s

export default function ServiceDashboard() {
  const [equipos, setEquipos] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/monitor/status");
      const data = await res.json();
      const services = data.services || [];

      // Agrupa servicios backend/frontend por número de equipo
      const grupos = {};
      services.forEach((s) => {
        const match = s.name.match(/(PLN|ITM).*?(\d+)/);
        if (match) {
          const [_, tipo, num] = match;
          const key = `${tipo}${num}`;
          if (!grupos[key]) grupos[key] = { tipo, num, backend: null, frontend: null };
          if (s.name.toLowerCase().includes("backend")) grupos[key].backend = s;
          else grupos[key].frontend = s;
        }
      });

      const lista = Object.values(grupos).sort((a, b) => a.num - b.num);
      setEquipos(lista);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error al obtener datos:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // --- Estadísticas globales ---
  const stats = useMemo(() => {
    let up = 0, down = 0, slow = 0, total = 0;
    let plnLat = [], itmLat = [];
    equipos.forEach(e => {
      [e.backend, e.frontend].forEach(s => {
        if (!s) return;
        total++;
        if (s.status === "UP") {
          up++;
          if (s.latency_ms && s.latency_ms > 800) slow++;
        } else if (s.status === "DOWN") down++;
        if (e.tipo === "PLN" && s.latency_ms) plnLat.push(s.latency_ms);
        if (e.tipo === "ITM" && s.latency_ms) itmLat.push(s.latency_ms);
      });
    });
    const avg = arr => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1) : "—";
    return {
      up, down, slow, total,
      avgPLN: avg(plnLat),
      avgITM: avg(itmLat)
    };
  }, [equipos]);

  const colorEstado = (status, latency) => {
    if (status === "DOWN") return "bg-red-900/30 border-red-600 text-red-300";
    if (latency && latency > 800) return "bg-yellow-900/30 border-yellow-600 text-yellow-300";
    if (status === "UP") return "bg-green-900/30 border-green-600 text-green-300";
    return "bg-gray-800/50 border-gray-600 text-gray-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ======= Header tipo NOC ======= */}
        <header className="bg-gray-900/80 border border-gray-700 rounded-xl p-4 flex flex-wrap justify-between items-center shadow-lg">
          <div className="flex items-center gap-2">
            <Activity className="text-green-400" size={24} />
            <h1 className="text-2xl font-bold text-green-400">
              Network Operations Dashboard
            </h1>
          </div>
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <Clock size={16} /> Última actualización: {lastUpdated || "—"}
          </div>
        </header>

        {/* ======= Estadísticas Globales ======= */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center"
        >
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <h3 className="text-sm text-gray-300">Servicios UP</h3>
            <p className="text-3xl font-bold text-green-400">{stats.up}</p>
          </div>
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
            <h3 className="text-sm text-gray-300">Servicios DOWN</h3>
            <p className="text-3xl font-bold text-red-400">{stats.down}</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
            <h3 className="text-sm text-gray-300">Servicios Lentos</h3>
            <p className="text-3xl font-bold text-yellow-400">{stats.slow}</p>
          </div>
          <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-4">
            <h3 className="text-sm text-gray-300">Promedio Latencia</h3>
            <p className="text-lg text-green-300">
              PLN: {stats.avgPLN} ms • ITM: {stats.avgITM} ms
            </p>
          </div>
        </motion.div>

        {/* ======= Tarjetas de Equipos ======= */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {equipos.map((e, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl border border-gray-700 bg-gray-800/60 p-5 shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-xl text-green-300">
                  {e.tipo} {e.num}
                </h2>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    e.tipo === "PLN"
                      ? "bg-blue-900 text-blue-300"
                      : "bg-purple-900 text-purple-300"
                  }`}
                >
                  {e.tipo}
                </span>
              </div>

              {[e.backend, e.frontend].map((s, i) => (
                <div
                  key={i}
                  className={`mb-3 p-3 rounded-lg border ${colorEstado(
                    s?.status,
                    s?.latency_ms
                  )}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm flex items-center gap-1">
                      {s?.name?.includes("Backend") ? (
                        <>
                          <Server size={14} /> Backend
                        </>
                      ) : (
                        <>
                          <Globe size={14} /> Frontend
                        </>
                      )}
                    </span>
                    <span className="text-xs font-bold">{s?.status || "—"}</span>
                  </div>
                  <p className="text-xs truncate">
                    {s?.url && (
                      <a
                        href={s.url.replace(
                          /(http:\/\/)[^:]+/,
                          "http://10.5.20.50"
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {s.url.replace(
                          /(http:\/\/)[^:]+/,
                          "http://10.5.20.50"
                        )}
                      </a>
                    )}
                  </p>
                  <p className="text-xs truncate">
                    <a
                      href={s?.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 hover:underline"
                    >
                      {s?.repo}
                    </a>
                  </p>
                  {s?.latency_ms && (
                    <p className="text-xs text-gray-400 mt-1">
                      Latencia: {s.latency_ms} ms
                    </p>
                  )}
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* === Pie NOC === */}
        <footer className="text-center text-xs text-gray-600 mt-8">
          NOC Portal Docente ISI 2025 • Actualización cada {REFRESH_INTERVAL / 1000}s
        </footer>
      </div>
    </div>
  );
}
