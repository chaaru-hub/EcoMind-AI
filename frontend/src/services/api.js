// The API is always reached at /api on the same site: on Vercel a rewrite
// routes it to the backend service, and in `npm run dev` Vite proxies it to
// the FastAPI server on port 8000 (see vite.config.js).
// Set VITE_API_URL to use a backend somewhere else.
const API_URL = import.meta.env.VITE_API_URL ?? "/api";

// --------------------
// Get Devices
// --------------------
export async function getDevices() {
  const response = await fetch(`${API_URL}/devices`);

  if (!response.ok) {
    throw new Error("Failed to fetch devices");
  }

  return await response.json();
}

// --------------------
// Update Device
// --------------------
export async function updateDevice(id, status, usage) {
  const response = await fetch(`${API_URL}/devices/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
      usage,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update device");
  }

  return await response.json();
}

// --------------------
// Get Energy
// --------------------
export async function getEnergy() {
  const response = await fetch(`${API_URL}/energy`);

  if (!response.ok) {
    throw new Error("Failed to fetch energy");
  }

  return await response.json();
}

// --------------------
// AI Chat
// --------------------
export async function askAI(question) {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
    }),
  });

  if (!response.ok) {
    // the backend explains what went wrong, e.g. a missing GROQ_API_KEY
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "AI request failed");
  }

  return await response.json();
}