// app/frontend/src/pages/Monitor.jsx
import { useEffect, useState } from "react";

export default function Monitor() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✔ Usa el proxy de Nginx: /api → proyecto_isi_backend:80
    fetch("/api/monitor/status")
      .then((res) => res.json())
      .then((json) => {
        setData(json.services || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Monitor de Servicios</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Servicio</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Latencia (ms)</th>
              <th className="p-2 border">URL</th>
              <th className="p-2 border">Repo</th>
            </tr>
          </thead>
          <tbody>
            {data.map((s, i) => (
              <tr key={i}>
                <td className="p-2 border">{s.name}</td>
                <td className={`p-2 border ${s.status === "UP" ? "text-green-700" : "text-red-700"}`}>
                  {s.status}
                </td>
                <td className="p-2 border">{s.latency_ms ?? "-"}</td>
                <td className="p-2 border">
                  <a href={s.url} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                    {s.url}
                  </a>
                </td>
                <td className="p-2 border">
                  <a href={s.repo} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                    {s.repo}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-6">
        <a href="/" className="text-green-700 hover:underline">
          ⬅ Volver al Portal Docente
        </a>
      </div>
    </div>
  );
}
