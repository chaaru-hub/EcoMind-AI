// Artifact build of services/api.js (used by `npm run build:artifact`).
//
// Same functions and return shapes as api.js, but there is no FastAPI
// backend inside a Claude artifact, so:
//   - devices start from data/devices.json and on/off changes are saved to
//     the artifact's built-in database (the `db` capability),
//   - energy data comes from data/energy.csv, bundled at build time,
//   - the AI Assistant asks Claude (the `sample` capability) instead of Groq.

import defaultDevices from "../../../data/devices.json";
import energyCsv from "../../../data/energy.csv?raw";

const DEVICES = "devices";

function capability(name) {
  return window.claude?.use ? window.claude.use(name) : Promise.resolve(null);
}

// --------------------
// Get Devices
// --------------------
export async function getDevices() {
  const devices = defaultDevices.map((d) => ({ ...d }));
  const db = await capability("db");
  if (!db) return devices;

  try {
    const snap = await db.collection(DEVICES).get();
    const saved = new Map(snap.docs.map((doc) => [doc.id, doc.data()]));
    return devices.map((d) => {
      const s = saved.get(String(d.id));
      return s ? { ...d, status: s.status, usage: s.usage } : d;
    });
  } catch (error) {
    console.error("Could not load saved device states", error);
    return devices;
  }
}

// --------------------
// Update Device
// --------------------
export async function updateDevice(id, status, usage) {
  const db = await capability("db");
  if (db) {
    try {
      await db.collection(DEVICES).doc(String(id)).set({ status, usage });
    } catch (error) {
      // Viewers without write access still get the toggle for this visit.
      console.error("Could not save device state", error);
    }
  }
  return { message: "Device updated successfully" };
}

// --------------------
// Get Energy
// --------------------
export async function getEnergy() {
  const [header, ...rows] = energyCsv.trim().split(/\r?\n/);
  const keys = header.split(",");
  return rows.map((row) => {
    const values = row.split(",");
    return Object.fromEntries(
      keys.map((k, i) => [k, isNaN(values[i]) ? values[i] : Number(values[i])])
    );
  });
}

// --------------------
// AI Chat
// --------------------
const SYSTEM_PROMPT = `You are EcoMind AI, an AI energy management assistant.
Always answer in a helpful way. Give practical electricity saving advice.
Keep answers short. If possible mention: energy savings, cost savings,
smart home tips, environmental impact.`;

export async function askAI(question) {
  const sample = await capability("sample");
  if (!sample) {
    throw new Error("AI chat is not available in this view");
  }

  const devices = await getDevices();
  const deviceSummary = devices
    .map((d) => `${d.name}: ${d.status}, ${d.usage} W`)
    .join("\n");

  const result = await sample(
    [
      {
        role: "user",
        content: `${SYSTEM_PROMPT}\n\nThe user's smart devices right now:\n${deviceSummary}`,
      },
      { role: "user", content: question },
    ],
    { cache: false }
  );

  return { reply: result.text };
}
