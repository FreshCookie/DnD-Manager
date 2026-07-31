const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// Server sanitisiert IDs zu [a-z0-9]+ (siehe sanitizeCharId in server.js) -
// die ID muss also selbst schon rein alphanumerisch sein, sonst weicht die
// gespeicherte c.id vom tatsächlichen Dateinamen auf dem Server ab.
export function createCharId() {
  return (
    "c" +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}

export const DEFAULT_SKILLS = [
  { name: "Arcana", stat: "INT" },
  { name: "Examination", stat: "INT" },
  { name: "Finesse", stat: "DEX" },
  { name: "Influence", stat: "WIL" },
  { name: "Insight", stat: "WIL" },
  { name: "Lore", stat: "INT" },
  { name: "Might", stat: "STR" },
  { name: "Naturecraft", stat: "WIL" },
  { name: "Perception", stat: "WIL" },
  { name: "Stealth", stat: "DEX" },
];

export function createBlankChar(name) {
  return {
    id: createCharId(),
    name,
    ancestry: "",
    cls: "",
    level: 1,
    hitDice: "1d?",
    str: 0,
    dex: 0,
    int: 0,
    wil: 0,
    hp: { cur: 10, max: 10 },
    tempHp: 0,
    armor: 10,
    initiative: 0,
    wounds: { cur: 0, max: 5 },
    skills: DEFAULT_SKILLS.map((s) => ({ ...s, val: 0 })),
    inventory: [],
    abilities: [],
    notes: "",
    photos: [],
    currency: { bronze: 0, silver: 0, gold: 0, platinum: 0 },
  };
}

// Bewusst OHNE Caching: der Vorgänger cachte Liste/Charaktere 5 Minuten in
// localStorage und schrieb bei jeder Änderung diesen (ggf. veralteten) Stand
// zurück auf den Server - dadurch gingen bei Nutzung von mehreren
// Geräten/Tabs regelmäßig Charakterdaten verloren. Hier wird immer frisch
// vom Server gelesen und nie ein möglicherweise veralteter Snapshot
// zurückgeschrieben.

async function getJson(url) {
  const r = await fetch(url, { credentials: "include" });
  return r.ok ? r.json() : null;
}

async function sendJson(url, method, body) {
  const r = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return r.ok;
}

export async function fetchCharList() {
  return (await getJson(`${API_BASE_URL}/api/chars`)) || [];
}

export async function saveCharList(list) {
  return sendJson(`${API_BASE_URL}/api/chars`, "PUT", list);
}

export async function fetchChar(id) {
  return getJson(`${API_BASE_URL}/api/chars/${id}`);
}

export async function saveChar(char) {
  return sendJson(`${API_BASE_URL}/api/chars/${char.id}`, "POST", char);
}

export async function deleteChar(id) {
  await fetch(`${API_BASE_URL}/api/chars/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function fetchAdminOverview() {
  return (await getJson(`${API_BASE_URL}/api/admin/chars-overview`)) || [];
}

export async function fetchAdminChar(userId, id) {
  return getJson(`${API_BASE_URL}/api/admin/chars/${userId}/${id}`);
}

export async function saveAdminChar(userId, char) {
  return sendJson(
    `${API_BASE_URL}/api/admin/chars/${userId}/${char.id}`,
    "POST",
    char,
  );
}

export async function deleteAdminChar(userId, id) {
  await fetch(`${API_BASE_URL}/api/admin/chars/${userId}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export { compressImage } from "../../utils/imageCompression";
