import { NavLink } from "react-router-dom";
import {
  LuLeaf,
  LuLayoutGrid,
  LuChartColumn,
  LuCpu,
  LuHistory,
  LuSettings,
  LuMessageCircle,
} from "react-icons/lu";

const LINKS = [
  { to: "/", label: "Dashboard", icon: LuLayoutGrid, end: true },
  { to: "/analytics", label: "Analytics", icon: LuChartColumn },
  { to: "/devices", label: "Devices", icon: LuCpu },
  { to: "/history", label: "History", icon: LuHistory },
  { to: "/ai", label: "AI Assistant", icon: LuMessageCircle },
  { to: "/settings", label: "Settings", icon: LuSettings },
];

function Sidebar() {
  return (
    <nav className="rail" aria-label="Main">
      <div className="rail-logo" title="EcoMind AI">
        <LuLeaf aria-hidden="true" />
      </div>

      <ul className="rail-nav">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className="rail-link" aria-label={label}>
              <Icon aria-hidden="true" />
              <span className="rail-tip">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="rail-foot" title="Live monitoring">
        <span className="live-dot" />
        Live
      </div>
    </nav>
  );
}

export default Sidebar;
