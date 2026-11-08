import { useEffect, useState } from "react";

import { getEnergy } from "../services/api";

// Used until /energy answers, and if it can't be reached.
const FALLBACK = [
  { day: "Mon", usage: 2.3 },
  { day: "Tue", usage: 2.0 },
  { day: "Wed", usage: 2.8 },
  { day: "Thu", usage: 2.1 },
  { day: "Fri", usage: 3.2 },
  { day: "Sat", usage: 2.6 },
  { day: "Sun", usage: 2.1 },
];

export function useEnergy() {
  const [data, setData] = useState(FALLBACK);
  useEffect(() => {
    getEnergy()
      .then((rows) => Array.isArray(rows) && rows.length && setData(rows))
      .catch(() => {});
  }, []);
  return data;
}
