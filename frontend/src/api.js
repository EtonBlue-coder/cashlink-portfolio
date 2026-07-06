import { localApi } from "./localApi.js";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Erreur API (${res.status})`);
  }
  return res.json();
}

const liveApi = {
  createUser: (name, email) =>
    request("/users", { method: "POST", body: JSON.stringify({ name, email }) }),
  getUser: (id) => request(`/users/${id}`),
  listRelais: () => request("/relais"),
  createDeposit: (user_id, relais_id, amount_cents) =>
    request("/deposits", {
      method: "POST",
      body: JSON.stringify({ user_id, relais_id, amount_cents }),
    }),
  validateDeposit: (id) => request(`/deposits/${id}/validate`, { method: "POST" }),
  listUserDeposits: (userId) => request(`/deposits/user/${userId}`),
};

// En mode démo (build GitHub Pages, VITE_DEMO_MODE=true), aucun backend
// n'est disponible : tout est simulé côté client via localStorage.
// En développement local, l'app parle au vrai backend FastAPI.
export const api = DEMO_MODE ? localApi : liveApi;
