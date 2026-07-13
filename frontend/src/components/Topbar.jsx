import {
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

import "../styles/topbar.css";

function Topbar() {

  return (

    <header className="topbar">

      <div className="search-box">

        <FaSearch />

        <input
          type="text"
          placeholder="Search..."
        />

      </div>

      <div className="top-icons">

        <FaBell className="icon"/>

        <FaUserCircle className="profile"/>

      </div>

    </header>

  );

}

export default Topbar;