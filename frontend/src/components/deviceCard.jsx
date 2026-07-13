import "../styles/Devices.css";

function DeviceCard({ icon, name, status, usage, onToggle }) {
  return (
    <div className="device-card">
      <div className="device-header">
        <span className="device-icon">{icon}</span>

        <div>
          <h3>{name}</h3>

          <p>
            Status :
            <span className={status === "ON" ? "on" : "off"}>
              {" "}
              {status}
            </span>
          </p>
        </div>
      </div>

      <div className="device-footer">
        <h2>{usage} W</h2>

        <button onClick={onToggle}>
          {status === "ON" ? "Turn OFF" : "Turn ON"}
        </button>
      </div>
    </div>
  );
}

export default DeviceCard;