import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import { Outlet } from "react-router-dom";

import "../styles/layout.css";

function MainLayout() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <Topbar />

        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;