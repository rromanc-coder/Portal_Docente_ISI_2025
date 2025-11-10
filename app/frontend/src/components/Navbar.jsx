import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Activity, Home, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Inicio", icon: <Home size={18} /> },
    { to: "/monitor", label: "Monitoreo", icon: <Activity size={18} /> },
    { to: "/config", label: "Configuración", icon: <Settings size={18} /> },
  ];

  return (
    <nav className="bg-gray-900/90 backdrop-blur-md text-white fixed w-full z-50 shadow-md border-b border-green-500/30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg sm:text-xl font-bold text-green-400 tracking-wide">
          Portal Docente ISI 2025
        </h1>

        {/* Desktop menu */}
        <div className="hidden sm:flex gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={clsx(
                "flex items-center gap-1 transition-all",
                location.pathname === l.to
                  ? "text-green-400 font-semibold"
                  : "text-gray-300 hover:text-green-300"
              )}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden p-2 hover:text-green-400 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden bg-gray-800/95 backdrop-blur-lg border-t border-green-600/30"
          >
            <div className="flex flex-col p-4 space-y-3">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={clsx(
                    "flex items-center gap-2 text-gray-300 hover:text-green-400",
                    location.pathname === l.to && "text-green-400 font-semibold"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {l.icon}
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
