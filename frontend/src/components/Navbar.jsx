import { FaLeaf } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <FaLeaf className="logo-icon" />
        <h2>EcoMind AI</h2>
      </div>

      <ul className="nav-links">
        <li>Dashboard</li>
        <li>History</li>
        <li>Settings</li>
      </ul>
    </nav>
  );
}

export default Navbar;