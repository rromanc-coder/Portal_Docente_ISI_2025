import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Server, Globe, Github } from "lucide-react";

const EquiposDashboard = () => {
  const [equipos, setEquipos] = useState([]);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/monitor/status");
      const data = await res.json();

      const grupos = {};

      data.services.forEach((s) => {
        // Extraer tipo (PLN o ITM)
        const tipoMatch = s.name.match(/(PLN|ITM)/i);
        const tipo = tipoMatch ? tipoMatch[1].toUpperCase() : "OTRO";

        // Extraer número de puerto final (9001 -> 1, 9103 -> 3, etc.)
        const portMatch = s.url.match(/(\d{4})/);
        let numero = 0;
        if (portMatch) {
          const port = parseInt(portMatch[1]);
          numero = port % 100; // Ej. 9001 → 1, 9108 → 8
        }

        const key = `${tipo}${numero}`;
        if (!grupos[key]) grupos[key] = { tipo, numero, servicios: [] };
        grupos[key].servicios.push(s);
      });

      // Ordenar por número
      const lista = Object.values(grupos).sort(
        (a, b) => a.tipo.localeCompare(b.tipo) || a.numero - b.numero
      );
      setEquipos(lista);
    } catch (err) {
      console.error("Error al obtener datos:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-green-400">
          <Activity className="text-green-400" /> NOC Técnico – ISI 2025
        </h1>

        {equipos.length === 0 ? (
          <p className="text-gray-400 text-center">Cargando información...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipos.map((e, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="p-5 rounded-xl border border-gray-700 bg-gray-800/60 hover:shadow-lg transition-shadow"
              >
                {/* Encabezado del equipo */}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-xl">
                    {e.tipo} {e.numero}
                  </h2>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      e.tipo === "PLN"
                        ? "bg-blue-900 text-blue-300"
                        : "bg-purple-900 text-purple-300"
                    }`}
                  >
                    {e.tipo}
                  </span>
                </div>

                {/* Secciones Backend / Frontend */}
                <div className="grid grid-cols-1 gap-2">
                  {["Backend", "Frontend"].map((rol, i) => {
                    const s = e.servicios.find((x) =>
                      x.name.toLowerCase().includes(rol.toLowerCase())
                    );
                    if (!s) return null;
                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${
                          s.status === "UP"
                            ? "border-green-500 bg-green-900/10"
                            : "border-red-500 bg-red-900/20"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-medium text-sm flex items-center gap-1">
                            {rol === "Backend" ? (
                              <Server className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Globe className="w-4 h-4 text-gray-400" />
                            )}
                            {rol}
                          </p>
                          <span
                            className={`text-xs font-bold ${
                              s.status === "UP"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {s.status}
                          </span>
                        </div>

                        {/* URLs */}
                        <p className="text-xs text-gray-400 truncate">
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            {s.url}
                          </a>
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          <a
                            href={s.repo}
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <Github className="w-3 h-3" /> Repositorio
                          </a>
                        </p>

                        {s.latency_ms && (
                          <p
                            className={`text-xs mt-1 ${
                              s.latency_ms < 150
                                ? "text-green-400"
                                : s.latency_ms < 400
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            ⏱️ Latencia: {s.latency_ms} ms
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquiposDashboard;
