import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import MonitorDashboard from "./pages/MonitorDashboard";
import EquiposDashboard from "./pages/EquiposDashboard";

function App() {
  console.log("Versión del build:", import.meta.env.__BUILD_VERSION__);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/monitor" element={<MonitorDashboard />} />
          <Route path="/equipos" element={<EquiposDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
