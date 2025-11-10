export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        Portal Docente ISI 2025
      </h1>
      <p className="text-gray-700 text-lg mb-6">
        Frontend desplegado correctamente con Vite + React + TailwindCSS
      </p>
      <a
        href="/monitor"
        className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition"
      >
        Ir al Monitoreo de Equipos 📊
      </a>
    </div>
  );
}
