// app/frontend/src/pages/Home.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Brain,
} from "lucide-react";

const sections = [
  {
    title: "Monitoreo de Equipos",
    icon: <Activity size={40} />,
    color: "from-green-600 to-emerald-400",
    desc: "Supervisa el estado y disponibilidad de los proyectos PLN e ITM.",
    link: "/monitor",
  },
  {
    title: "Gestión de Clases",
    icon: <BookOpen size={40} />,
    color: "from-blue-600 to-cyan-400",
    desc: "Accede a material, entregas y sesiones del curso.",
    link: "#",
  },
  {
    title: "Alumnos y Equipos",
    icon: <Users size={40} />,
    color: "from-purple-600 to-pink-400",
    desc: "Consulta los equipos, participantes y asignaciones.",
    link: "#",
  },
  {
    title: "Reportes de Actividad",
    icon: <BarChart3 size={40} />,
    color: "from-yellow-500 to-orange-400",
    desc: "Analiza el rendimiento de los proyectos y servicios.",
    link: "#",
  },
  {
    title: "Configuración del Portal",
    icon: <Settings size={40} />,
    color: "from-gray-600 to-gray-300",
    desc: "Personaliza la apariencia y comportamiento del sistema.",
    link: "#",
  },
  {
    title: "Inteligencia Artificial",
    icon: <Brain size={40} />,
    color: "from-indigo-600 to-violet-400",
    desc: "Accede a herramientas de asistencia con IA para desarrollo y aprendizaje.",
    link: "#",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center text-gray-100 bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* 🔹 Encabezado principal */}
      <header className="text-center mt-12 mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold text-green-400 mb-3 drop-shadow-[0_0_5px_#22c55e]"
        >
          Bienvenido al Portal Docente ISI 2025
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Supervisión académica, monitoreo de servicios y soporte para tus clases —
          todo en un solo entorno interactivo y moderno.
        </motion.p>
      </header>

      {/* 🔹 Secciones interactivas */}
      <section className="grid gap-6 px-4 pb-16 max-w-6xl w-full sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((sec, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className={`rounded-2xl p-6 cursor-pointer bg-gradient-to-br ${sec.color} shadow-lg hover:shadow-2xl hover:brightness-110`}
          >
            <Link to={sec.link || "#"} className="block h-full">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="text-white drop-shadow-lg">{sec.icon}</div>
                <h3 className="text-xl font-semibold text-white">{sec.title}</h3>
                <p className="text-sm text-white/90">{sec.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* 🔹 Pie de página */}
      <footer className="mb-6 text-sm text-gray-500 text-center px-4">
        <p>
          Desarrollado con 💚 por estudiantes de{" "}
          <span className="text-green-400 font-semibold">
            Ingeniería en Sistemas Inteligentes – UAEM Nezahualcóyotl
          </span>
        </p>
      </footer>
    </div>
  );
}
