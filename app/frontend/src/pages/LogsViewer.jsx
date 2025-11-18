// app/frontend/src/pages/LogsViewer.jsx

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Pause, Play, ChevronDown, Loader2 } from "lucide-react";

export default function LogsViewer() {
  const { containerName } = useParams();

  const [logs, setLogs] = useState("Cargando logs...");
  const [autoScroll, setAutoScroll] = useState(true);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  const logsRef = useRef(null);

  const fetchLogs = async () => {
    if (paused) return; // No refrescar si está pausado

    try {
      const res = await fetch(`/api/logs/${containerName}?lines=300`);
      const json = await res.json();
      setLogs(json.logs || "Sin datos");
      setLoading(false);
    } catch (err) {
      setLogs("Error al obtener logs.");
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000); // Auto-refresh cada 2s
    return () => clearInterval(interval);
  }, [containerName, paused]);

  // Auto-scroll al final
  useEffect(() => {
    if (autoScroll && logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Título */}
        <header className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 flex justify-between items-center shadow">
          <h2 className="text-xl font-bold text-green-400">
            Logs — {containerName}
          </h2>

          <div className="flex items-center gap-3">

            {/* Botón Pausar / Reanudar */}
            <button
              onClick={() => setPaused(!paused)}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
            >
              {paused ? (
                <>
                  <Play size={16} /> Reanudar
                </>
              ) : (
                <>
                  <Pause size={16} /> Pausar
                </>
              )}
            </button>

            {/* Ir al final */}
            <button
              onClick={() => {
                setAutoScroll(true);
                setTimeout(() => {
                  if (logsRef.current) {
                    logsRef.current.scrollTop = logsRef.current.scrollHeight;
                  }
                }, 200);
              }}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition flex items-center gap-1"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        </header>

        {/* Contenedor de logs */}
        <div
          ref={logsRef}
          className="bg-black border border-gray-700 rounded-xl p-4 h-[70vh] overflow-y-auto font-mono text-sm whitespace-pre-wrap leading-5 shadow-inner"
        >
          {loading ? (
            <div className="flex items-center gap-3 text-gray-400">
              <Loader2 size={20} className="animate-spin" />
              Cargando logs...
            </div>
          ) : (
            <pre className="text-gray-300">
              {highlightErrors(logs)}
            </pre>
          )}
        </div>

      </div>
    </div>
  );
}

// ---- Función para resaltar errores ----
function highlightErrors(text) {
  if (!text) return "";

  // Palabras clave a resaltar
  const keywords = ["ERROR", "Error", "Exception", "Traceback", "WARN", "WARNING"];

  let html = text;

  keywords.forEach((word) => {
    const regex = new RegExp(word, "g");
    html = html.replace(regex, `<span style="color:#f87171; font-weight:bold">${word}</span>`);
  });

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
