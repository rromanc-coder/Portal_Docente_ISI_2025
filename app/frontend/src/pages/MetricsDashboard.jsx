import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Activity, PieChart as PieIcon, BarChart2 } from "lucide-react";

const REFRESH_INTERVAL = 10000; // 10 segundos

export default function MetricsDashboard() {
  const [data, setData] = useState([]);
  const [latencyHistory, setLatencyHistory] = useState([]);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/monitor/status");
      const json = await res.json();
      const services = json.services || [];
      setData(services);

      // Guardar histórico
      const now = new Date().toLocaleTimeString();
      const avgPLN =
        services
          .filter((s) => s.name.startsWith("PLN"))
          .reduce((a, b) => a + (b.latency_ms || 0), 0) /
        services.filter((s) => s.name.startsWith("PLN")).length;

      const avgITM =
        services
          .filter((s) => s.name.startsWith("ITM"))
          .reduce((a, b) => a + (b.latency_ms || 0), 0) /
        services.filter((s) => s.name.startsWith("ITM")).length;

      setLatencyHistory((prev) => [
        ...prev.slice(-20), // solo 20 puntos para evitar explosión
        { time: now, pln: avgPLN || 0, itm: avgITM || 0 },
      ]);
    } catch (err) {
      console.error("Error obteniendo métricas:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const COLORS = ["#16a34a", "#dc2626", "#eab308"];

  const upCount = data.filter((s) => s.status === "UP").length;
  const downCount = data.filter((s) => s.status === "DOWN").length;
  const slowCount = data.filter(
    (s) => s.latency_ms && s.latency_ms > 800
  ).length;

  const statusPieData = [
    { name: "UP", value: upCount },
    { name: "DOWN", value: downCount },
    { name: "Lentos", value: slowCount },
  ];

  // Formato latencias por equipo
  const latencyByTeam = data.map((s) => ({
    name: s.name,
    latency: s.latency_ms || 0,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <header className="bg-gray-900/80 border border-gray-700 rounded-xl p-4 flex items-center gap-3 shadow-lg">
          <Activity className="text-green-400" size={28} />
          <h1 className="text-3xl font-bold text-green-400">
            Métricas del Sistema — NOC ISI 2025
          </h1>
        </header>

        {/* Pie chart — UP/DOWN/SLOW */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900/40 rounded-xl border border-gray-700 p-6 shadow-md"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <PieIcon /> Estado general de servicios
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusPieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {statusPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Latencia PLN vs ITM */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900/40 rounded-xl border border-gray-700 p-6 shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart2 /> Latencia promedio PLN vs ITM
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={latencyHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pln" stroke="#60a5fa" />
              <Line type="monotone" dataKey="itm" stroke="#a78bfa" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Latencia individual por servicio */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900/40 rounded-xl border border-gray-700 p-6 shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">Latencia individual por servicio</h2>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={latencyByTeam}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#aaa" interval={0} tick={{ fontSize: 10 }} />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="latency" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

      </div>
    </div>
  );
}
