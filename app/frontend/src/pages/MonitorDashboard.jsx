import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Server, Globe, AlertTriangle } from "lucide-react";

const MonitorDashboard = () => {
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/monitor/status");
        const data = await res.json();
        setServices(data.services || []);
      } catch (err) {
        console.error("Error al obtener el monitoreo:", err);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // cada 30s
    return () => clearInterval(interval);
  }, []);

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(filter.toLowerCase())
  );

  const groups = {
    PLN: filtered.filter(s => s.name.startsWith("PLN")),
    ITM: filtered.filter(s => s.name.startsWith("ITM")),
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Activity className="text-green-400" /> Monitor de Servicios
        </h1>
        <input
          type="text"
          placeholder="Buscar servicio..."
          className="w-full mb-6 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-400"
          onChange={(e) => setFilter(e.target.value)}
        />

        {Object.entries(groups).map(([group, items]) => (
          <section key={group} className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-green-400">
              {group === "PLN" ? "📘 Proyectos PLN" : "🧩 Proyectos ITM"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  className={`p-4 rounded-xl shadow-lg border 
                    ${s.status === "UP" ? "border-green-500 bg-gray-800/80" :
                      s.status === "DOWN" ? "border-red-500 bg-gray-800/40" :
                      "border-yellow-400 bg-gray-700/60"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{s.name}</h3>
                    {s.status === "UP" ? (
                      <Server className="text-green-400" />
                    ) : s.status === "DOWN" ? (
                      <AlertTriangle className="text-red-400" />
                    ) : (
                      <Globe className="text-yellow-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {s.url ? <a href={s.url} className="text-blue-400 hover:underline">{s.url}</a> : "—"}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    <a href={s.repo} className="text-purple-400 hover:underline">
                      {s.repo}
                    </a>
                  </p>
                  <div className="mt-2 text-sm">
                    <span className={`font-bold ${
                      s.status === "UP" ? "text-green-400" :
                      s.status === "DOWN" ? "text-red-400" :
                      "text-yellow-300"
                    }`}>
                      {s.status || "—"}
                    </span>
                    {s.latency_ms && (
                      <span className="ml-2 text-gray-400">
                        {s.latency_ms} ms
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default MonitorDashboard;
