import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Devices from "./pages/Devices";
import History from "./pages/History";
import Settings from "./pages/Settings";
import AIAssistant from "./pages/AIAssistant";

// A Claude artifact can't use URL paths, so its build keeps routes in memory.
const Router = import.meta.env.MODE === "artifact" ? MemoryRouter : BrowserRouter;

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<MainLayout />}>

          <Route index element={<Dashboard />} />

          <Route path="analytics" element={<Analytics />} />

          <Route path="devices" element={<Devices />} />

          <Route path="history" element={<History />} />

          <Route path="settings" element={<Settings />} />

          <Route path="ai" element={<AIAssistant />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;