import { Link } from "react-router-dom";
import { LuSearch, LuBell, LuSettings } from "react-icons/lu";

function todayLabel() {
  const d = new Date();
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });
  const rest = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `Today, ${weekday} ${rest}`;
}

function Topbar() {
  return (
    <header className="topbar">
      <label className="search">
        <LuSearch aria-hidden="true" />
        <input type="search" placeholder="Search" aria-label="Search" />
      </label>

      <span className="topbar-date">{todayLabel()}</span>

      <div className="topbar-actions">
        <Link to="/settings" className="icon-btn" aria-label="Settings">
          <LuSettings />
        </Link>
        <button type="button" className="icon-btn" aria-label="Notifications">
          <LuBell />
        </button>
        <div className="avatar" aria-label="Chaaru Seelan">CS</div>
      </div>
    </header>
  );
}

export default Topbar;
