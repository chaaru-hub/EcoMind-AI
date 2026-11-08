// On your computer the FastAPI server runs separately on port 8000.
// When deployed (e.g. on Vercel) the API is served from /api on the same site.
// Set VITE_API_URL to point somewhere else.
const API_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://127.0.0.1:8000" : "/api");

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
    throw new Error("AI request failed");
  }

  return await response.json();
}