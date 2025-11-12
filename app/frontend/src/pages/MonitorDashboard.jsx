import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Server, Globe, AlertTriangle, CheckCircle } from "lucide-react";

const MonitorDashboard = () => {
  const [equipos, setEquipos] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/monitor/status");
      const data = await res.json();

      // Agrupar servicios Backend/Frontend por número de equipo
      const grupos = {};
      data.services.forEach((s) => {
        const match = s.name.match(/(PLN|ITM).*?(\d+)/);
        if (match) {
          const [_, tipo, numero] = match;
          const key = `${tipo}${numero}`;
          if (!grupos[key]) grupos[key] = { tipo, numero, servicios: [] };
          grupos[key].servicios.push(s);
        }
      });

      setEquipos(Object.values(grupos).sort((a, b) => a.numero - b.numero));
    } catch (err) {
      console.error("Error al obtener el monitoreo:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // cada 30s
    return () => clearInterval(interval);
  }, []);

  // Filtrar por texto (PLN1, ITM5, etc.)
  const filtered = equipos.filter(
    (e) =>
      e.tipo.toLowerCase().includes(filter.toLowerCase()) ||
      e.numero.toString().includes(filter)
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2 text-green-400">
          <Activity className="text-green-400" /> Monitor General de Equipos
        </h1>

        <input
          type="text"
          placeholder="Buscar equipo (ej. PLN3 o ITM5)..."
          className="w-full mb-6 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-400"
          onChange={(e) => setFilter(e.target.value)}
        />

        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center">Cargando información...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e, idx) => {
              const backend = e.servicios.find((s) =>
                s.name.toLowerCase().includes("backend")
              );
              const frontend = e.servicios.find((s) =>
                s.name.toLowerCase().includes("frontend")
              );

              const allUp =
                backend?.status === "UP" && frontend?.status === "UP";
              const anyDown =
                backend?.status === "DOWN" || frontend?.status === "DOWN";

              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`p-5 rounded-xl border shadow-md ${
                    allUp
                      ? "border-green-500 bg-green-900/10"
                      : anyDown
                      ? "border-red-500 bg-red-900/20"
                      : "border-yellow-400 bg-yellow-900/10"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-xl">
                      {e.tipo} {e.numero}
                    </h2>
                    {allUp ? (
                      <CheckCircle className="text-green-400" />
                    ) : anyDown ? (
                      <AlertTriangle className="text-red-400" />
                    ) : (
                      <Globe className="text-yellow-400" />
                    )}
                  </div>

                  {/* Backend */}
                  {backend && (
                    <div className="text-sm mb-1">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1 text-gray-300">
                          <Server className="w-4 h-4" /> Backend
                        </span>
                        <span
                          className={`font-bold ${
                            backend.status === "UP"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {backend.status}
                        </span>
                      </div>
                      {backend.latency_ms && (
                        <p className="text-xs text-gray-500">
                          ⏱️ {backend.latency_ms} ms
                        </p>
                      )}
                    </div>
                  )}

                  {/* Frontend */}
                  {frontend && (
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1 text-gray-300">
                          <Globe className="w-4 h-4" /> Frontend
                        </span>
                        <span
                          className={`font-bold ${
                            frontend.status === "UP"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {frontend.status}
                        </span>
                      </div>
                      {frontend.latency_ms && (
                        <p className="text-xs text-gray-500">
                          ⏱️ {frontend.latency_ms} ms
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-3 flex justify-between text-xs text-gray-400">
                    <span>
                      {e.tipo === "PLN" ? "📘 Proyecto PLN" : "🧩 Proyecto ITM"}
                    </span>
                    <span>
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitorDashboard;
