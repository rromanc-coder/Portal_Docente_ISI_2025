import { useEffect, useState } from "react";

export default function Monitor() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://10.5.20.50:9090/monitor/api/status")
      .then((res) => res.json())
      .then((json) => setData(json.services || []))
      .catch(() => setData([]));
  }, []);

  const getColor = (latency) => {
    if (latency === null) return "bg-red-600";
    if (latency < 100) return "bg-green-600";
    if (latency < 300) return "bg-yellow-500";
    return "bg-orange-600";
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">📊 Monitoreo de Equipos</h2>
      <table className="min-w-full border border-gray-300 text-left">
        <thead className="bg-green-700 text-white">
          <tr>
            <th className="p-2">Servicio</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Latencia (ms)</th>
            <th className="p-2">Acceso</th>
            <th className="p-2">Repositorio</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.status}</td>
              <td className={`p-2 text-white ${getColor(s.latency_ms)}`}>
                {s.latency_ms !== null ? s.latency_ms : "N/A"}
              </td>
              <td className="p-2">
                <a href={s.url} target="_blank" className="text-blue-600 hover:underline">Ver /health</a>
              </td>
              <td className="p-2">
                <a href={s.repo} target="_blank" className="text-blue-600 hover:underline">Repo</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6">
        <a href="/" className="text-green-700 hover:underline">⬅ Volver al Portal Docente</a>
      </div>
    </div>
  );
}
