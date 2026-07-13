import {
  FaLeaf,
  FaBolt,
  FaChartLine,
  FaMicrochip,
  FaHistory,
  FaCog,
  FaRobot,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import "../styles/sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <FaLeaf className="logo-icon" />
        <h2>EcoMind AI</h2>
      </div>

      <ul className="menu">

        <li>
          <NavLink to="/" end>
            <FaBolt />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/analytics">
            <FaChartLine />
            <span>Analytics</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/devices">
            <FaMicrochip />
            <span>Devices</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/history">
            <FaHistory />
            <span>History</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/settings">
            <FaCog />
            <span>Settings</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/ai">
            <FaRobot />
            <span>AI Assistant</span>
          </NavLink>
        </li>

      </ul>
    </aside>
  );
}

export default Sidebar;