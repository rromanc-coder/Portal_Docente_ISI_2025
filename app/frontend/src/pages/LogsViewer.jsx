// app/frontend/src/pages/LogsViewer.jsx
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Search, Trash2 } from "lucide-react";

export default function LogsViewer() {
  const { containerName } = useParams();
  const [logs, setLogs] = useState("Cargando...");
  const [filter, setFilter] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const logsRef = useRef(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/logs/${containerName}?lines=500`);
      const data = await res.json();
      setLogs(data.logs || "Sin datos");
    } catch (err) {
      setLogs("❌ Error obteniendo logs");
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!autoScroll) return;

    if (logsRef.current) {
      const isAtBottom =
        logsRef.current.scrollTop + logsRef.current.clientHeight >=
        logsRef.current.scrollHeight - 5;

      if (isAtBottom) {
        logsRef.current.scrollTop = logsRef.current.scrollHeight;
      }
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs
    .split("\n")
    .filter((line) => line.toLowerCase().includes(filter.toLowerCase()));

  const highlight = (line) => {
    if (line.includes("ERROR") || line.includes("Exception"))
      return "text-red-400";
    if (line.includes("WARN") || line.includes("WARNING"))
      return "text-yellow-300";
    return "text-gray-300";
  };

  const downloadFile = () => {
    const blob = new Blob([logs], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${containerName}_logs.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-xl font-bold text-green-400">
            Logs: {containerName}
          </h1>

          <a
            href="/noc"
            className="text-gray-300 hover:text-green-400 flex items-center gap-1"
          >
            <ArrowLeft size={18} /> Volver al NOC
          </a>
        </motion.div>

        {/* 🔹 Acciones */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Buscar */}
          <div className="bg-gray-900 border border-gray-700 px-3 py-2 rounded-lg flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent outline-none text-gray-200"
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {/* Descargar */}
          <button
            onClick={downloadFile}
            className="bg-blue-900/40 px-3 py-2 rounded-lg border border-blue-700 text-blue-300 hover:bg-blue-800/40 transition"
          >
            <Download size={18} />
          </button>

          {/* Limpiar */}
          <button
            onClick={() => setLogs("")}
            className="bg-red-900/40 px-3 py-2 rounded-lg border border-red-700 text-red-300 hover:bg-red-800/40 transition"
          >
            <Trash2 size={18} />
          </button>

          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-3 py-2 rounded-lg border ${
              autoScroll
                ? "border-green-700 bg-green-900/40 text-green-300"
                : "border-gray-700 bg-gray-800 text-gray-300"
            }`}
          >
            {autoScroll ? "Auto-scroll ON" : "Auto-scroll OFF"}
          </button>
        </div>

        {/* 🔹 Área del log */}
        <div
          ref={logsRef}
          className="bg-gray-900 border border-gray-700 p-4 rounded-lg h-[70vh] overflow-y-auto font-mono text-sm"
        >
          {filteredLogs.length === 0 ? (
            <p className="text-gray-500">Sin resultados…</p>
          ) : (
            filteredLogs.map((line, i) => (
              <div key={i} className={highlight(line)}>
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
