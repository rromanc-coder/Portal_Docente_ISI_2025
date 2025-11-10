// app/frontend/src/components/Layout.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Activity, Home, Gauge } from "lucide-react";

const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { path: "/", label: "Inicio", icon: <Home size={18} /> },
    { path: "/monitor", label: "Monitoreo", icon: <Activity size={18} /> },
    { path: "/noc", label: "NOC Técnico", icon: <Gauge size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100 transition-colors duration-500">
      {/* 🔹 Barra superior */}
      <nav className="bg-gray-950/80 border-b border-gray-700 backdrop-blur-md sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-extrabold text-lg sm:text-xl text-green-400 tracking-wide drop-shadow-[0_0_5px_#22c55e] animate-pulse">
            Portal Docente ISI 2025
          </h1>

          {/* Menú de escritorio */}
          <div className="hidden sm:flex space-x-8">
            {links.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 transition-all ${
                  location.pathname === path
                    ? "text-green-400 border-b-2 border-green-400 pb-1"
                    : "text-gray-300 hover:text-green-300 hover:scale-105"
                }`}
              >
                {icon} {label}
              </Link>
            ))}
          </div>

          {/* Botón menú móvil */}
          <button
            className="sm:hidden text-gray-300 hover:text-green-400 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menú móvil desplegable */}
        {menuOpen && (
          <div className="sm:hidden bg-gray-900 border-t border-gray-700">
            {links.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`block px-6 py-3 border-b border-gray-800 flex items-center gap-2 ${
                  location.pathname === path
                    ? "bg-gray-800 text-green-400"
                    : "text-gray-300 hover:bg-gray-800 hover:text-green-300"
                }`}
              >
                {icon} {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* 🔹 Contenido principal con efecto suave */}
      <main className="flex-1 transition-opacity duration-500 ease-in-out">
        {children}
      </main>

      {/* 🔹 Pie de página */}
      <footer className="bg-gray-950 text-gray-500 text-sm text-center py-4 border-t border-gray-800">
        © {new Date().getFullYear()} Centro Universitario UAEM Nezahualcóyotl — Ingeniería en Sistemas Inteligentes
      </footer>
    </div>
  );
};

export default Layout;
