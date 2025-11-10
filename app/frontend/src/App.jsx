import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Monitor from "./pages/Monitor";

function App() {
  return (
    console.log("Versión del build:", import.meta.env.__BUILD_VERSION__);
    <Router>
      <nav className="bg-green-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-lg">Portal Docente ISI 2025</h1>
        <div className="space-x-8 text-sm sm:text-base">
          <Link to="/" className="hover:text-yellow-300 transition">
            🏠 Portal Docente
          </Link>
          <Link to="/monitor" className="hover:text-yellow-300 transition">
            📊 Monitoreo de Equipos
          </Link>
        </div>
      </nav>

      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/monitor" element={<Monitor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
