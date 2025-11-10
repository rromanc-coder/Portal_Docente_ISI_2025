import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Server, Users, Github, Network, Activity } from "lucide-react";

const EquiposDashboard = () => {
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    // Simulamos datos (podrías reemplazarlo por una llamada a tu backend)
    setEquipos([
      // ==== PROYECTOS PLN ====
      {
        id: 1,
        nombre: "Equipo 1",
        tipo: "PLN",
        backend: "9001",
        frontend: "9301",
        estado: "UP",
        repo: "https://github.com/rromanc-coder/equipo1",
        responsables: ["María López", "Carlos Pérez"],
      },
      {
        id: 2,
        nombre: "Equipo 2",
        tipo: "PLN",
        backend: "9002",
        frontend: "9302",
        estado: "DOWN",
        repo: "https://github.com/rromanc-coder/equipo2",
        responsables: ["Luis Hernández", "Ana Torres"],
      },
      {
        id: 3,
        nombre: "Equipo 3",
        tipo: "PLN",
        backend: "9003",
        frontend: "9303",
        estado: "UP",
        repo: "https://github.com/rromanc-coder/equipo3",
        responsables: ["Roberto Díaz", "Valeria Gómez"],
      },
      {
        id: 4,
        nombre: "Equipo 4",
        tipo: "PLN",
        backend: "9004",
        frontend: "9304",
        estado: "UP",
        repo: "https://github.com/rromanc-coder/equipo4",
        responsables: ["Emilia Rivera", "Daniel Soto"],
      },
      {
        id: 5,
        nombre: "Equipo 5",
        tipo: "PLN",
        backend: "9005",
        frontend: "9305",
        estado: "DOWN",
        repo: "https://github.com/rromanc-coder/equipo5",
        responsables: ["Ricardo Sánchez", "Fernanda Pineda"],
      },
      {
        id: 6,
        nombre: "Equipo 6",
        tipo: "PLN",
        backend: "9006",
        frontend: "9306",
        estado: "UP",
        repo: "https://github.com/rromanc-coder/equipo6",
        responsables: ["Alejandro Mora", "Sofía Cruz"],
      },
      // ==== PROYECTOS ITM ====
      {
        id: 7,
        nombre: "ITM 1",
        tipo: "ITM",
        backend: "9101",
        frontend: "9401",
        estado: "UP",
        repo: "https://github.com/rromanc-coder/REPO_ITM1",
        responsables: ["Andrés Castillo", "Lucía Vega"],
      },
      {
        id: 8,
        nombre: "ITM 2",
        tipo: "ITM",
        backend: "9102",
        frontend: "9402",
        estado: "DOWN",
        repo: "https://github.com/rromanc-coder/REPO_ITM2",
        responsables: ["Santiago Ruiz", "Clara Ramos"],
      },
      {
        id: 9,
        nombre: "ITM 3",
        tipo: "ITM",
        backend: "9103",
        frontend: "9403",
        estado: "UP",
        repo: "https://github.com/rromanc-coder/REPO_ITM3",
        responsables: ["Valentín Flores", "Ximena Lara"],
      },
      {
        id: 10,
        nombre: "ITM 4",
        tipo: "ITM",
        backend: "9104",
        frontend: "9404",
        estado: "DOWN",
        repo: "https://github.com/rromanc-coder/REPO_ITM4",
        responsables: ["Rodrigo Paredes", "Carla Medina"],
      },
      {
        id: 11,
        nombre: "ITM 5",
        tipo: "ITM",
        backend: "9105",
        frontend: "9405",
        estado: "UP",
        repo: "https://github.com/rromanc-coder/REPO_ITM5",
        responsables: ["Mateo León", "Julieta Vázquez"],
      },
      {
        id: 12,
        nombre: "ITM 6",
        tipo: "ITM",
        backend: "9106",
        frontend: "9406",
        estado: "DOWN",
        repo: "https://github.com/rromanc-coder/REPO_ITM6",
        responsables: ["Diana Ríos", "Jorge Morales"],
      },
      {
        id: 13,
        nombre: "ITM 7",
        tipo: "ITM",
        backend: "9107",
        frontend: "9407",
        estado: "UP",
        repo: "https://github.com/rromanc-coder/REPO_ITM7",
        responsables: ["Jimena Ortega", "Felipe Neri"],
      },
      {
        id: 14,
        nombre: "ITM 8",
        tipo: "ITM",
        backend: "9108",
        frontend: "9408",
        estado: "DOWN",
        repo: "https://github.com/rromanc-coder/REPO_ITM8",
        responsables: ["César Luna", "Paula Cabrera"],
      },
    ]);
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-green-400">
          <Users className="text-green-400" /> Dashboard de Alumnos / Equipos
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {equipos.map((e, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              whileHover={{ scale: 1.03 }}
              className={`rounded-xl p-5 border shadow-lg hover:shadow-2xl backdrop-blur-md ${
                e.estado === "UP"
                  ? "border-green-500 bg-gray-800/60"
                  : "border-red-500 bg-gray-800/40"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">{e.nombre}</h2>
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    e.tipo === "PLN"
                      ? "bg-blue-900 text-blue-300"
                      : "bg-purple-900 text-purple-300"
                  }`}
                >
                  {e.tipo}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-gray-300">
                  <Server size={16} /> Backend:{" "}
                  <span className="text-white font-semibold">
                    {`http://10.5.20.50:${e.backend}`}
                  </span>
                </p>
                <p className="flex items-center gap-2 text-gray-300">
                  <Network size={16} /> Frontend:{" "}
                  <span className="text-white font-semibold">
                    {`http://10.5.20.50:${e.frontend}`}
                  </span>
                </p>
                <p className="flex items-center gap-2 text-gray-300">
                  <Github size={16} />{" "}
                  <a
                    href={e.repo}
                    target="_blank"
                    className="text-purple-400 hover:underline truncate"
                  >
                    {e.repo}
                  </a>
                </p>
                <p className="flex items-center gap-2 text-gray-300">
                  <Users size={16} />{" "}
                  {e.responsables.join(", ")}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={18} />
                  <span
                    className={`font-bold ${
                      e.estado === "UP" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {e.estado}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EquiposDashboard;
