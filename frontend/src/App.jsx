import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Devices from "./pages/Devices";
import History from "./pages/History";
import Settings from "./pages/Settings";
import AIAssistant from "./pages/AIAssistant";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;