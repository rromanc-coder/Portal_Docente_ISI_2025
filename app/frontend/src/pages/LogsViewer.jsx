import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCcw, Terminal, Clock } from "lucide-react";

const REFRESH_INTERVAL = 5000; // 5s

export default function LogsViewer() {
  const { containerName } = useParams();
  const [logs, setLogs] = useState("");
  const [lines, setLines] = useState(300);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/logs/${containerName}?lines=${lines}`);
      const data = await res.json();
      setLogs(data.logs || "Sin datos");
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      setLogs("⚠ Error al obtener logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [containerName, lines]);

  const lineOptions = [100, 200, 300, 500, 1000, 2000];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center border border-gray-700 bg-gray-900/60 p-4 rounded-xl shadow-md"
        >
          <div className="flex items-center gap-3">
            <Terminal size={28} className="text-green-400" />
            <h1 className="text-2xl font-bold">
              Logs de <span className="text-green-300">{containerName}</span>
            </h1>
          </div>
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <Clock size={14} />
            Última actualización: {lastUpdated || "—"}
          </div>
        </motion.div>

        {/* Settings */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <label className="text-gray-300 text-sm">Líneas:</label>
            <select
              value={lines}
              onChange={(e) => setLines(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 p-2 rounded-lg text-sm"
            >
              {lineOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <button
              onClick={fetchLogs}
              className="flex items-center gap-2 bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
              Refrescar
            </button>
          </div>

          <a
            href="/noc"
            className="text-sm text-blue-400 hover:underline"
          >
            ⬅ Regresar al NOC
          </a>
        </div>

        {/* Logs Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-black border border-green-700 rounded-xl p-4 shadow-inner"
          style={{ height: "70vh", overflowY: "auto" }}
        >
          <pre className="whitespace-pre-wrap font-mono text-sm text-green-300">
            {logs || "Cargando logs..."}
          </pre>
        </motion.div>

      </div>
    </div>
  );
}
