import { useEffect, useRef, useState } from "react";

import { createRoom } from "../lib/room/scene";

function hasWebGL() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

// 3D room that mirrors the devices' on/off state.
// Clicking a device in the room calls onToggle(device).
function Room3D({ devices, onToggle }) {
  const hostRef = useRef(null);
  const roomRef = useRef(null);
  const latest = useRef({ devices, onToggle });
  const [hover, setHover] = useState(null);
  const [failed, setFailed] = useState(() => !hasWebGL());

  useEffect(() => {
    latest.current = { devices, onToggle };
  });

  useEffect(() => {
    if (failed) return undefined;
    let room;
    try {
      room = createRoom(hostRef.current, {
        onPick(id) {
          const device = latest.current.devices.find((d) => d.id === id);
          if (device) latest.current.onToggle(device);
        },
        onHover: setHover,
      });
    } catch (error) {
      console.error("3D room unavailable", error);
      queueMicrotask(() => setFailed(true));
      return undefined;
    }
    roomRef.current = room;
    room.update(latest.current.devices);
    return () => {
      roomRef.current = null;
      room.dispose();
    };
  }, [failed]);

  useEffect(() => {
    roomRef.current?.update(devices);
  }, [devices]);

  const live = devices.find((d) => d.id === hover?.id);

  return (
    <div
      className="room-stage"
      ref={hostRef}
      role="img"
      aria-label={`3D view of your home. ${devices.filter((d) => d.status === "ON").length} of ${devices.length} devices are on.`}
    >
      {failed && (
        <p className="room-fallback caption">
          Your browser can't show the 3D room. You can still switch devices in the list below.
        </p>
      )}
      {hover && live && (
        <div className="room-tip" style={{ left: hover.x, top: hover.y }}>
          <strong>{live.name}</strong>
          <span className={`status ${live.status === "ON" ? "on" : "off"}`}>
            {live.status === "ON" ? "On" : "Off"}
          </span>
          <small>Click to turn {live.status === "ON" ? "off" : "on"}</small>
        </div>
      )}
    </div>
  );
}

export default Room3D;
