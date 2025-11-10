import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Monitor from "./pages/Monitor";

function App() {
  return (
    <Router>
      <nav className="bg-green-800 text-white p-4 flex justify-between">
        <h1 className="font-bold">Portal Docente ISI 2025</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">🏠 Portal Docente</Link>
          <Link to="/monitor" className="hover:underline">📊 Monitoreo de Equipos</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/monitor" element={<Monitor />} />
      </Routes>
    </Router>
  );
}
export default App;
