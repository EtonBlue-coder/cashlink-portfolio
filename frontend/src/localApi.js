// Mode démo autonome : simule le backend entièrement côté client avec
// localStorage, pour permettre d'installer et tester l'app en PWA sans
// avoir de serveur FastAPI à disposition (ex: version hébergée sur
// GitHub Pages). Utilisé quand VITE_DEMO_MODE=true à la build.
//
// L'interface exposée est strictement identique à src/api.js (mode
// connecté à un vrai backend) afin que App.jsx n'ait pas à savoir dans
// quel mode il tourne.

const DB_KEY = "cashlink_demo_db";

const DEFAULT_RELAIS = [
  { id: "r1", name: "Family Arena Réunion", zone: "Saint-Pierre centre", active: true },
  { id: "r2", name: "Épicerie Bellevue", zone: "Terre Sainte", active: true },
  { id: "r3", name: "Snack Le Piton", zone: "Ravine Blanche", active: false },
];

function loadDb() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) return JSON.parse(raw);
  const fresh = { users: {}, deposits: [] };
  localStorage.setItem(DB_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function makeSerial(relais) {
  const prefix = relais.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return `${prefix}-${Math.floor(10000 + Math.random() * 89999)}`;
}

export const localApi = {
  async createUser(name, email) {
    await delay();
    const db = loadDb();
    const existing = Object.values(db.users).find((u) => u.email === email);
    if (existing) throw new Error("Un compte existe déjà avec cet email (démo locale).");
    const user = { id: makeId(), name, email, balance_cents: 0 };
    db.users[user.id] = user;
    saveDb(db);
    return user;
  },

  async getUser(id) {
    await delay();
    const db = loadDb();
    const user = db.users[id];
    if (!user) throw new Error("Utilisateur introuvable.");
    return user;
  },

  async listRelais() {
    await delay(150);
    return DEFAULT_RELAIS;
  },

  async createDeposit(user_id, relais_id, amount_cents) {
    await delay();
    const db = loadDb();
    const relais = DEFAULT_RELAIS.find((r) => r.id === relais_id);
    if (!relais || !relais.active) throw new Error("Point relais indisponible.");
    const deposit = {
      id: makeId(),
      user_id,
      relais_id,
      amount_cents,
      status: "pending",
      serial: makeSerial(relais),
      created_at: new Date().toISOString(),
      validated_at: null,
    };
    db.deposits.push(deposit);
    saveDb(db);
    return deposit;
  },

  async validateDeposit(id) {
    await delay();
    const db = loadDb();
    const deposit = db.deposits.find((d) => d.id === id);
    if (!deposit) throw new Error("Dépôt introuvable.");
    deposit.status = "validated";
    deposit.validated_at = new Date().toISOString();
    db.users[deposit.user_id].balance_cents += deposit.amount_cents;
    saveDb(db);
    return deposit;
  },

  async listUserDeposits(userId) {
    await delay(150);
    const db = loadDb();
    return db.deposits
      .filter((d) => d.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
};
