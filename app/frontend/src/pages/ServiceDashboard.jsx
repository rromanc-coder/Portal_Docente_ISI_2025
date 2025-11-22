// app/frontend/src/pages/ServiceDashboard.jsx
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Server, Globe, Clock } from "lucide-react";

const REFRESH_INTERVAL = 10000; // 10s

export default function ServiceDashboard() {
  const [equipos, setEquipos] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [deployMap, setDeployMap] = useState({}); // 🔥 nuevo: mapa contenedor -> started_at

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/monitor/status");
      const data = await res.json();
      const services = data.services || [];

      const grupos = {};

      services.forEach((s) => {
        if (!s.url) return;

        const portMatch = s.url.match(/:(\d+)\//);
        if (!portMatch) return;

        const port = parseInt(portMatch[1], 10);

        let tipo = "OTRO";
        if (s.name.startsWith("PLN")) tipo = "PLN";
        else if (s.name.startsWith("ITM")) tipo = "ITM";

        let num = null;

        if (tipo === "PLN") {
          if (port >= 9001 && port <= 9006) num = port - 9000;
          if (port >= 9301 && port <= 9306) num = port - 9300;
        } else if (tipo === "ITM") {
          if (port >= 9101 && port <= 9108) num = port - 9100;
          if (port >= 9401 && port <= 9408) num = port - 9400;
        }

        if (num === null) return;

        const key = `${tipo}${num}`;
        if (!grupos[key]) {
          grupos[key] = { tipo, num, backend: null, frontend: null };
        }

        if (s.name.toLowerCase().includes("backend")) {
          grupos[key].backend = s;
        } else if (s.name.toLowerCase().includes("frontend")) {
          grupos[key].frontend = s;
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

  const stats = useMemo(() => {
    let up = 0,
      down = 0,
      slow = 0,
      total = 0;
    let plnLat = [],
      itmLat = [];

    equipos.forEach((e) => {
      [e.backend, e.frontend].forEach((s) => {
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

    const avg = (arr) =>
      arr.length
        ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)
        : "—";

    return {
      up,
      down,
      slow,
      total,
      avgPLN: avg(plnLat),
      avgITM: avg(itmLat),
    };
  }, [equipos]);

  const colorEstado = (status, latency) => {
    if (status === "DOWN")
      return "bg-red-900/30 border-red-600 text-red-300";
    if (latency && latency > 800)
      return "bg-yellow-900/30 border-yellow-600 text-yellow-300";
    if (status === "UP")
      return "bg-green-900/30 border-green-600 text-green-300";
    return "bg-gray-800/50 border-gray-600 text-gray-400";
  };

  // 🔥 nuevo: cálculo de HealthScore
  const healthScore = (status, latency) => {
    let score = 0;
    if (status === "UP") score += 60;
    if (latency != null && latency < 800) score += 40;
    return score;
  };

  // ======================================================
  // Nombre real del contenedor Docker
  // ======================================================
  const nombreContenedor = (tipo, num, esBackend) => {
    if (tipo === "PLN") {
      return esBackend
        ? `equipo${num}_backend`
        : `equipo${num}_frontend`;
    }
    if (tipo === "ITM") {
      return esBackend
        ? `itm${num}_backend`
        : `itm${num}_frontend`;
    }
    return "desconocido";
  };

  // 🔥 nuevo: cargar started_at de cada contenedor cuando cambian equipos
  useEffect(() => {
    const cargarDeploys = async () => {
      const nuevos = {};

      for (const e of equipos) {
        for (const s of [e.backend, e.frontend]) {
          if (!s || !s.name) continue;
          const esBackend = s.name.toLowerCase().includes("backend");
          const cont = nombreContenedor(e.tipo, e.num, esBackend);
          if (!cont || deployMap[cont]) continue;

          try {
            const res = await fetch(
              `/api/monitor/container-state/${cont}`
            );
            if (!res.ok) continue;
            const data = await res.json();
            if (data.started_at) {
              nuevos[cont] = data.started_at;
            }
          } catch (err) {
            // silencioso para no romper el dashboard
            console.error("Error leyendo container-state:", err);
          }
        }
      }

      if (Object.keys(nuevos).length > 0) {
        setDeployMap((prev) => ({ ...prev, ...nuevos }));
      }
    };

    if (equipos.length > 0) {
      cargarDeploys();
    }
  }, [equipos, deployMap]);

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
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <Clock size={16} /> Última actualización:{" "}
            {lastUpdated || "—"}
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center"
        >
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <h3 className="text-sm text-gray-300">Servicios UP</h3>
            <p className="text-3xl font-bold text-green-400">
              {stats.up}
            </p>
          </div>
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
            <h3 className="text-sm text-gray-300">Servicios DOWN</h3>
            <p className="text-3xl font-bold text-red-400">
              {stats.down}
            </p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
            <h3 className="text-sm text-gray-300">Servicios Lentos</h3>
            <p className="text-3xl font-bold text-yellow-400">
              {stats.slow}
            </p>
          </div>
          <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-4">
            <h3 className="text-sm text-gray-300">Promedio Latencia</h3>
            <p className="text-lg text-green-300">
              PLN: {stats.avgPLN} ms • ITM: {stats.avgITM} ms
            </p>
          </div>
        </motion.div>

        {/* Tarjetas */}
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

              {[e.backend, e.frontend].map((s, i) => {
                const esBackend = s?.name
                  ?.toLowerCase()
                  .includes("backend");
                const contenedor = nombreContenedor(
                  e.tipo,
                  e.num,
                  esBackend
                );
                const startedAt = deployMap[contenedor] || null;
                const score = healthScore(s?.status, s?.latency_ms);

                return (
                  <div
                    key={i}
                    className={`mb-3 p-3 rounded-lg border ${colorEstado(
                      s?.status,
                      s?.latency_ms
                    )}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm flex items-center gap-1">
                        {esBackend ? (
                          <>
                            <Server size={14} /> Backend
                          </>
                        ) : (
                          <>
                            <Globe size={14} /> Frontend
                          </>
                        )}
                      </span>
                      <span className="text-xs font-bold">
                        {s?.status || "—"}
                      </span>
                    </div>

                    {/* URL */}
                    {s?.url && (
                      <p className="text-xs truncate">
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
                      </p>
                    )}

                    {/* Repo */}
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

                    {/* Latencia */}
                    {s?.latency_ms && (
                      <p className="text-xs text-gray-400 mt-1">
                        Latencia: {s.latency_ms} ms
                      </p>
                    )}

                    {/* Último deploy */}
                    <p className="text-xs text-gray-400">
                      Último deploy:{" "}
                      {startedAt
                        ? new Date(startedAt).toLocaleString()
                        : "—"}
                    </p>

                    {/* HealthScore */}
                    <p className="text-xs text-green-300">
                      HealthScore: {score}/100
                    </p>

                    {/* Botón Ver Logs */}
                    <a
                      href={`/noc/logs/${contenedor}`}
                      className="text-xs text-blue-400 hover:underline mt-2 block"
                    >
                      Ver logs →
                    </a>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>

        <footer className="text-center text-xs text-gray-600 mt-8">
          NOC Portal Docente ISI 2025 • Actualización cada{" "}
          {REFRESH_INTERVAL / 1000}
          s
        </footer>
      </div>
    </div>
  );
}
