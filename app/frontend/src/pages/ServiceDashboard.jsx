// app/frontend/src/pages/ServiceDashboard.jsx

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Server, Globe, Clock, FileText } from "lucide-react";

const REFRESH_INTERVAL = 10000; // 10s

export default function ServiceDashboard() {
  const [equipos, setEquipos] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  // ================================================
  // 🔥 NUEVO: Obtener timestamp del contenedor real
  // ================================================
  const fetchContainerStartTime = async (containerName) => {
    try {
      const res = await fetch(`/api/monitor/container-state/${containerName}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.started_at;
    } catch {
      return null;
    }
  };

  // ================================================
  // 🔥 CALCULAR HEALTH SCORE (0–100)
  // ================================================
  const healthScore = (status, latency) => {
    let score = 0;

    if (status === "UP") score += 50;
    if (latency && latency < 800) score += 50;

    return score;
  };

  // ================================================
  // 🔥 CARGAR STATUS DE SERVICIOS
  // ================================================
  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/monitor/status");
      const data = await res.json();
      const services = data.services || [];

      const agrupados = {};

      for (let s of services) {
        const nombre = s.name.split(" ");
        const tipo = nombre[0];
        const puerto = nombre[2];

        const num = parseInt(puerto.replace(/[^\d]/g, ""));

        const esBackend = s.url.includes("900") || s.url.includes("910");

        const key = `${tipo}${num}`;

        if (!agrupados[key]) {
          agrupados[key] = {
            tipo,
            num,
            backend: null,
            frontend: null,
            lastDeploy: null,
          };
        }

        const containerName =
          tipo === "PLN"
            ? esBackend
              ? `equipo${num}_backend`
              : `equipo${num}_frontend`
            : esBackend
            ? `itm${num}_backend`
            : `itm${num}_frontend`;

        // leer inicio real del contenedor
        const startedAt = await fetchContainerStartTime(containerName);

        if (esBackend) {
          agrupados[key].backend = {
            ...s,
            container: containerName,
            deploy_time: startedAt,
            score: healthScore(s.status, s.latency_ms),
          };
        } else {
          agrupados[key].frontend = {
            ...s,
            container: containerName,
            deploy_time: startedAt,
            score: healthScore(s.status, s.latency_ms),
          };
        }
      }

      setEquipos(Object.values(agrupados));
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error obteniendo estado NOC:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const colorEstado = (status, latency) => {
    if (status === "DOWN") return "bg-red-900/30 border-red-600 text-red-300";
    if (latency && latency > 800)
      return "bg-yellow-900/30 border-yellow-600 text-yellow-300";
    if (status === "UP")
      return "bg-green-900/30 border-green-600 text-green-300";
    return "bg-gray-800/50 border-gray-600 text-gray-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-gray-900/80 border border-gray-700 rounded-xl p-4 flex flex-wrap justify-between items-center shadow-lg">
          <div className="flex items-center gap-2">
            <Activity className="text-green-400" size={24} />
            <h1 className="text-2xl font-bold text-green-400">
              Network Operations Dashboard
            </h1>
          </div>
          <div className="text-sm text-gray-300">
            Última actualización:{" "}
            <span className="text-green-400">{lastUpdated}</span>
          </div>
        </header>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipos.map((e) => (
            <motion.div
              key={`${e.tipo}${e.num}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/60 border border-gray-700 rounded-xl p-5 shadow-lg"
            >
              <h2 className="text-xl font-bold text-white mb-2">
                {e.tipo} – Equipo {e.num}
              </h2>

              {/* BACKEND */}
              {e.backend && (
                <div
                  className={`p-4 mt-2 rounded-lg border ${colorEstado(
                    e.backend.status,
                    e.backend.latency_ms
                  )}`}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">Backend</span>
                    <span>{e.backend.status}</span>
                  </div>
                  <div>Latencia: {e.backend.latency_ms || "—"} ms</div>
                  <div>
                    Último Deploy:{" "}
                    {e.backend.deploy_time
                      ? new Date(e.backend.deploy_time).toLocaleString()
                      : "—"}
                  </div>
                  <div>HealthScore: {e.backend.score}/100</div>

                  <a
                    href={`/noc/logs/${e.backend.container}`}
                    target="_blank"
                    className="flex items-center gap-2 mt-2 text-blue-400 hover:text-blue-300"
                  >
                    <FileText size={16} /> Ver Logs Backend
                  </a>
                </div>
              )}

              {/* FRONTEND */}
              {e.frontend && (
                <div
                  className={`p-4 mt-2 rounded-lg border ${colorEstado(
                    e.frontend.status,
                    e.frontend.latency_ms
                  )}`}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">Frontend</span>
                    <span>{e.frontend.status}</span>
                  </div>
                  <div>Latencia: {e.frontend.latency_ms || "—"} ms</div>
                  <div>
                    Último Deploy:{" "}
                    {e.frontend.deploy_time
                      ? new Date(e.frontend.deploy_time).toLocaleString()
                      : "—"}
                  </div>
                  <div>HealthScore: {e.frontend.score}/100</div>

                  <a
                    href={`/noc/logs/${e.frontend.container}`}
                    target="_blank"
                    className="flex items-center gap-2 mt-2 text-blue-400 hover:text-blue-300"
                  >
                    <FileText size={16} /> Ver Logs Frontend
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <footer className="text-center text-xs text-gray-600 mt-8">
          NOC Portal Docente ISI 2025 • Actualización cada{" "}
          {REFRESH_INTERVAL / 1000}s
        </footer>
      </div>
    </div>
  );
}
