const LOCAL = ["localhost", "127.0.0.1"];

export const API_BASE = LOCAL.includes(window.location.hostname)
  ? "http://localhost:5000"
  : "https://potato-bnbk.onrender.com";

export async function apiFetch(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const defaults = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  return fetch(url, { ...defaults, ...opts });
}
