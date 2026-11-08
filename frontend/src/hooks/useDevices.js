import { useCallback, useEffect, useState } from "react";
import { getDevices, updateDevice } from "../services/api";

// Loads the device list and switches devices on or off through the API.
export function useDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getDevices()
      .then((data) => !cancelled && setDevices(data))
      .catch(() => !cancelled && setError("Couldn't load devices. Check that the backend is running."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const setStatus = useCallback(async (device, status) => {
    const usage = status === "ON" ? (device.usage === 0 ? 100 : device.usage) : 0;
    await updateDevice(device.id, status, usage);
    setDevices((prev) =>
      prev.map((d) => (d.id === device.id ? { ...d, status, usage } : d))
    );
  }, []);

  const toggle = useCallback(
    async (device) => {
      try {
        setError("");
        await setStatus(device, device.status === "ON" ? "OFF" : "ON");
      } catch {
        setError(`Couldn't switch ${device.name}. Try again.`);
      }
    },
    [setStatus]
  );

  const switchAllOff = useCallback(
    async (list) => {
      try {
        setError("");
        for (const d of list) {
          if (d.status === "ON") await setStatus(d, "OFF");
        }
      } catch {
        setError("Some devices didn't switch off. Try again.");
      }
    },
    [setStatus]
  );

  const online = devices.filter((d) => d.status === "ON");
  const totalWatts = online.reduce((sum, d) => sum + d.usage, 0);

  return { devices, loading, error, toggle, switchAllOff, online, totalWatts };
}
