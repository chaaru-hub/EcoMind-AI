// Display helpers shared by every page that shows devices.

const KINDS = {
  light: { emoji: "💡", category: "Lighting" },
  ac: { emoji: "❄️", category: "Cooling" },
  fan: { emoji: "🌀", category: "Cooling" },
  tv: { emoji: "📺", category: "Entertainment" },
  pc: { emoji: "🖥️", category: "Computing" },
  laptop: { emoji: "💻", category: "Computing" },
  fridge: { emoji: "🧊", category: "Kitchen" },
  microwave: { emoji: "🍽️", category: "Kitchen" },
  washing: { emoji: "🧺", category: "Laundry" },
  router: { emoji: "📡", category: "Network" },
};

export function deviceEmoji(icon) {
  return KINDS[icon]?.emoji ?? "🔌";
}

export function deviceCategory(icon) {
  return KINDS[icon]?.category ?? "Other";
}

// Colors for the category donut, in a fixed order so a category keeps its color.
export const CATEGORY_COLORS = {
  Lighting: "#efe08c",
  Cooling: "#8fa3f7",
  Entertainment: "#f39b9b",
  Computing: "#5b7cfa",
  Kitchen: "#f0a46a",
  Laundry: "#7fdc9a",
  Network: "#c4b5fd",
  Other: "#84848d",
};

export function loadByCategory(devices) {
  const totals = new Map();
  for (const d of devices) {
    if (d.status !== "ON" || !d.usage) continue;
    const c = deviceCategory(d.icon);
    totals.set(c, (totals.get(c) ?? 0) + d.usage);
  }
  return [...totals]
    .map(([name, watts]) => ({ name, watts, color: CATEGORY_COLORS[name] }))
    .sort((a, b) => b.watts - a.watts);
}
