// app/frontend/src/pages/EquiposDashboard.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Server, Globe, AlertTriangle, Github } from "lucide-react";

const EquiposDashboard = () => {
  const [monitorData, setMonitorData] = useState([]);
  const [filter, setFilter] = useState("");

  // 🔄 Cargar estados del backend
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/monitor/status");
        const data = await res.json();
        setMonitorData(data.services || []);
      } catch (err) {
        console.error("Error al obtener el monitoreo:", err);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // cada 60 segundos
    return () => clearInterval(interval);
  }, []);

  // 📘 Lista maestra de equipos PLN e ITM
  const equipos = [
    { id: "equipo1", grupo: "PLN", integrantes: ["Ana", "Luis", "Jorge"], backend: 9001, frontend: 9301, repo: "https://github.com/rromanc-coder/equipo1" },
    { id: "equipo2", grupo: "PLN", integrantes: ["Carla", "Iván", "Sara"], backend: 9002, frontend: 9302, repo: "https://github.com/rromanc-coder/equipo2" },
    { id: "equipo3", grupo: "PLN", integrantes: ["Mario", "David", "Fabiola"], backend: 9003, frontend: 9303, repo: "https://github.com/rromanc-coder/equipo3" },
    { id: "equipo4", grupo: "PLN", integrantes: ["Patricia", "Héctor"], backend: 9004, frontend: 9304, repo: "https://github.com/rromanc-coder/equipo4" },
    { id: "equipo5", grupo: "PLN", integrantes: ["Luz", "Rubén"], backend: 9005, frontend: 9305, repo: "https://github.com/rromanc-coder/equipo5" },
    { id: "equipo6", grupo: "PLN", integrantes: ["Daniel", "Fernando"], backend: 9006, frontend: 9306, repo: "https://github.com/rromanc-coder/equipo6" },

    { id: "itm1", grupo: "ITM", integrantes: ["Brenda", "Alberto"], backend: 9101, frontend: 9401, repo: "https://github.com/rromanc-coder/REPO_ITM1" },
    { id: "itm2", grupo: "ITM", integrantes: ["Hugo", "Paola"], backend: 9102, frontend: 9402, repo: "https://github.com/rromanc-coder/REPO_ITM2" },
    { id: "itm3", grupo: "ITM", integrantes: ["Sofía", "Carlos"], backend: 9103, frontend: 9403, repo: "https://github.com/rromanc-coder/REPO_ITM3" },
    { id: "itm4", grupo: "ITM", integrantes: ["Ernesto", "Liliana"], backend: 9104, frontend: 9404, repo: "https://github.com/rromanc-coder/REPO_ITM4" },
    { id: "itm5", grupo: "ITM", integrantes: ["Gerardo", "Claudia"], backend: 9105, frontend: 9405, repo: "https://github.com/rromanc-coder/REPO_ITM5" },
    { id: "itm6", grupo: "ITM", integrantes: ["Oscar", "Julia"], backend: 9106, frontend: 9406, repo: "https://github.com/rromanc-coder/REPO_ITM6" },
    { id: "itm7", grupo: "ITM", integrantes: ["Víctor", "Mariana"], backend: 9107, frontend: 9407, repo: "https://github.com/rromanc-coder/REPO_ITM7" },
    { id: "itm8", grupo: "ITM", integrantes: ["Ricardo", "Norma"], backend: 9108, frontend: 9408, repo: "https://github.com/rromanc-coder/REPO_ITM8" },
  ];

  // 🧠 Combinar info del monitor con la lista académica
  const equiposCombinados = equipos.map(eq => {
    const backendStatus = monitorData.find(s => s.url.includes(eq.backend)) || {};
    const frontendStatus = monitorData.find(s => s.url.includes(eq.frontend)) || {};
    return {
      ...eq,
      backendStatus: backendStatus.status || "Desconocido",
      frontendStatus: frontendStatus.status || "Desconocido",
      latency: backendStatus.latency_ms || null,
    };
  });

  const filtrados = equiposCombinados.filter(eq =>
    eq.id.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-green-400 mb-6 text-center">📊 Dashboard de Alumnos y Equipos</h1>
        <input
          type="text"
          placeholder="Buscar equipo o alumno..."
          onChange={(e) => setFilter(e.target.value)}
          className="w-full mb-8 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-400"
        />

        {["PLN", "ITM"].map(grupo => (
          <section key={grupo} className="mb-10">
            <h2 className="text-2xl font-semibold text-green-300 mb-4">{grupo === "PLN" ? "📘 Proyectos PLN" : "🧩 Proyectos ITM"}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtrados
                .filter(eq => eq.grupo === grupo)
                .map((eq, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className={`rounded-2xl p-5 shadow-lg border ${
                      eq.backendStatus === "UP" && eq.frontendStatus === "UP"
                        ? "border-green-500 bg-gray-800/80"
                        : "border-red-500 bg-gray-800/40"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-bold">{eq.id.toUpperCase()}</h3>
                      <Users className="text-green-400" />
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      <span className="font-semibold text-gray-200">Integrantes:</span> {eq.integrantes.join(", ")}
                    </p>
                    <div className="text-sm space-y-1">
                      <p><Server className="inline-block mr-2 text-green-300" /> Backend: <span className="text-white">{eq.backend}</span> — {eq.backendStatus}</p>
                      <p><Globe className="inline-block mr-2 text-blue-300" /> Frontend: <span className="text-white">{eq.frontend}</span> — {eq.frontendStatus}</p>
                      {eq.latency && <p>⚡ Latencia: {eq.latency} ms</p>}
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <a
                        href={`http://10.5.20.50:${eq.frontend}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-400 hover:underline text-sm"
                      >
                        Ver sitio
                      </a>
                      <a
                        href={eq.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-400 hover:underline flex items-center gap-1 text-sm"
                      >
                        <Github size={14} /> Repositorio
                      </a>
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

export default EquiposDashboard;
