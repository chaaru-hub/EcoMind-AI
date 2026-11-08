import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function MainLayout() {
  return (
    <div className="shell">
      <Sidebar />

      <main className="workspace">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
